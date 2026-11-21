import React, { Suspense } from 'react';
import { db } from '@/lib/db';
import { invitations, profiles } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';
import Link from 'next/link';
import { ShieldCheck, XCircle, ArrowLeft } from 'lucide-react';
import { connection } from 'next/server';
import InviteAcceptForm from './InviteAcceptForm';

export const instant = false;

interface Props {
  params: Promise<{
    token: string;
  }>;
}

async function InviteLoader({ paramsPromise }: { paramsPromise: Promise<{ token: string }> }) {
  // Padrão Next.js 16: Interrompe pré-renderização estática e renderiza sob demanda no request-time
  await connection();

  const { token } = await paramsPromise;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

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
    return (
      <div className="w-full bg-[#0d1017]/90 border border-red-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <XCircle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Convite Inválido ou Expirado
        </h1>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Este link de ativação expirou (prazo máximo de 48h), já foi utilizado ou foi revogado por um administrador.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Login</span>
        </Link>
      </div>
    );
  }

  // Checar se este e-mail já possui conta comum cadastrada
  const existingProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, invite.email))
    .limit(1);

  const existingProfile = existingProfiles[0] || null;
  const isExistingUser = !!existingProfile;

  return (
    <div className="w-full bg-[#0d1017]/90 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#ff3366]/20 to-[#7928ca]/20 border border-[#ff3366]/30 flex items-center justify-center text-[#ff3366]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
          {isExistingUser ? 'Elevação de Acesso — Convite' : 'Primeiro Acesso — Configuração Inicial'}
        </h1>
        <p className="text-xs text-slate-400">
          {isExistingUser
            ? 'Você recebeu uma promoção de papel na rede PULSO'
            : 'Você foi convidado para integrar a equipe da rede PULSO'}
        </p>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-400">E-mail Convidado:</span>
          <span className="font-mono text-white font-semibold">{invite.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Novo Papel Atribuído:</span>
          <span className="font-bold text-[#ff3366] uppercase">{invite.role}</span>
        </div>
      </div>

      <InviteAcceptForm
        token={token}
        email={invite.email}
        role={invite.role}
        isExistingUser={isExistingUser}
        existingFullName={existingProfile?.fullName || ''}
      />
    </div>
  );
}

export default function InviteOnboardingPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-[#0d1017]/90 border border-white/10 rounded-2xl p-8 text-center text-slate-400">
          Validando token criptográfico de convite...
        </div>
      }
    >
      <InviteLoader paramsPromise={params} />
    </Suspense>
  );
}
