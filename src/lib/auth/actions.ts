'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { recordAuditLog, recordSecurityEvent } from './server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// Esquemas de Validação Estritos com Zod
const loginSchema = z.object({
  email: z.string().email('E-mail em formato inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
  next: z.string().optional(),
});

const signupSchema = z
  .object({
    fullName: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail em formato inválido'),
    password: z
      .string()
      .min(8, 'A senha deve conter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
      .regex(/[0-9]/, 'A senha deve conter ao menos um número')
      .regex(/[^A-Za-z0-9]/, 'A senha deve conter ao menos um caractere especial'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail em formato inválido'),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'A senha deve conter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
      .regex(/[0-9]/, 'A senha deve conter ao menos um número')
      .regex(/[^A-Za-z0-9]/, 'A senha deve conter ao menos um caractere especial'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  requiresMfa?: boolean;
  factorId?: string;
  next?: string;
};

/**
 * Ação de Login com proteção contra força bruta e checagem de status.
 */
export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get('email')?.toString().trim().toLowerCase() || '',
    password: formData.get('password')?.toString() || '',
    next: formData.get('next')?.toString() || '',
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Dados inválidos. Verifique os campos.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password, next } = validation.data;

  // 1. Verificar bloqueio temporal por tentativas consecutivas no PostgreSQL
  const profileRecord = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email))
    .limit(1);

  const existingProfile = profileRecord[0] || null;

  if (existingProfile?.lockedUntil && new Date(existingProfile.lockedUntil) > new Date()) {
    const minutesLeft = Math.ceil(
      (new Date(existingProfile.lockedUntil).getTime() - Date.now()) / (1000 * 60)
    );
    await recordSecurityEvent({
      email,
      eventType: 'login_blocked_locked_account',
      metadata: { minutesLeft },
    });
    return {
      error: `Conta temporariamente bloqueada por segurança devido a múltiplas tentativas falhas. Tente novamente em ${minutesLeft} minutos.`,
    };
  }

  // 2. Autenticar no Supabase Auth
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // Tratar falha de login e incrementar tentativas se usuário existir
    if (existingProfile) {
      const newAttempts = existingProfile.failedLoginAttempts + 1;
      const willLock = newAttempts >= 5;
      const lockedUntilDate = willLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await db
        .update(profiles)
        .set({
          failedLoginAttempts: newAttempts,
          lockedUntil: lockedUntilDate,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, existingProfile.id));

      await recordSecurityEvent({
        email,
        eventType: willLock ? 'account_locked_failed_attempts' : 'failed_login_attempt',
        metadata: { attemptNumber: newAttempts },
      });

      if (willLock) {
        return {
          error: 'Limite de 5 tentativas atingido. A conta foi bloqueada por 15 minutos para sua proteção.',
        };
      }
    } else {
      await recordSecurityEvent({
        email,
        eventType: 'failed_login_unknown_account',
      });
    }

    return {
      error: 'E-mail ou senha incorretos.',
    };
  }

  // 3. Login bem-sucedido: resetar contador de falhas
  if (existingProfile) {
    await db
      .update(profiles)
      .set({
        failedLoginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, existingProfile.id));
  }

  // 4. Checar status da conta
  const currentStatus = existingProfile?.status || 'pending_verification';

  if (currentStatus === 'suspended') {
    await supabase.auth.signOut();
    await recordAuditLog({
      actorId: data.user.id,
      action: 'login_denied_account_suspended',
    });
    return {
      error: 'Esta conta encontra-se suspensa pela administração. Entre em contato com o suporte.',
    };
  }

  await recordAuditLog({
    actorId: data.user.id,
    action: 'login_success',
  });

  // 5. Checar se a conta exige Autenticação Multifator (MFA / AAL2)
  const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aalData && aalData.nextLevel === 'aal2' && aalData.currentLevel !== 'aal2') {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const verifiedTotp = factors?.totp?.find((f) => f.status === 'verified');
    if (verifiedTotp) {
      return {
        requiresMfa: true,
        factorId: verifiedTotp.id,
        next,
      };
    }
  }

  // 6. Redirecionamento seguro baseado no papel e parâmetro 'next'
  let targetUrl = '/';
  if (existingProfile?.role === 'admin') {
    targetUrl = next && next.startsWith('/admin') ? next : '/admin';
  } else if (next && next.startsWith('/') && !next.startsWith('/admin')) {
    targetUrl = next;
  }

  redirect(targetUrl);
}

/**
 * Ação de Cadastro Público (Garante papel 'user' e status 'pending_verification').
 */
export async function signupAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    fullName: formData.get('fullName')?.toString().trim() || '',
    email: formData.get('email')?.toString().trim().toLowerCase() || '',
    password: formData.get('password')?.toString() || '',
    confirmPassword: formData.get('confirmPassword')?.toString() || '',
  };

  const validation = signupSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Preencha todos os campos respeitando os critérios de segurança.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { fullName, email, password } = validation.data;

  const headerList = await headers();
  const host = headerList.get('host') || 'localhost:3000';
  const protocol = headerList.get('x-forwarded-proto') || 'http';
  const origin = `${protocol}://${host}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/`,
    },
  });

  if (error) {
    return {
      error: error.message || 'Erro ao realizar cadastro. Tente novamente.',
    };
  }

  // Se o Supabase gerou uma sessão imediata mesmo com verificação pendente,
  // desautentica explicitamente para não deixar cookies de sessão meia-aberta no navegador
  await supabase.auth.signOut();

  await recordSecurityEvent({
    email,
    eventType: 'public_signup_initiated',
    metadata: { userId: data.user?.id },
  });

  redirect(`/verificar-email?email=${encodeURIComponent(email)}`);
}

/**
 * Ação de Encerramento de Sessão (Logout Seguro).
 */
export async function logoutAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await recordAuditLog({
      actorId: user.id,
      action: 'user_logout',
    });
  }

  await supabase.auth.signOut();
  redirect('/login');
}

/**
 * Ação de Solicitação de Recuperação de Senha.
 */
export async function forgotPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get('email')?.toString().trim().toLowerCase() || '',
  };

  const validation = forgotPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Informe um e-mail válido.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { email } = validation.data;

  const headerList = await headers();
  const host = headerList.get('host') || 'localhost:3000';
  const protocol = headerList.get('x-forwarded-proto') || 'http';
  const origin = `${protocol}://${host}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/redefinir-senha`,
  });

  await recordSecurityEvent({
    email,
    eventType: 'password_recovery_requested',
  });

  // Por segurança contra enumeração de usuários, sempre retorna sucesso
  return {
    success: true,
    error: undefined,
  };
}

/**
 * Ação de Redefinição de Senha após clique no link autenticado.
 */
export async function resetPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    password: formData.get('password')?.toString() || '',
    confirmPassword: formData.get('confirmPassword')?.toString() || '',
  };

  const validation = resetPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'A nova senha não atende aos requisitos mínimos de complexidade.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { password } = validation.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error || !data.user) {
    return {
      error: error?.message || 'Não foi possível atualizar a senha. Solicite um novo link.',
    };
  }

  await recordAuditLog({
    actorId: data.user.id,
    action: 'password_reset_completed',
  });

  redirect('/login?reset=success');
}
