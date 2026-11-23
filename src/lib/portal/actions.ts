'use server';

import { z } from 'zod';
import { requireMerchant, requireStaff as requireAdmin, recordAuditLog } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { establishments, spotRequests } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const updateOwnEstablishmentSchema = z.object({
  establishmentId: z.string().uuid('Estabelecimento inválido.'),
  name: z.string().min(2, 'O nome do estabelecimento é obrigatório.'),
  whatsapp: z.string().min(10, 'Informe um WhatsApp com DDD válido.'),
  address: z.string().optional(),
  description: z.string().optional(),
});

const createSpotRequestSchema = z.object({
  establishmentId: z.string().uuid('Selecione seu estabelecimento.'),
  title: z.string().min(3, 'Informe um título para a campanha ou spot.'),
  scriptNotes: z
    .string()
    .min(10, 'Descreva o texto, oferta ou orientações para gravação do spot.'),
  preferredTimeSlot: z.string().optional(),
});

export type PortalActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Permite ao comerciante parceiro atualizar os dados públicos do SEU próprio estabelecimento.
 * Valida estritamente no servidor que o estabelecimento pertence ao comerciante autenticado (ou admin).
 */
export async function updateMerchantEstablishmentAction(
  prevState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const merchant = await requireMerchant();

  const rawData = {
    establishmentId: formData.get('establishmentId')?.toString() || '',
    name: formData.get('name')?.toString()?.trim() || '',
    whatsapp: formData.get('whatsapp')?.toString()?.trim() || '',
    address: formData.get('address')?.toString()?.trim() || '',
    description: formData.get('description')?.toString()?.trim() || '',
  };

  const validation = updateOwnEstablishmentSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Verifique os dados informados.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { establishmentId, name, whatsapp, address, description } = validation.data;

  // Guarda de Propriedade Estrita: Verifica se o estabelecimento pertence ao comerciante logado
  const records = await db
    .select()
    .from(establishments)
    .where(eq(establishments.id, establishmentId))
    .limit(1);

  const targetEst = records[0];
  if (!targetEst) {
    return { error: 'Estabelecimento não encontrado.' };
  }

  if (merchant.role !== 'admin' && targetEst.ownerId !== merchant.id) {
    return {
      error: 'Acesso negado: você só pode editar estabelecimentos vinculados à sua conta.',
    };
  }

  await db
    .update(establishments)
    .set({
      name,
      whatsapp,
      address: address || null,
      description: description || null,
      updatedAt: new Date(),
    })
    .where(eq(establishments.id, establishmentId));

  await recordAuditLog({
    actorId: merchant.id,
    action: 'merchant_updated_establishment',
    details: {
      establishmentId,
      name,
    },
  });

  revalidatePath('/portal');
  revalidatePath('/guia');
  revalidatePath('/admin/comercios');
  return { success: true };
}

/**
 * Permite ao comerciante solicitar a produção/veiculação de um novo Spot na Rádio Digital.
 */
export async function createSpotRequestAction(
  prevState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const merchant = await requireMerchant();

  const rawData = {
    establishmentId: formData.get('establishmentId')?.toString() || '',
    title: formData.get('title')?.toString()?.trim() || '',
    scriptNotes: formData.get('scriptNotes')?.toString()?.trim() || '',
    preferredTimeSlot: formData.get('preferredTimeSlot')?.toString()?.trim() || '',
  };

  const validation = createSpotRequestSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Preencha todos os campos obrigatórios da solicitação.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { establishmentId, title, scriptNotes, preferredTimeSlot } = validation.data;

  // Confirma propriedade do estabelecimento
  const estRecords = await db
    .select()
    .from(establishments)
    .where(
      merchant.role === 'admin'
        ? eq(establishments.id, establishmentId)
        : and(
            eq(establishments.id, establishmentId),
            eq(establishments.ownerId, merchant.id)
          )
    )
    .limit(1);

  if (!estRecords[0]) {
    return {
      error: 'Estabelecimento inválido ou não vinculado ao seu perfil de comerciante.',
    };
  }

  const [created] = await db
    .insert(spotRequests)
    .values({
      establishmentId,
      merchantId: merchant.id,
      title,
      scriptNotes,
      preferredTimeSlot: preferredTimeSlot || null,
      status: 'pending',
    })
    .returning();

  await recordAuditLog({
    actorId: merchant.id,
    action: 'merchant_spot_request_created',
    details: {
      requestId: created.id,
      establishmentId,
      title,
    },
  });

  revalidatePath('/portal');
  revalidatePath('/admin/radio');
  return { success: true };
}

/**
 * Ação Administrativa para atualizar o status de uma solicitação de spot de comerciante.
 */
export async function updateSpotRequestStatusAction(
  requestId: string,
  status: 'pending' | 'approved' | 'produced' | 'rejected',
  adminFeedback?: string
) {
  const admin = await requireAdmin();

  await db
    .update(spotRequests)
    .set({
      status,
      adminFeedback: adminFeedback || null,
      updatedAt: new Date(),
    })
    .where(eq(spotRequests.id, requestId));

  await recordAuditLog({
    actorId: admin.id,
    action: 'spot_request_status_updated',
    details: {
      requestId,
      status,
    },
  });

  revalidatePath('/admin/radio');
  revalidatePath('/portal');
}
