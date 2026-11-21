'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { invitations, profiles } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';
import { recordAuditLog } from './server';
import { redirect } from 'next/navigation';

export type AcceptInviteState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const newAccountSchema = z
  .object({
    token: z.string().min(1, 'Token de convite obrigatório'),
    fullName: z.string().min(3, 'O nome deve ter ao menos 3 caracteres'),
    password: z
      .string()
      .min(8, 'A senha deve conter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Ao menos uma letra maiúscula')
      .regex(/[0-9]/, 'Ao menos um número')
      .regex(/[^A-Za-z0-9]/, 'Ao menos um caractere especial'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

const existingAccountSchema = z.object({
  token: z.string().min(1, 'Token de convite obrigatório'),
  password: z.string().min(1, 'Informe a senha da sua conta'),
  fullName: z.string().optional(),
});

/**
 * Aceite de Convite e Ativação do Papel Concedido.
 * Suporta tanto novos usuários quanto usuários pré-existentes que foram promovidos por convite.
 */
export async function acceptInvitationAction(
  prevState: AcceptInviteState,
  formData: FormData
): Promise<AcceptInviteState> {
  const token = formData.get('token')?.toString() || '';
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // 1. Validar o convite no PostgreSQL
  const inviteRecord = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.tokenHash, tokenHash),
        eq(invitations.status, 'pending'),
        gt(invitations.expiresAt, new Date())
      )
    )
    .limit(1);

  const invite = inviteRecord[0];
  if (!invite) {
    return {
      error: 'Convite inválido, expirado ou já utilizado. Solicite um novo link a um administrador.',
    };
  }

  // 2. Verificar se o usuário já possui conta cadastrada na base
  const existingProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, invite.email))
    .limit(1);

  const existingProfile = existingProfiles[0] || null;
  const supabase = await createClient();

  if (existingProfile) {
    // --- CASO A: USUÁRIO JÁ REGISTRADO (Ex: era 'user' e foi convidado para 'admin') ---
    const rawData = {
      token,
      password: formData.get('password')?.toString() || '',
      fullName: formData.get('fullName')?.toString()?.trim() || undefined,
    };

    const validation = existingAccountSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: 'Informe a senha atual da sua conta para confirmar a elevação de papel.',
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    // Valida credenciais do usuário existente no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: invite.email,
      password: validation.data.password,
    });

    if (authError || !authData.user) {
      return {
        error: 'Senha incorreta. Digite a senha da sua conta existente para validar a elevação para ' + invite.role.toUpperCase() + '.',
      };
    }

    // Promove o perfil com o papel outorgado no convite
    await db
      .update(profiles)
      .set({
        role: invite.role,
        status: 'active',
        fullName: validation.data.fullName || existingProfile.fullName,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, existingProfile.id));

    // Marca o convite como aceito
    await db
      .update(invitations)
      .set({
        status: 'accepted',
      })
      .where(eq(invitations.id, invite.id));

    // Trilha perene de auditoria
    await recordAuditLog({
      actorId: existingProfile.id,
      action: 'invite_accepted_existing_user_promoted',
      details: {
        email: invite.email,
        previousRole: existingProfile.role,
        promotedRole: invite.role,
        invitedBy: invite.invitedBy,
      },
    });

    redirect(invite.role === 'admin' ? '/admin' : '/');
  } else {
    // --- CASO B: NOVO MEMBRO (Primeiro registro no sistema) ---
    const rawData = {
      token,
      fullName: formData.get('fullName')?.toString().trim() || '',
      password: formData.get('password')?.toString() || '',
      confirmPassword: formData.get('confirmPassword')?.toString() || '',
    };

    const validation = newAccountSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: 'Preencha os campos corretamente respeitando os critérios de segurança.',
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const { fullName, password } = validation.data;

    // Criar conta no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: invite.email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error || !data.user) {
      return {
        error: error?.message || 'Falha ao registrar credenciais. Tente novamente.',
      };
    }

    // Atualizar o perfil criado pelo trigger com o papel outorgado no convite
    await db
      .update(profiles)
      .set({
        fullName,
        role: invite.role,
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, data.user.id));

    // Marcar convite como aceito
    await db
      .update(invitations)
      .set({
        status: 'accepted',
      })
      .where(eq(invitations.id, invite.id));

    // Trilha perene de auditoria
    await recordAuditLog({
      actorId: data.user.id,
      action: 'invite_accepted_new_member_created',
      details: {
        email: invite.email,
        assignedRole: invite.role,
        invitedBy: invite.invitedBy,
      },
    });

    // Autenticar e redirecionar
    await supabase.auth.signInWithPassword({
      email: invite.email,
      password,
    });

    redirect(invite.role === 'admin' ? '/admin' : '/');
  }
}
