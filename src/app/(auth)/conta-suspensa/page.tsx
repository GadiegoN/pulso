import React from 'react';
import Link from 'next/link';
import { Ban, LogOut } from 'lucide-react';

export default function SuspendedAccountPage() {
  return (
    <div className="w-full bg-[#0d1017]/90 border border-amber-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
        <Ban className="w-8 h-8" />
      </div>

      <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold mb-3">
        CONTA SUSPENSA
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
        Acesso Interrompido
      </h1>

      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        O acesso associado a este perfil foi preventivamente suspenso pela administração por razões de conformidade, segurança ou violação dos termos de uso.
      </p>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs text-slate-400 space-y-2 mb-6">
        <p className="font-semibold text-slate-200">Como proceder:</p>
        <p>
          Caso acredite que se trata de um engano ou deseje solicitar a reativação de sua conta, entre em contato diretamente com a equipe de governança da plataforma PULSO informando seu e-mail cadastrado.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/auth/logout"
          className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Encerrar Sessão</span>
        </Link>
      </div>
    </div>
  );
}
