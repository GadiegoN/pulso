'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { resetPasswordAction, type ActionState } from '@/lib/auth/actions';
import { Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

const initialState: ActionState = {};

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);

  return (
    <div className="w-full bg-[#0d1017]/90 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#ff3366]/20 to-[#7928ca]/20 border border-[#ff3366]/30 flex items-center justify-center text-[#ff3366]">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Definir Nova Senha
        </h1>
        <p className="text-sm text-slate-400">
          Crie uma nova credencial forte para proteger sua conta
        </p>
      </div>

      {state?.error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Nova Senha (Mín. 8 caracteres, maiúscula, número e símbolo)
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              name="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full bg-[#121622] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366] focus:ring-1 focus:ring-[#ff3366] transition-all"
            />
          </div>
          {state?.fieldErrors?.password && (
            <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Confirmar Nova Senha
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              name="confirmPassword"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full bg-[#121622] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366] focus:ring-1 focus:ring-[#ff3366] transition-all"
            />
          </div>
          {state?.fieldErrors?.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.confirmPassword[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] text-white font-semibold text-sm shadow-[0_0_20px_rgba(255,51,102,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Salvar Nova Senha</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/5 text-center">
        <Link
          href="/login"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Cancelar e voltar ao login
        </Link>
      </div>
    </div>
  );
}
