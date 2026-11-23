'use server';

import { z } from 'zod';
import { requireStaff as requireAdmin, recordAuditLog } from '@/lib/auth/server';
import { db } from '@/lib/db';
import {
  whatsappChannels,
  whatsappBroadcasts,
  cities,
  establishments,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const channelSchema = z.object({
  cityId: z.string().uuid('Selecione uma cidade válida.'),
  name: z.string().min(3, 'Informe o nome do grupo ou lista de transmissão.'),
  neighborhoodOrScope: z.string().min(2, 'Informe o bairro ou escopo de alcance.'),
  inviteLink: z
    .string()
    .url('Informe uma URL válida do WhatsApp (chat.whatsapp.com/...)')
    .optional()
    .or(z.literal('')),
  memberCount: z.coerce.number().min(0, 'A quantidade não pode ser negativa.').default(0),
});

const broadcastSchema = z.object({
  cityId: z.string().uuid('Selecione uma cidade válida.'),
  channelId: z.string().uuid().optional().or(z.literal('')),
  establishmentId: z.string().uuid().optional().or(z.literal('')),
  category: z.enum(['public_utility', 'civic_alert', 'partner_offer', 'local_news']),
  title: z.string().min(3, 'O título do comunicado deve ter ao menos 3 caracteres.'),
  messageBody: z.string().min(10, 'O corpo da mensagem deve ter ao menos 10 caracteres.'),
  ctaUrl: z.string().url('Informe um link válido.').optional().or(z.literal('')),
});

export type WhatsappActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  formattedPreview?: string;
};

/**
 * Formata estruturadamente um comunicado oficial para distribuição no WhatsApp
 */
function buildStructuredWhatsappMessage(params: {
  category: 'public_utility' | 'civic_alert' | 'partner_offer' | 'local_news';
  cityName: string;
  cityState: string;
  title: string;
  messageBody: string;
  establishmentName?: string | null;
  ctaUrl?: string | null;
}): string {
  const categoryBadges: Record<string, string> = {
    public_utility: '📢 *UTILIDADE PÚBLICA • PULSO*',
    civic_alert: '🚨 *ALERTA DA CIDADE • PULSO*',
    partner_offer: '🏷️ *DESTAQUE DO COMÉRCIO LOCAL • PULSO*',
    local_news: '📰 *INFORME COMUNITÁRIO • PULSO*',
  };

  const lines: string[] = [
    categoryBadges[params.category] || '📢 *COMUNICADO PULSO*',
    `📍 _${params.cityName} - ${params.cityState}_`,
    '',
    `*${params.title.toUpperCase()}*`,
  ];

  if (params.establishmentName) {
    lines.push(`🏢 Parceiro: *${params.establishmentName}*`);
  }

  lines.push('', params.messageBody.trim());

  if (params.ctaUrl) {
    lines.push('', `🔗 *Acesse:* ${params.ctaUrl}`);
  }

  lines.push(
    '',
    '━━━━━━━━━━━━━━━━━━━━',
    '📻 *PULSO — Rede de Comunicação Local*'
  );

  return lines.join('\n');
}

/**
 * Cadastra um novo grupo ou lista de transmissão comunitária do WhatsApp.
 */
export async function createWhatsappChannelAction(
  prevState: WhatsappActionState,
  formData: FormData
): Promise<WhatsappActionState> {
  const admin = await requireAdmin();

  const rawData = {
    cityId: formData.get('cityId')?.toString() || '',
    name: formData.get('name')?.toString()?.trim() || '',
    neighborhoodOrScope: formData.get('neighborhoodOrScope')?.toString()?.trim() || '',
    inviteLink: formData.get('inviteLink')?.toString()?.trim() || '',
    memberCount: formData.get('memberCount')?.toString() || '0',
  };

  const validation = channelSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Verifique os campos do canal de transmissão.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const [created] = await db
    .insert(whatsappChannels)
    .values({
      cityId: validation.data.cityId,
      name: validation.data.name,
      neighborhoodOrScope: validation.data.neighborhoodOrScope,
      inviteLink: validation.data.inviteLink || null,
      memberCount: validation.data.memberCount,
      isActive: true,
    })
    .returning();

  await recordAuditLog({
    actorId: admin.id,
    action: 'whatsapp_channel_created',
    details: {
      channelId: created.id,
      name: created.name,
      scope: created.neighborhoodOrScope,
    },
  });

  revalidatePath('/admin/whatsapp');
  return { success: true };
}

