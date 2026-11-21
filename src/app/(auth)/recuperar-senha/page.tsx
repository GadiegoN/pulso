'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { forgotPasswordAction, type ActionState } from '@/lib/auth/actions';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const initialState: ActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

  return (
    <div className="w-full bg-[#0d1017]/90 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Recuperar Senha
        </h1>
        <p className="text-sm text-slate-400">
          Enviaremos um link de uso único e temporário para o seu e-mail cadastrado
        </p>
      </div>

      {state?.success ? (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Instruções enviadas!</p>
              <p className="text-xs text-emerald-300/80">
                Se o e-mail informado estiver registrado em nossa base, você receberá um link seguro para definir sua nova senha. Verifique também a pasta de spam.
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retornar para o Login</span>
          </Link>
        </div>
      ) : (
        <>
          {state?.error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                E-mail Cadastrado
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] text-white font-semibold text-sm shadow-[0_0_20px_rgba(255,51,102,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enviar Link de Recuperação</span>
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
              Lembrou sua senha? Voltar ao login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
