import React from 'react';
import Link from 'next/link';
import { ShieldX, ArrowLeft, LogOut } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="w-full bg-[#0d1017]/90 border border-red-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
        <ShieldX className="w-8 h-8" />
      </div>

      <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold mb-3">
        ERRO 403 — ACESSO NEGADO
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
        Privilégios Insuficientes
      </h1>

      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        A rota solicitada é restrita ao grupo de <strong>Administradores</strong> da plataforma PULSO. Sua conta atual possui papel de usuário comum ou não possui autorização para esta área.
      </p>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs text-slate-400 space-y-2 mb-6">
        <p className="font-semibold text-slate-200">Política de Governança Institucional:</p>
        <p>
          A plataforma não permite auto-atribuição de permissões. O acesso ao painel de gestão requer convite institucional formal expedido por um administrador ativo.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Início</span>
        </Link>

        <Link
          href="/auth/logout"
          className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-medium text-sm flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Trocar de Conta</span>
        </Link>
      </div>
    </div>
  );
}
