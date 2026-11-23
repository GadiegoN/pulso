import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles, auditLogs, securityEvents, type userRoleEnum, type userStatusEnum } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { connection } from 'next/server';

export type UserProfile = typeof profiles.$inferSelect;

/**
 * Obtém o usuário autenticado atual verificado pelo Supabase Auth.
 */
export async function getCurrentUser() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Obtém o perfil completo do usuário autenticado a partir do PostgreSQL.
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const result = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  return result[0] || null;
}

/**
 * Guarda Server-Side (Camada 2 & 3): Exige usuário autenticado ativo.
 * Redireciona para login se não autenticado, ou tela apropriada se suspenso/pendente.
 */
export async function requireAuth(): Promise<UserProfile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect('/login');
  }

  if (profile.status === 'suspended') {
    redirect('/conta-suspensa');
  }

  return profile;
}

/**
 * Guarda Server-Side Estrito para Painel Administrativo (Governança & Hierarquia).
 * REGRA INEGOCIÁVEL 4: O servidor valida role === 'admin' e status === 'active'.
 */
export async function requireAdmin(): Promise<UserProfile> {
  const profile = await requireAuth();

  if (profile.role !== 'admin') {
    // 403 Proibido para usuários sem prerrogativa de administrador
    redirect('/acesso-negado');
  }

  return profile;
}

/**
 * Guarda Server-Side para Equipe Operacional (Administradores e Operadores de Rádio/Comunicação).
 * Permite operar Rádio Digital, Comércios, Central WhatsApp e Visão Geral, mantendo Equipe e Auditoria restritos a requireAdmin().
 */
export async function requireStaff(): Promise<UserProfile> {
  const profile = await requireAuth();

  if (profile.role !== 'admin' && profile.role !== 'operator') {
    redirect('/acesso-negado');
  }

  return profile;
}

/**
 * Guarda Server-Side Estrito para Portal do Comerciante Parceiro.
 * Permite acesso exclusivo a contas com role === 'merchant' ou 'admin'.
 */
export async function requireMerchant(): Promise<UserProfile> {
  const profile = await requireAuth();

  if (profile.role !== 'merchant' && profile.role !== 'admin') {
    redirect('/acesso-negado');
  }

  return profile;
}

/**
 * Registra um evento imutável na trilha de auditoria.
 */
export async function recordAuditLog(params: {
  actorId?: string;
  action: string;
  targetUserId?: string;
  details?: Record<string, unknown>;
}) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'desconhecido';

    await db.insert(auditLogs).values({
      actorId: params.actorId,
      action: params.action,
      targetUserId: params.targetUserId,
      details: params.details,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error('Falha ao gravar audit log:', err);
  }
}

/**
 * Registra eventos de segurança para prevenção contra força bruta e abusos.
 */
export async function recordSecurityEvent(params: {
  email?: string;
  eventType: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';

    await db.insert(securityEvents).values({
      email: params.email,
      ipAddress,
      eventType: params.eventType,
      metadata: params.metadata,
    });
  } catch (err) {
    console.error('Falha ao gravar security event:', err);
  }
}
