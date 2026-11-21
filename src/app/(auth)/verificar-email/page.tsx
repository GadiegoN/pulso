'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MailCheck, ArrowLeft, RefreshCw } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="w-full bg-[#0d1017]/90 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
        <MailCheck className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
        Confirme seu E-mail
      </h1>

      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        Enviamos uma mensagem de ativação para{' '}
        {email ? (
          <strong className="text-white block mt-1 font-mono">{email}</strong>
        ) : (
          <strong>o seu endereço cadastrado</strong>
        )}
        .
      </p>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs text-slate-400 space-y-2 mb-6">
        <p className="font-semibold text-slate-200">Próximos passos:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Abra sua caixa de entrada e localize o e-mail de confirmação.</li>
          <li>Clique no link seguro para autenticar e ativar seu perfil.</li>
          <li>Após a verificação, você poderá efetuar o login imediatamente.</li>
        </ol>
        <p className="text-[11px] text-slate-500 pt-1">
          * Não encontrou? Verifique sua caixa de spam ou lixo eletrônico.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/login"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] text-white font-semibold text-sm shadow-[0_0_20px_rgba(255,51,102,0.3)] transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ir para a Página de Login</span>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-[#0d1017]/90 border border-white/10 rounded-2xl p-8 text-center text-slate-400">
          Carregando orientações...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
