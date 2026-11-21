'use client';

import React, { useActionState } from 'react';
import { acceptInvitationAction, type AcceptInviteState } from '@/lib/auth/invite-actions';
import { User, Lock, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';

const initialState: AcceptInviteState = {};

interface Props {
  token: string;
  email: string;
  role: string;
  isExistingUser: boolean;
  existingFullName?: string;
}

export default function InviteAcceptForm({
  token,
  email,
  role,
  isExistingUser,
  existingFullName,
}: Props) {
  const [state, formAction, isPending] = useActionState(acceptInvitationAction, initialState);

  return (
    <div>
      {/* Alerta explicativo para contas pré-existentes */}
      {isExistingUser && (
        <div className="mb-4 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2.5 text-cyan-300 text-xs leading-relaxed">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
          <span>
            Identificamos que <strong>{email}</strong> já possui uma conta cadastrada. Informe sua senha atual para validar sua identidade e promover seu perfil ao papel de <strong>{role.toUpperCase()}</strong>.
          </span>
        </div>
      )}

      {state?.error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        {isExistingUser ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Senha da Sua Conta
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  required
                  autoFocus
                  placeholder="Digite sua senha atual"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366] transition-all"
                />
              </div>
              {state?.fieldErrors?.password && (
                <p className="mt-1 text-[11px] text-red-400">{state.fieldErrors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Validar Senha & Ativar {role.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Seu Nome Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Digite seu nome"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366] transition-all"
                />
              </div>
              {state?.fieldErrors?.fullName && (
                <p className="mt-1 text-[11px] text-red-400">{state.fieldErrors.fullName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Definir Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Mínimo 8 dígitos, maiúscula, número e símbolo"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366] transition-all"
                />
              </div>
              {state?.fieldErrors?.password && (
                <p className="mt-1 text-[11px] text-red-400">{state.fieldErrors.password[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Repita sua senha"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366] transition-all"
                />
              </div>
              {state?.fieldErrors?.confirmPassword && (
                <p className="mt-1 text-[11px] text-red-400">{state.fieldErrors.confirmPassword[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] text-white font-semibold text-xs shadow-[0_0_20px_rgba(255,51,102,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ativar Conta & Acessar Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