/**
 * Alterna status ativo/inativo de um grupo ou lista de transmissão.
 */
export async function toggleWhatsappChannelAction(channelId: string, isActive: boolean) {
  const admin = await requireAdmin();

  await db
    .update(whatsappChannels)
    .set({ isActive })
    .where(eq(whatsappChannels.id, channelId));

  await recordAuditLog({
    actorId: admin.id,
    action: isActive ? 'whatsapp_channel_activated' : 'whatsapp_channel_deactivated',
    details: { channelId },
  });

  revalidatePath('/admin/whatsapp');
}

/**
 * Remove um grupo ou lista de transmissão.
 */
export async function deleteWhatsappChannelAction(channelId: string) {
  const admin = await requireAdmin();

  await db.delete(whatsappChannels).where(eq(whatsappChannels.id, channelId));

  await recordAuditLog({
    actorId: admin.id,
    action: 'whatsapp_channel_deleted',
    details: { channelId },
  });

  revalidatePath('/admin/whatsapp');
}

/**
 * Registra e formata um comunicado comunitário ou disparo comercial no histórico.
 */
export async function createWhatsappBroadcastAction(
  prevState: WhatsappActionState,
  formData: FormData
): Promise<WhatsappActionState> {
  const admin = await requireAdmin();

  const rawData = {
    cityId: formData.get('cityId')?.toString() || '',
    channelId: formData.get('channelId')?.toString() || '',
    establishmentId: formData.get('establishmentId')?.toString() || '',
    category: formData.get('category')?.toString() || 'public_utility',
    title: formData.get('title')?.toString()?.trim() || '',
    messageBody: formData.get('messageBody')?.toString()?.trim() || '',
    ctaUrl: formData.get('ctaUrl')?.toString()?.trim() || '',
  };

  const validation = broadcastSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Preencha todos os campos obrigatórios do comunicado.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { cityId, channelId, establishmentId, category, title, messageBody, ctaUrl } =
    validation.data;

  const cityRecords = await db.select().from(cities).where(eq(cities.id, cityId)).limit(1);
  const city = cityRecords[0];
  if (!city) {
    return { error: 'Cidade selecionada não encontrada.' };
  }

  let establishmentName: string | null = null;
  if (establishmentId) {
    const estRecords = await db
      .select()
      .from(establishments)
      .where(eq(establishments.id, establishmentId))
      .limit(1);
    establishmentName = estRecords[0]?.name || null;
  }

  const formattedMessage = buildStructuredWhatsappMessage({
    category,
    cityName: city.name,
    cityState: city.state,
    title,
    messageBody,
    establishmentName,
    ctaUrl: ctaUrl || null,
  });

  const [broadcast] = await db
    .insert(whatsappBroadcasts)
    .values({
      cityId,
      channelId: channelId || null,
      establishmentId: establishmentId || null,
      authorId: admin.id,
      category,
      title,
      messageBody,
      formattedMessage,
      ctaUrl: ctaUrl || null,
      dispatchedAt: new Date(),
    })
    .returning();

  await recordAuditLog({
    actorId: admin.id,
    action: 'whatsapp_broadcast_dispatched',
    details: {
      broadcastId: broadcast.id,
      category,
      title,
      channelId: channelId || 'all_channels',
    },
  });

  revalidatePath('/admin/whatsapp');
  return {
    success: true,
    formattedPreview: formattedMessage,
  };
}

/**
 * Exclui um registro de disparo do histórico.
 */
export async function deleteWhatsappBroadcastAction(broadcastId: string) {
  const admin = await requireAdmin();

  await db.delete(whatsappBroadcasts).where(eq(whatsappBroadcasts.id, broadcastId));

  await recordAuditLog({
    actorId: admin.id,
    action: 'whatsapp_broadcast_deleted',
    details: { broadcastId },
  });

  revalidatePath('/admin/whatsapp');
}
