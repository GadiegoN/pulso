import React from 'react';
import Link from 'next/link';
import { connection } from 'next/server';

export const instant = false;
import { db } from '@/lib/db';
import { profiles, invitations, auditLogs, securityEvents, leads } from '@/lib/db/schema';
import { sql, desc } from 'drizzle-orm';
import {
  Users,
  MailCheck,
  ShieldAlert,
  Activity,
  ArrowRight,
  ShieldCheck,
  Clock,
  MessageSquare,
  MapPin,
  Phone,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  await connection();
  // Consultas reais de contagem no PostgreSQL
  const [profilesCount] = await db.select({ count: sql<number>`count(*)::int` }).from(profiles);
  const [invitationsCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(invitations)
    .where(sql`status = 'pending'`);
  const [leadsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(leads);
  const [auditLogsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(auditLogs);

  // Últimos 6 leads capturados pela Landing Page
  const recentLeads = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt))
    .limit(6);

  // Últimos 6 registros de auditoria
  const recentLogs = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(6);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Painel de Controle Institucional
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visão geral da governança, captação de leads e integridade do ecossistema PULSO
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/equipe"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] text-white font-medium text-xs shadow-[0_0_15px_rgba(255,51,102,0.3)] transition-all flex items-center gap-2"
          >
            <MailCheck className="w-4 h-4" />
            <span>Expedir Convite</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas Reais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Leads de Interesse da Landing Page */}
        <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Leads Capturados (Home)
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#ff3366]/10 border border-[#ff3366]/30 flex items-center justify-center text-[#ff3366]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {leadsCount?.count ?? 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-400">●</span> Formulário de interesse conectado
          </p>
        </div>

        {/* Card 2: Membros Registrados */}
        <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Perfis Registrados
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {profilesCount?.count ?? 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            PostgreSQL & Supabase Auth
          </p>
        </div>

        {/* Card 3: Convites Pendentes */}
        <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Convites Pendentes
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <MailCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {invitationsCount?.count ?? 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            Aguardando validação de primeiro acesso
          </p>
        </div>

        {/* Card 4: Auditoria */}
        <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ações Auditadas
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {auditLogsCount?.count ?? 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            Trilha perene e imutável
          </p>
        </div>
      </div>

      {/* Tabela de Leads Recentes Capturados */}
      <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#ff3366]" />
              <span>Interesses Cadastrados na Landing Page</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comerciantes, prefeituras e parceiros que preencheram o formulário de contato
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Total: {recentLeads.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-3 font-semibold">Nome / Contato</th>
                <th className="px-6 py-3 font-semibold">Praça / Cidade</th>
                <th className="px-6 py-3 font-semibold">WhatsApp</th>
                <th className="px-6 py-3 font-semibold">Interesse & Detalhes</th>
                <th className="px-6 py-3 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-sans">
                    Nenhum interesse registrado até o momento. O formulário na página inicial está ativo e gravando no banco.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-white">{lead.name}</div>
                      {lead.email && <div className="text-[11px] text-slate-500 font-mono">{lead.email}</div>}
                    </td>

                    <td className="px-6 py-3.5 text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lead.city}</span>
                    </td>

                    <td className="px-6 py-3.5 font-mono text-cyan-300">
                      <a
                        href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lead.whatsapp}</span>
                      </a>
                    </td>

                    <td className="px-6 py-3.5 text-slate-300 max-w-xs truncate" title={lead.interest}>
                      {lead.interest}
                    </td>

                    <td className="px-6 py-3.5 text-slate-500 font-mono text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabela de Trilha de Auditoria Recente */}
      <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Trilha de Auditoria Recente</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Eventos críticos registrados automaticamente no servidor
            </p>
          </div>

          <Link
            href="/admin/auditoria"
            className="text-xs text-[#00f0ff] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Ver histórico completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-3 font-semibold">Horário</th>
                <th className="px-6 py-3 font-semibold">Ação Executada</th>
                <th className="px-6 py-3 font-semibold">IP de Origem</th>
                <th className="px-6 py-3 font-semibold">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-sans">
                    Nenhum registro de auditoria gravado até o momento.
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-slate-400">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="px-6 py-3.5 text-slate-400 truncate max-w-xs font-sans">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
