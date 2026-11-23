'use server';

import { z } from 'zod';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { leads, establishments, invitations, securityEvents } from '@/lib/db/schema';
import { eq, and, gt, sql } from 'drizzle-orm';
import {
  requireAdmin as requireSuperAdmin,
  requireStaff,
  recordAuditLog,
  recordSecurityEvent,
} from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

const leadSchema = z.object({
  nome: z.string().min(2, 'Por favor, informe seu nome completo.'),
  empresa: z.string().min(2, 'Informe o nome do seu comércio, negócio ou órgão público.'),
  segmento: z.string().min(1, 'Selecione o segmento.'),
  cidade: z.string().min(2, 'Informe a sua cidade.'),
  estado: z.string().min(2, 'Informe o estado (UF).'),
  whatsapp: z.string().min(10, 'Informe um número de WhatsApp com DDD válido.'),
  email: z.string().email('E-mail em formato inválido.').optional().or(z.literal('')),
  mensagem: z.string().optional(),
  concordaTermos: z.boolean().refine((val) => val === true, {
    message: 'É necessário concordar com os termos de privacidade para continuar.',
  }),
});

const convertLeadSchema = z.object({
  leadId: z.string().uuid('Lead inválido.'),
  establishmentName: z.string().min(2, 'O nome do estabelecimento é obrigatório.'),
  cityId: z.string().uuid('Selecione uma cidade válida.'),
  categoryId: z.string().uuid('Selecione uma categoria válida.'),
  whatsapp: z.string().min(10, 'Informe um WhatsApp válido.'),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string().optional(),
  generateInvite: z.boolean().default(true),
});

export type LeadActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type ConvertLeadState = {
  success?: boolean;
  error?: string;
  inviteUrl?: string;
  establishmentName?: string;
};

/**
 * Ação de Servidor para Recepção e Persistência de Leads Institucionais.
 * Grava o lead diretamente no PostgreSQL na tabela `leads`.
 */
export async function submitLeadAction(
  prevState: LeadActionState,
  formData: FormData
): Promise<LeadActionState> {
  const rawData = {
    nome: formData.get('nome')?.toString()?.trim() || '',
    empresa: formData.get('empresa')?.toString()?.trim() || '',
    segmento: formData.get('segmento')?.toString()?.trim() || 'comercio',
    cidade: formData.get('cidade')?.toString()?.trim() || '',
    estado: formData.get('estado')?.toString()?.trim()?.toUpperCase() || 'MG',
    whatsapp: formData.get('whatsapp')?.toString()?.trim() || '',
    email: formData.get('email')?.toString()?.trim()?.toLowerCase() || '',
    mensagem: formData.get('mensagem')?.toString()?.trim() || '',
    concordaTermos:
      formData.get('concordaTermos') === 'true' || formData.get('concordaTermos') === 'on',
  };

  const validation = leadSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Verifique os campos informados.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { nome, empresa, segmento, cidade, estado, whatsapp, email, mensagem } =
    validation.data;

  try {
    // Rate Limiting por IP (máximo 5 envios de lead a cada 15 minutos por IP)
    const headerList = await headers();
    const clientIp =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip') ||
      '127.0.0.1';
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);

    const [recentSubmissions] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(securityEvents)
      .where(
        and(
          eq(securityEvents.ipAddress, clientIp),
          eq(securityEvents.eventType, 'lead_captured_landing_page'),
          gt(securityEvents.createdAt, fifteenMinAgo)
        )
      );

    if ((recentSubmissions?.count ?? 0) >= 5) {
      await recordSecurityEvent({
        email: email || undefined,
        eventType: 'lead_rate_limit_exceeded',
        metadata: { ip: clientIp },
      });
      return {
        error:
          'Muitas solicitações enviadas em sequência. Aguarde alguns minutos antes de enviar novamente.',
      };
    }

    const formattedCity = `${cidade} - ${estado}`;
    const formattedInterest = `[${segmento.toUpperCase()}] Empresa/Negócio: ${empresa}${
      mensagem ? ` | Mensagem: ${mensagem}` : ''
    }`;

    await db.insert(leads).values({
      name: nome,
      city: formattedCity,
      whatsapp,
      email: email || null,
      interest: formattedInterest,
      status: 'new',
    });

    await recordSecurityEvent({
      email: email || undefined,
      eventType: 'lead_captured_landing_page',
      metadata: { cidade: formattedCity, whatsapp, empresa },
    });

    return {
      success: true,
    };
  } catch (err: any) {
    console.error('Erro ao salvar lead no PostgreSQL:', err);
    return {
      error: 'Não foi possível registrar o interesse no momento. Tente novamente mais tarde.',
    };
  }
}

