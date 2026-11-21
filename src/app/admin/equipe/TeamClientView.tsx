'use client';

import React, { useActionState, useState } from 'react';
import {
  createInvitationAction,
  revokeInvitationAction,
  toggleUserStatusAction,
  type InviteActionState,
} from '@/lib/admin/actions';
import {
  Mail,
  UserPlus,
  Shield,
  Ban,
  CheckCircle,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Trash2,
} from 'lucide-react';

const initialInviteState: InviteActionState = {};

interface Props {
  currentAdminId: string;
  profiles: any[];
  invitations: any[];
}

export default function TeamClientView({
  currentAdminId,
  profiles,
  invitations,
}: Props) {
  const [inviteState, formAction, isPending] = useActionState(
    createInvitationAction,
    initialInviteState
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Bloco de Expedição de Novo Convite */}
      <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff3366]/20 to-[#7928ca]/20 border border-[#ff3366]/30 flex items-center justify-center text-[#ff3366]">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Expedir Convite Institucional</h2>
            <p className="text-xs text-slate-400">
              Gera um token criptográfico único com validade de 48 horas para primeiro acesso
            </p>
          </div>
        </div>

        {inviteState?.error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{inviteState.error}</span>
          </div>
        )}

        {inviteState?.success && inviteState.inviteLink && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>Convite expedido com sucesso e registrado na auditoria!</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Envie o link de ativação abaixo para o novo membro:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteState.inviteLink}
                className="flex-1 bg-[#121622] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(inviteState.inviteLink!)}
                className="px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>
        )}

        <form action={formAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              E-mail do Convidado
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                name="email"
                required
                placeholder="membro@institucional.com"
                className="w-full bg-[#121622] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Papel Atribuído
            </label>
            <select
              name="role"
              required
              className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff3366] transition-all"
            >
              <option value="operator">Operador da Plataforma</option>
              <option value="merchant">Comerciante Parceiro</option>
              <option value="admin">Administrador do Sistema</option>
            </select>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] text-white font-semibold text-xs shadow-[0_0_15px_rgba(255,51,102,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Gerar Convite Seguro</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tabela de Membros Registrados */}
      <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00f0ff]" />
              <span>Membros & Usuários do Sistema</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Controle de acesso baseado em papéis (RBAC) com integridade de banco de dados
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Total: {profiles.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-3 font-semibold">Nome / E-mail</th>
                <th className="px-6 py-3 font-semibold">Papel (Role)</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Data de Registro</th>
                <th className="px-6 py-3 font-semibold text-right">Ações de Governança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {profiles.map((p) => {
                const isSelf = p.id === currentAdminId;
                const isSuspended = p.status === 'suspended';

                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-white">
                        {p.fullName || 'Sem nome informado'}
                        {isSelf && (
                          <span className="ml-2 text-[10px] text-cyan-400 font-normal">
                            (Você)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.email}</div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          p.role === 'admin'
                            ? 'bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366]/30'
                            : p.role === 'operator'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : p.role === 'merchant'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        {p.role}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium ${
                          p.status === 'active'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : p.status === 'suspended'
                            ? 'text-red-400 bg-red-500/10'
                            : 'text-amber-400 bg-amber-500/10'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === 'active'
                              ? 'bg-emerald-400'
                              : p.status === 'suspended'
                              ? 'bg-red-400'
                              : 'bg-amber-400'
                          }`}
                        />
                        <span>{p.status}</span>
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      {!isSelf && p.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() =>
                            toggleUserStatusAction(
                              p.id,
                              isSuspended ? 'active' : 'suspended'
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSuspended
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {isSuspended ? 'Reativar Conta' : 'Suspender Acesso'}
                        </button>
                      )}
                      {p.role === 'admin' && (
                        <span className="text-[11px] text-slate-500 italic">
                          {isSelf ? 'Sua Conta' : 'Admin Protegido'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabela de Convites Pendentes */}
      <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ff3366]" />
              <span>Histórico de Convites Emitidos</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tokens com prazo de expiração controlados no servidor
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Total: {invitations.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-3 font-semibold">E-mail Convidado</th>
                <th className="px-6 py-3 font-semibold">Papel Ofertado</th>
                <th className="px-6 py-3 font-semibold">Status do Convite</th>
                <th className="px-6 py-3 font-semibold">Expiração</th>
                <th className="px-6 py-3 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-sans">
                    Nenhum convite emitido até o momento.
                  </td>
                </tr>
              ) : (
                invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5 text-white">{inv.email}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200 font-bold uppercase text-[10px]">
                        {inv.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          inv.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : inv.status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 text-[11px]">
                      {new Date(inv.expiresAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-3.5 text-right font-sans">
                      {inv.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => revokeInvitationAction(inv.id)}
                          className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs transition-colors cursor-pointer"
                        >
                          Revogar
                        </button>
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
