import React from 'react';
import Link from 'next/link';
import { requireMerchant } from '@/lib/auth/server';
import { logoutAction } from '@/lib/auth/actions';
import { connection } from 'next/server';
import {
  Store,
  Radio,
  ExternalLink,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';

export const instant = false;

export default async function MerchantPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const profile = await requireMerchant();

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col font-sans selection:bg-[#ff3366] selection:text-white">
      {/* Top Navbar */}
      <header className="h-18 border-b border-white/10 bg-[#0a0d14]/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/portal" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#ff3366] flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(245,158,11,0.35)]">
              P
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider block text-white">
                PULSO
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold block -mt-0.5">
                Portal do Comerciante
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 pl-4 border-l border-white/10 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ambiente Exclusivo do Parceiro</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {profile.role === 'admin' && (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Painel Admin</span>
            </Link>
          )}

          <Link
            href="/guia"
            target="_blank"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ver Guia Comercial</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </Link>

          <div className="hidden sm:flex flex-col items-end px-2">
            <span className="text-xs font-bold text-white">
              {profile.fullName || 'Parceiro PULSO'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {profile.email}
            </span>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs text-red-300 border border-red-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