/**
 * Atualiza o status de atendimento de um lead no funil comercial.
 */
export async function updateLeadStatusAction(
  leadId: string,
  status: 'new' | 'contacted' | 'converted' | 'archived'
) {
  const staff = await requireStaff();

  await db.update(leads).set({ status }).where(eq(leads.id, leadId));

  await recordAuditLog({
    actorId: staff.id,
    action: 'lead_status_updated',
    details: { leadId, status },
  });

  revalidatePath('/admin');
}

/**
 * Exclui um lead do painel administrativo (Restrito estritamente a Super Admin).
 */
export async function deleteLeadAction(leadId: string) {
  const admin = await requireSuperAdmin();

  await db.delete(leads).where(eq(leads.id, leadId));

  await recordAuditLog({
    actorId: admin.id,
    action: 'lead_deleted',
    details: { leadId },
  });

  revalidatePath('/admin');
}

/**
 * Converte um Lead em Comércio Parceiro Oficial no Guia Comercial e gera (opcionalmente)
 * o link criptográfico de convite para o Portal do Comerciante (role = 'merchant').
 */
export async function convertLeadToPartnerAction(
  prevState: ConvertLeadState,
  formData: FormData
): Promise<ConvertLeadState> {
  const staff = await requireStaff();

  const rawData = {
    leadId: formData.get('leadId')?.toString() || '',
    establishmentName: formData.get('establishmentName')?.toString()?.trim() || '',
    cityId: formData.get('cityId')?.toString() || '',
    categoryId: formData.get('categoryId')?.toString() || '',
    whatsapp: formData.get('whatsapp')?.toString()?.trim() || '',
    email: formData.get('email')?.toString()?.trim()?.toLowerCase() || '',
    description: formData.get('description')?.toString()?.trim() || '',
    generateInvite: formData.get('generateInvite') === 'on',
  };

  const validation = convertLeadSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Verifique os dados obrigatórios para converter o lead em parceiro.',
    };
  }

  const {
    leadId,
    establishmentName,
    cityId,
    categoryId,
    whatsapp,
    email,
    description,
    generateInvite,
  } = validation.data;

  const slug =
    establishmentName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-') +
    '-' +
    Math.random().toString(36).substring(2, 6);

  // 1. Cria o estabelecimento no Guia Comercial
  const [newEst] = await db
    .insert(establishments)
    .values({
      name: establishmentName,
      slug,
      cityId,
      categoryId,
      whatsapp,
      description: description || null,
      isActive: true,
    })
    .returning();

  // 2. Gera convite criptográfico de comerciante (merchant) apenas se o executor for Admin e houver e-mail
  let inviteUrl: string | undefined;
  if (generateInvite && email && staff.role === 'admin') {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await db.insert(invitations).values({
      email,
      role: 'merchant',
      invitedBy: staff.id,
      tokenHash,
      status: 'pending',
      expiresAt,
    });

    const headerList = await headers();
    const host = headerList.get('host') || 'localhost:3000';
    const protocol = headerList.get('x-forwarded-proto') || 'http';
    inviteUrl = `${protocol}://${host}/convite/${rawToken}`;
  }

  // 3. Marca o lead como convertido
  await db
    .update(leads)
    .set({ status: 'converted' })
    .where(eq(leads.id, leadId));

  // 4. Registra na auditoria
  await recordAuditLog({
    actorId: staff.id,
    action: 'lead_converted_to_partner',
    details: {
      leadId,
      establishmentId: newEst.id,
      establishmentName: newEst.name,
      inviteGenerated: Boolean(inviteUrl),
      email: email || null,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/comercios');
  revalidatePath('/admin/equipe');
  revalidatePath('/guia');

  return {
    success: true,
    establishmentName: newEst.name,
    inviteUrl,
  };
}
