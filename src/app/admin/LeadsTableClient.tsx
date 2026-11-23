'use client';

import React, { useState, useActionState } from 'react';
import {
  updateLeadStatusAction,
  deleteLeadAction,
  convertLeadToPartnerAction,
  type ConvertLeadState,
} from '@/lib/leads/actions';
import {
  MessageSquare,
  MapPin,
  Phone,
  Store,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface LeadItem {
  id: string;
  name: string;
  city: string;
  whatsapp: string;
  email: string | null;
  interest: string;
  status: 'new' | 'contacted' | 'converted' | 'archived';
  createdAt: Date;
}

interface Props {
  leads: LeadItem[];
  cities: { id: string; name: string; state: string }[];
  categories: { id: string; name: string }[];
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  new: {
    label: 'Novo Lead',
    className: 'bg-[#ff3366]/15 text-[#ff3366] border-[#ff3366]/30',
  },
  contacted: {
    label: 'Em Atendimento',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  converted: {
    label: 'Convertido em Parceiro',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  archived: {
    label: 'Arquivado',
    className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  },
};

const initialConvertState: ConvertLeadState = {};

function extractCompanyName(interest: string, fallbackName: string): string {
  const match = interest.match(/Empresa\/Negócio:\s*([^|]+)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return fallbackName;
}

export default function LeadsTableClient({ leads, cities, categories }: Props) {
  const [convertingLead, setConvertingLead] = useState<LeadItem | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const [convertState, convertAction, isConvertPending] = useActionState(
    convertLeadToPartnerAction,
    initialConvertState
  );

  const handleCopyInvite = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#ff3366]" />
            <span>Funil Comercial — Interesses Cadastrados na Landing Page</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Atenda pelo WhatsApp e converta leads aprovados diretamente em Comércios Parceiros e contas do Portal
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Exibindo: {leads.length}
        </span>
      </div>

      {/* Feedback de Conversão Bem-Sucedida */}
      {convertState?.success && (
        <div className="m-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-bold flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Estabelecimento &ldquo;{convertState.establishmentName}&rdquo; criado no Guia Comercial!
              </span>
            </div>
          </div>
          {convertState.inviteUrl && (
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <span className="text-slate-300">
                Convite do Portal do Comerciante (48h):
              </span>
              <code className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-cyan-300 font-mono text-[11px] break-all">
                {convertState.inviteUrl}
              </code>
              <button
                type="button"
                onClick={() => handleCopyInvite(convertState.inviteUrl!)}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedInvite ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Link de Primeiro Acesso</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="px-6 py-3 font-semibold">Nome / Contato</th>
              <th className="px-6 py-3 font-semibold">Praça / Cidade</th>
              <th className="px-6 py-3 font-semibold">WhatsApp</th>
              <th className="px-6 py-3 font-semibold">Interesse & Empresa</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-sans">
                  Nenhum interesse registrado até o momento. O formulário na página inicial está ativo e gravando no banco.
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.new;
                return (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-white">{lead.name}</div>
                      {lead.email && (
                        <div className="text-[11px] text-slate-500 font-mono">
                          {lead.email}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{lead.city}</span>
                      </span>
                    </td>

                    <td className="px-6 py-3.5 font-mono text-cyan-300">
                      <a
                        href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => {
                          if (lead.status === 'new') {
                            updateLeadStatusAction(lead.id, 'contacted');
                          }
                        }}
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lead.whatsapp}</span>
                      </a>
                    </td>

                    <td
                      className="px-6 py-3.5 text-slate-300 max-w-xs truncate"
                      title={lead.interest}
                    >
                      {lead.interest}
                    </td>

                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {lead.status !== 'converted' && (
                          <button
                            type="button"
                            onClick={() => setConvertingLead(lead)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-[#ff3366]/20 hover:from-amber-500/30 hover:to-[#ff3366]/30 border border-amber-500/30 text-amber-300 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Converter em Parceiro</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Excluir o lead de "${lead.name}"?`)) {
                              deleteLeadAction(lead.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                          title="Excluir lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Conversão de Lead em Parceiro */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0f17] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Converter Lead em Comércio Parceiro
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConvertingLead(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            {convertState?.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{convertState.error}</span>
              </div>
            )}

            <form
              action={async (formData) => {
                await convertAction(formData);
                setConvertingLead(null);
              }}
              className="space-y-4 text-xs"
            >
              <input type="hidden" name="leadId" value={convertingLead.id} />

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Nome do Estabelecimento Comercial *
                </label>
                <input
                  type="text"
                  name="establishmentName"
                  required
                  defaultValue={extractCompanyName(
                    convertingLead.interest,
                    convertingLead.name
                  )}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Cidade *
                  </label>
                  <select
                    name="cityId"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Categoria no Guia *
                  </label>
                  <select
                    name="categoryId"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    WhatsApp Oficial *
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    required
                    defaultValue={convertingLead.whatsapp}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    E-mail do Comerciante (Para Convite)
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={convertingLead.email || ''}
                    placeholder="comerciante@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Descrição Inicial da Vitrine
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={`Parceiro oficial da rede PULSO em ${convertingLead.city}.`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                />
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  name="generateInvite"
                  defaultChecked={Boolean(convertingLead.email)}
                  className="rounded accent-[#ff3366]"
                />
                <span className="text-slate-200">
                  Expedir automaticamente convite criptográfico de acesso ao{' '}
                  <strong className="text-amber-300">Portal do Comerciante (/portal)</strong>
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setConvertingLead(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isConvertPending}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#ff3366] text-white font-bold cursor-pointer"
                >
                  {isConvertPending
                    ? 'Convertendo...'
                    : 'Aprovar & Criar Estabelecimento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
