'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, recordAuditLog, recordSecurityEvent } from './server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type MfaEnrollState = {
  factorId?: string;
  qrCode?: string;
  secret?: string;
  uri?: string;
  error?: string;
  success?: boolean;
};

/**
 * Inicia a configuração do MFA (TOTP) gerando QR Code e segredo.
 */
export async function startMfaEnrollAction(): Promise<MfaEnrollState> {
  const currentProfile = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    issuer: 'PULSO',
    friendlyName: currentProfile.email,
  });

  if (error || !data) {
    return {
      error: error?.message || 'Falha ao iniciar configuração do autenticador.',
    };
  }

  return {
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
    uri: data.totp.uri,
  };
}

/**
 * Valida o primeiro código de 6 dígitos para confirmar e ativar o MFA no perfil.
 */
export async function verifyMfaEnrollAction(
  factorId: string,
  code: string
): Promise<{ success?: boolean; error?: string }> {
  const currentProfile = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code: code.trim(),
  });

  if (error) {
    return {
      error: 'Código inválido. Verifique o aplicativo autenticador e tente novamente.',
    };
  }

  // Atualizar perfil no PostgreSQL com garantia de MFA ativo
  await db
    .update(profiles)
    .set({
      mfaEnabled: true,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, currentProfile.id));

  await recordAuditLog({
    actorId: currentProfile.id,
    action: 'mfa_enabled_totp',
    details: { factorId },
  });

  revalidatePath('/admin/seguranca');
  return { success: true };
}

/**
 * Desativa o MFA (TOTP) e remove os fatores associados.
 */
export async function disableMfaAction(factorId?: string): Promise<{ success?: boolean; error?: string }> {
  const currentProfile = await requireAuth();
  const supabase = await createClient();

  // Se o factorId não for passado, busca todos os fatores TOTP cadastrados
  if (!factorId) {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    if (factors?.totp && factors.totp.length > 0) {
      for (const factor of factors.totp) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }
    }
  } else {
    await supabase.auth.mfa.unenroll({ factorId });
  }

  await db
    .update(profiles)
    .set({
      mfaEnabled: false,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, currentProfile.id));

  await recordAuditLog({
    actorId: currentProfile.id,
    action: 'mfa_disabled_totp',
  });

  revalidatePath('/admin/seguranca');
  return { success: true };
}

/**
 * Validação do código MFA durante o fluxo de Login (Elevação de AAL1 para AAL2).
 */
export async function verifyMfaLoginAction(
  prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const factorId = formData.get('factorId')?.toString() || '';
  const code = formData.get('code')?.toString()?.trim() || '';
  const next = formData.get('next')?.toString() || '';

  if (!factorId || !code || code.length !== 6) {
    return { error: 'Informe o código numérico de 6 dígitos gerado pelo seu app.' };
  }

  const supabase = await createClient();

  // 1. Criar o desafio
  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId,
  });

  if (challengeError || !challengeData) {
    return { error: challengeError?.message || 'Erro ao gerar desafio MFA.' };
  }

  // 2. Verificar o código no desafio
  const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challengeData.id,
    code,
  });

  if (verifyError) {
    return { error: 'Código de autenticação incorreto ou expirado.' };
  }

  // Obter o usuário para direcionamento
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profileRecord = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1);

    const profile = profileRecord[0];

    await recordAuditLog({
      actorId: user.id,
      action: 'mfa_challenge_verified_login',
    });

    const isSafeNext = Boolean(next && next.startsWith('/') && !next.startsWith('//'));
    let target = '/';
    if (profile?.role === 'admin' || profile?.role === 'operator') {
      target = isSafeNext && next.startsWith('/admin') ? next : '/admin';
    } else if (profile?.role === 'merchant') {
      target = isSafeNext && next.startsWith('/portal') ? next : '/portal';
    } else if (isSafeNext && !next.startsWith('/admin') && !next.startsWith('/portal')) {
      target = next;
    }

    redirect(target);
  }

  redirect('/');
}

/**
 * Revogação de todas as outras sessões ativas (Desconecta outros navegadores/dispositivos).
 */
export async function revokeOtherSessionsAction(): Promise<{ success?: boolean; error?: string }> {
  const currentProfile = await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({ scope: 'others' });

  if (error) {
    return { error: error.message || 'Falha ao revogar outras sessões.' };
  }

  await recordAuditLog({
    actorId: currentProfile.id,
    action: 'revoked_all_other_sessions',
  });

  revalidatePath('/admin/seguranca');
  return { success: true };
}
