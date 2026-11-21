'use server';

import { z } from 'zod';
import { requireAdmin, recordAuditLog } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { invitations, profiles, auditLogs, type userRoleEnum } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

const inviteSchema = z.object({
  email: z.string().email('E-mail institucional inválido'),
  role: z.enum(['admin', 'operator', 'merchant']),
});

export type InviteActionState = {
  success?: boolean;
  error?: string;
  inviteLink?: string;
};

/**
 * Expedição de Convite Administrativo Auditado.
 * REGRA INEGOCIÁVEL 3 & 5: Apenas admins podem convidar e a ação é auditada.
 */
export async function createInvitationAction(
  prevState: InviteActionState,
  formData: FormData
): Promise<InviteActionState> {
  const currentAdmin = await requireAdmin();

  const rawData = {
    email: formData.get('email')?.toString().trim().toLowerCase() || '',
    role: formData.get('role')?.toString() as any,
  };

  const validation = inviteSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || 'Dados inválidos.',
    };
  }

  const { email, role } = validation.data;

  // 1. Checar se já existe convite pendente e não expirado para este e-mail
  const existingInvite = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.email, email),
        eq(invitations.status, 'pending'),
        gt(invitations.expiresAt, new Date())
      )
    )
    .limit(1);

  if (existingInvite.length > 0) {
    return {
      error: 'Já existe um convite ativo e pendente para este e-mail.',
    };
  }

  // 2. Gerar token criptográfico único (64 caracteres hex)
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  // Expiração em 48 horas
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  await db.insert(invitations).values({
    email,
    role,
    invitedBy: currentAdmin.id,
    tokenHash,
    status: 'pending',
    expiresAt,
  });

  // 3. Registrar na trilha perene de auditoria
  await recordAuditLog({
    actorId: currentAdmin.id,
    action: 'invitation_created',
    details: { invitedEmail: email, assignedRole: role, expiresAt },
  });

  const headerList = await headers();
  const host = headerList.get('host') || 'localhost:3000';
  const protocol = headerList.get('x-forwarded-proto') || 'http';
  const inviteLink = `${protocol}://${host}/convite/${rawToken}`;

  revalidatePath('/admin/equipe');

  return {
    success: true,
    inviteLink,
  };
}

/**
 * Revogação de Convite Pendente.
 */
export async function revokeInvitationAction(inviteId: string) {
  const currentAdmin = await requireAdmin();

  await db
    .update(invitations)
    .set({
      status: 'revoked',
    })
    .where(eq(invitations.id, inviteId));

  await recordAuditLog({
    actorId: currentAdmin.id,
    action: 'invitation_revoked',
    details: { inviteId },
  });

  revalidatePath('/admin/equipe');
}

/**
 * Suspensão ou Reativação de Usuário.
 * REGRA INEGOCIÁVEL: Admin não pode suspender outro admin nem a si mesmo.
 */
export async function toggleUserStatusAction(targetUserId: string, newStatus: 'active' | 'suspended') {
  const currentAdmin = await requireAdmin();

  if (currentAdmin.id === targetUserId) {
    throw new Error('Operação negada: não é permitido suspender a própria conta de administrador.');
  }

  // 1. Obter o usuário alvo para conferir seu papel
  const targetProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, targetUserId))
    .limit(1);

  const targetProfile = targetProfiles[0];
  if (!targetProfile) {
    throw new Error('Usuário alvo não encontrado.');
  }

  // REGRA DE GOVERNANÇA: Admin não pode suspender acesso de outro admin
  if (targetProfile.role === 'admin') {
    throw new Error('Operação negada: administradores não possuem permissão para suspender outros administradores.');
  }

  await db
    .update(profiles)
    .set({
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, targetUserId));

  await recordAuditLog({
    actorId: currentAdmin.id,
    action: newStatus === 'suspended' ? 'user_suspended' : 'user_reactivated',
    targetUserId,
    details: {
      targetEmail: targetProfile.email,
      targetRole: targetProfile.role,
      newStatus,
    },
  });

  revalidatePath('/admin/equipe');
}
