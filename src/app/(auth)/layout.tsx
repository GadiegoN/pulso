import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-[#ff3366] selection:text-white relative overflow-hidden font-sans">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#ff3366]/20 via-[#7928ca]/20 to-[#00f0ff]/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[300px] bg-[#00f0ff]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Topo / Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Voltar ao início</span>
        </Link>

        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff3366] to-[#7928ca] flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(255,51,102,0.4)]">
            P
          </div>
          <span className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            PULSO
          </span>
        </Link>
      </header>

      {/* Conteúdo Central */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Rodapé de Segurança */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-slate-500 border-t border-white/5 bg-[#07090e]/60 backdrop-blur-md">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Ambiente Protegido por Criptografia de Ponta a Ponta & Controle de Acesso Baseado em Papéis (RBAC)</span>
        </div>
      </footer>
    </div>
  );
}
