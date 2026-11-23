import React from 'react';
import Link from 'next/link';
import { requireStaff } from '@/lib/auth/server';
import { logoutAction } from '@/lib/auth/actions';
import { connection } from 'next/server';
import {
  LayoutDashboard,
  Users,
  Radio,
  Store,
  MessageSquare,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  // REGRA INEGOCIÁVEL 4: Guarda de Servidor Estrita
  // Valida que o usuário está autenticado, com perfil ativo e papel 'admin' ou 'operator'.
  // Rotas de governança (/admin/equipe e /admin/auditoria) exigem requireAdmin() adicionalmente.
  const adminProfile = await requireStaff();
  const isSuperAdmin = adminProfile.role === 'admin';

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex font-sans selection:bg-[#ff3366] selection:text-white">
      {/* Sidebar de Navegação */}
      <aside className="w-64 border-r border-white/10 bg-[#0a0d14]/90 backdrop-blur-xl flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff3366] to-[#7928ca] flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(255,51,102,0.4)]">
                P
              </div>
              <div>
                <span className="font-extrabold text-base tracking-wider block bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                  PULSO
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#00f0ff] font-semibold block -mt-0.5">
                  Painel Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Menus Principais */}
          <nav className="p-4 space-y-1.5 text-sm">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-[#ff3366]" />
              <span>Visão Geral</span>
            </Link>

            {isSuperAdmin && (
              <Link
                href="/admin/equipe"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium"
              >
                <Users className="w-4 h-4 text-[#00f0ff]" />
                <span>Equipe & Convites</span>
              </Link>
            )}

            <Link
              href="/admin/radio"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              <Radio className="w-4 h-4 text-purple-400" />
              <span>Rádio Digital</span>
            </Link>

            <Link
              href="/admin/comercios"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Comércios & Parceiros</span>
            </Link>

            <Link
              href="/admin/whatsapp"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Central WhatsApp</span>
            </Link>

            {isSuperAdmin && (
              <Link
                href="/admin/auditoria"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium"
              >
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>Auditoria Geral</span>
              </Link>
            )}

            <Link
              href="/admin/seguranca"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>MFA & Sessões</span>
            </Link>
          </nav>
        </div>

        {/* Rodapé da Sidebar: Usuário Autenticado & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                {adminProfile.fullName || (isSuperAdmin ? 'Administrador' : 'Operador')}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  isSuperAdmin
                    ? 'bg-[#ff3366]/20 text-[#ff3366] border-[#ff3366]/40'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                }`}
              >
                {isSuperAdmin ? 'Admin' : 'Operador'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate font-mono">
              {adminProfile.email}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Site</span>
            </Link>

            <form action={logoutAction} className="flex-1">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-300 border border-red-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra Superior */}
        <header className="h-16 border-b border-white/10 bg-[#0a0d14]/60 backdrop-blur-md px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sessão Administrativa Protegida</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-slate-400">PULSO v0.1 Enterprise</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PostgreSQL & Supabase Online</span>
            </div>
          </div>
        </header>

        {/* Conteúdo Dinâmico */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
