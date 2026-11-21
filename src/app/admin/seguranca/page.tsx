import React from 'react';
import { requireAuth } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { connection } from 'next/server';
import SecuritySettingsView from './SecuritySettingsView';

export const instant = false;

export default async function SecuritySettingsPage() {
  await connection();
  const currentProfile = await requireAuth();

  const supabase = await createClient();
  const { data: factorData } = await supabase.auth.mfa.listFactors();
  const verifiedTotp = factorData?.totp?.find((f) => f.status === 'verified') || null;

  // Obter os últimos eventos de segurança da conta
  const recentLogs = await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.actorId, currentProfile.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Segurança da Conta & Gestão de Sessões
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure a autenticação em duas etapas (MFA) e gerencie os dispositivos conectados à sua credencial
        </p>
      </div>

      <SecuritySettingsView
        profile={currentProfile}
        verifiedTotp={verifiedTotp}
        recentLogs={recentLogs}
      />
    </div>
  );
}
