import React from 'react';
import { db } from '@/lib/db';
import { connection } from 'next/server';

export const instant = false;
import { auditLogs, profiles } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth/server';
import { ShieldAlert, Database, Terminal } from 'lucide-react';

export default async function AuditPage() {
  await connection();
  await requireAdmin();

  const logs = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      actorId: auditLogs.actorId,
      actorEmail: profiles.email,
      actorName: profiles.fullName,
      targetUserId: auditLogs.targetUserId,
      details: auditLogs.details,
      ipAddress: auditLogs.ipAddress,
      userAgent: auditLogs.userAgent,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .leftJoin(profiles, eq(auditLogs.actorId, profiles.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(100);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            <span>Trilha Perene de Auditoria</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Registro imutável de eventos de governança, mutações de privilégios e acessos críticos
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tabela audit_logs ({logs.length} registros exibidos)</span>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-3 font-semibold">Data & Hora</th>
                <th className="px-6 py-3 font-semibold">Ação Auditada</th>
                <th className="px-6 py-3 font-semibold">Autor (Operador)</th>
                <th className="px-6 py-3 font-semibold">IP / Origem</th>
                <th className="px-6 py-3 font-semibold">Payload & Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-sans">
                    Nenhum registro de auditoria gravado até o momento.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-white font-sans">
                      <div>{log.actorName || log.actorEmail || 'Sistema (Automático)'}</div>
                      {log.actorEmail && log.actorName && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          {log.actorEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="px-6 py-3.5 text-slate-400 max-w-sm truncate font-sans">
                      {log.details ? (
                        <span title={JSON.stringify(log.details, null, 2)}>
                          {JSON.stringify(log.details)}
                        </span>
                      ) : (
                        '—'
                      )}
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
