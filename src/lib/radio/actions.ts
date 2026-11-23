'use server';

import { z } from 'zod';
import { requireStaff as requireAdmin, recordAuditLog } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { spots, radioSchedules, cities, establishments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const createSpotSchema = z.object({
  title: z.string().min(2, 'O título do spot deve ter no mínimo 2 caracteres'),
  establishmentId: z.string().uuid().optional().or(z.literal('')),
  durationSeconds: z.coerce.number().min(1, 'A duração mínima é de 1 segundo').max(300, 'A duração máxima é de 300 segundos'),
  audioUrl: z.string().url('URL de áudio inválida').optional().or(z.literal('')),
});

const createScheduleSchema = z.object({
  spotId: z.string().uuid('Selecione um spot válido'),
  cityId: z.string().uuid('Selecione uma cidade válida'),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido (formato HH:mm)'),
  daysOfWeek: z.string().min(1, 'Selecione os dias da semana'),
});

export type RadioActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Criação de Spot Comercial / Vinheta Institucional.
 * Faz upload do arquivo de áudio para o Supabase Storage (se enviado) ou utiliza a URL informada.
 */
export async function createSpotAction(
  prevState: RadioActionState,
  formData: FormData
): Promise<RadioActionState> {
  const admin = await requireAdmin();

  const title = formData.get('title')?.toString()?.trim() || '';
  const establishmentId = formData.get('establishmentId')?.toString() || '';
  const durationSeconds = formData.get('durationSeconds');
  let audioUrl = formData.get('audioUrl')?.toString()?.trim() || '';
  const audioFile = formData.get('audioFile') as File | null;

  // 1. Processar upload se um arquivo de áudio foi anexado
  if (audioFile && audioFile.size > 0) {
    if (audioFile.size > 15 * 1024 * 1024) {
      return { error: 'O arquivo de áudio ultrapassa o limite máximo de 15MB.' };
    }

    const supabase = await createClient();
    const cleanFileName = audioFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `spots/${Date.now()}_${cleanFileName}`;

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('radio-spots')
      .upload(storagePath, buffer, {
        contentType: audioFile.type || 'audio/mpeg',
        upsert: false,
      });

    if (uploadError) {
      return { error: `Falha no upload do áudio: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from('radio-spots')
      .getPublicUrl(storagePath);

    audioUrl = publicUrlData.publicUrl;
  }

  // 2. Validação dos campos
  const validation = createSpotSchema.safeParse({
    title,
    establishmentId: establishmentId || undefined,
    durationSeconds,
    audioUrl,
  });

  if (!validation.success) {
    return {
      error: 'Preencha os campos obrigatórios corretamente.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  if (!audioUrl) {
    return {
      error: 'Envie um arquivo de áudio (.mp3, .wav) ou informe uma URL direta para a mídia.',
    };
  }

  // 3. Persistência no PostgreSQL
  const [newSpot] = await db
    .insert(spots)
    .values({
      title: validation.data.title,
      establishmentId: validation.data.establishmentId || null,
      durationSeconds: validation.data.durationSeconds,
      audioUrl,
      isActive: true,
    })
    .returning();

  await recordAuditLog({
    actorId: admin.id,
    action: 'radio_spot_created',
    details: {
      spotId: newSpot.id,
      title: newSpot.title,
      durationSeconds: newSpot.durationSeconds,
    },
  });

  revalidatePath('/admin/radio');
  return { success: true };
}

/**
 * Alterna ativação de Spot Comercial.
 */
export async function toggleSpotStatusAction(spotId: string, isActive: boolean) {
  const admin = await requireAdmin();

  await db
    .update(spots)
    .set({ isActive })
    .where(eq(spots.id, spotId));

  await recordAuditLog({
    actorId: admin.id,
    action: isActive ? 'radio_spot_activated' : 'radio_spot_deactivated',
    details: { spotId },
  });

  revalidatePath('/admin/radio');
}

/**
 * Exclusão de Spot Comercial.
 */
export async function deleteSpotAction(spotId: string) {
  const admin = await requireAdmin();

  // Remove agendamentos associados
  await db.delete(radioSchedules).where(eq(radioSchedules.spotId, spotId));
  // Remove o spot
  await db.delete(spots).where(eq(spots.id, spotId));

  await recordAuditLog({
    actorId: admin.id,
    action: 'radio_spot_deleted',
    details: { spotId },
  });

  revalidatePath('/admin/radio');
}

/**
 * Criação de Agendamento na Grade Semanal de Transmissão.
 */
export async function createScheduleAction(
  prevState: RadioActionState,
  formData: FormData
): Promise<RadioActionState> {
  const admin = await requireAdmin();

  const rawData = {
    spotId: formData.get('spotId')?.toString() || '',
    cityId: formData.get('cityId')?.toString() || '',
    scheduledTime: formData.get('scheduledTime')?.toString()?.trim() || '',
    daysOfWeek: formData.get('daysOfWeek')?.toString()?.trim() || '',
  };

  const validation = createScheduleSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Preencha todos os parâmetros do agendamento.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const [newSchedule] = await db
    .insert(radioSchedules)
    .values({
      spotId: validation.data.spotId,
      cityId: validation.data.cityId,
      scheduledTime: validation.data.scheduledTime,
      daysOfWeek: validation.data.daysOfWeek,
      isActive: true,
    })
    .returning();

  await recordAuditLog({
    actorId: admin.id,
    action: 'radio_schedule_created',
    details: {
      scheduleId: newSchedule.id,
      spotId: newSchedule.spotId,
      time: newSchedule.scheduledTime,
    },
  });

  revalidatePath('/admin/radio');
  return { success: true };
}

/**
 * Alterna ativação de Agendamento na Grade.
 */
export async function toggleScheduleStatusAction(scheduleId: string, isActive: boolean) {
  const admin = await requireAdmin();

  await db
    .update(radioSchedules)
    .set({ isActive })
    .where(eq(radioSchedules.id, scheduleId));

  await recordAuditLog({
    actorId: admin.id,
    action: isActive ? 'radio_schedule_activated' : 'radio_schedule_deactivated',
    details: { scheduleId },
  });

  revalidatePath('/admin/radio');
}

/**
 * Exclusão de Agendamento da Grade.
 */
export async function deleteScheduleAction(scheduleId: string) {
  const admin = await requireAdmin();

  await db.delete(radioSchedules).where(eq(radioSchedules.id, scheduleId));

  await recordAuditLog({
    actorId: admin.id,
    action: 'radio_schedule_deleted',
    details: { scheduleId },
  });

  revalidatePath('/admin/radio');
}

/**
 * Criação Rápida de Cidade (para associação de spots e comércios).
 */
export async function createCityAction(formData: FormData) {
  const admin = await requireAdmin();
  const name = formData.get('name')?.toString()?.trim() || '';
  const state = formData.get('state')?.toString()?.trim()?.toUpperCase() || 'MG';
  const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-');

  if (!name) throw new Error('Nome da cidade obrigatório');

  const [newCity] = await db
    .insert(cities)
    .values({
      name,
      state,
      slug,
      isActive: true,
    })
    .onConflictDoNothing()
    .returning();

  if (newCity) {
    await recordAuditLog({
      actorId: admin.id,
      action: 'city_created',
      details: { cityId: newCity.id, name: newCity.name },
    });
  }

  revalidatePath('/admin/radio');
  revalidatePath('/admin/comercios');
}
