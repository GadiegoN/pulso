'use client';

import React, { useActionState, Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loginAction, type ActionState } from '@/lib/auth/actions';
import { verifyMfaLoginAction } from '@/lib/auth/mfa-actions';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';

const initialState: ActionState = {};
const initialMfaState: { error?: string } = {};

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '';
  const isResetSuccess = searchParams.get('reset') === 'success';
  const callbackError = searchParams.get('error') === 'auth_callback_failed';

  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [mfaState, mfaFormAction, isMfaPending] = useActionState(
    verifyMfaLoginAction,
    initialMfaState
  );

  // Se a conta exigir verificação de segundo fator (MFA)
  if (state?.requiresMfa && state?.factorId) {
    return (
      <div className="w-full bg-[#0d1017]/90 border border-cyan-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Autenticação em Duas Etapas
          </h1>
          <p className="text-sm text-slate-400">
            Digite o código de 6 dígitos gerado pelo seu app autenticador
          </p>
        </div>

        {mfaState?.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{mfaState.error}</span>
          </div>
        )}

        <form action={mfaFormAction} className="space-y-4">
          <input type="hidden" name="factorId" value={state.factorId} />
          <input type="hidden" name="next" value={state.next || next} />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
              Código de Segurança (TOTP)
            </label>
            <input
              type="text"
              name="code"
              required
              maxLength={6}
              autoFocus
              pattern="[0-9]{6}"
              inputMode="numeric"
              placeholder="000000"
              className="w-full bg-[#121622] border border-cyan-500/30 rounded-xl px-4 py-3.5 text-center text-2xl font-mono tracking-[0.5em] text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isMfaPending}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isMfaPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirmar & Acessar</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancelar e voltar ao login com e-mail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0d1017]/90 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Acessar a Plataforma
        </h1>
        <p className="text-sm text-slate-400">
          Informe suas credenciais para continuar
        </p>
      </div>

      {isResetSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>Sua senha foi redefinida com sucesso. Faça login com a nova senha.</span>
        </div>
      )}

      {callbackError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>Link de confirmação expirado ou inválido. Tente novamente.</span>
        </div>
      )}

      {state?.error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            E-mail Institucional
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="seu@email.com"
              className="w-full bg-[#121622] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366] focus:ring-1 focus:ring-[#ff3366] transition-all"
            />
          </div>
          {state?.fieldErrors?.email && (
            <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Senha
            </label>
            <Link
              href="/recuperar-senha"
              className="text-xs text-[#00f0ff] hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-[#121622] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366] focus:ring-1 focus:ring-[#ff3366] transition-all"
            />
          </div>
          {state?.fieldErrors?.password && (
            <p className="mt-1.5 text-xs text-red-400">{state.fieldErrors.password[0]}</p>
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
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-slate-400">
          Ainda não possui uma conta?{' '}
          <Link href="/cadastro" className="text-[#00f0ff] font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-[#0d1017]/90 border border-white/10 rounded-2xl p-8 text-center text-slate-400">
          Carregando formulário...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
