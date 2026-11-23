'use client';

import React, { useState, useActionState } from 'react';
import {
  createWhatsappChannelAction,
  toggleWhatsappChannelAction,
  deleteWhatsappChannelAction,
  createWhatsappBroadcastAction,
  deleteWhatsappBroadcastAction,
  type WhatsappActionState,
} from '@/lib/whatsapp/actions';
import {
  MessageSquare,
  Send,
  Users,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Megaphone,
  ShieldAlert,
  Store,
  Newspaper,
  MapPin,
  Clock,
} from 'lucide-react';

const initialState: WhatsappActionState = {};

interface Props {
  channels: any[];
  broadcasts: any[];
  cities: any[];
  establishments: any[];
}

const CATEGORY_META: Record<
  string,
  { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  public_utility: {
    label: 'Utilidade Pública',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: Megaphone,
  },
  civic_alert: {
    label: 'Alerta da Cidade',
    badgeClass: 'bg-red-500/15 text-red-300 border-red-500/30',
    icon: ShieldAlert,
  },
  partner_offer: {
    label: 'Informe Comercial',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: Store,
  },
  local_news: {
    label: 'Notícia Comunitária',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    icon: Newspaper,
  },
};

export default function WhatsappHubView({
  channels,
  broadcasts,
  cities,
  establishments,
}: Props) {
  const [activeTab, setActiveTab] = useState<'composer' | 'history' | 'channels'>('composer');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live composer preview states
  const [selectedCityId, setSelectedCityId] = useState<string>(cities[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<
    'public_utility' | 'civic_alert' | 'partner_offer' | 'local_news'
  >('public_utility');
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');

  const [broadcastState, broadcastAction, isBroadcastPending] = useActionState(
    createWhatsappBroadcastAction,
    initialState
  );

  const [channelState, channelAction, isChannelPending] = useActionState(
    createWhatsappChannelAction,
    initialState
  );

  if (channelState?.success && showChannelModal) {
    setShowChannelModal(false);
    channelState.success = false;
  }

  // Live preview generator matching server formatter
  const selectedCity = cities.find((c) => c.id === selectedCityId) || cities[0];
  const selectedEst = establishments.find((e) => e.id === selectedEstablishmentId);

  const liveFormattedMessage = (() => {
    const headers: Record<string, string> = {
      public_utility: '📢 *UTILIDADE PÚBLICA • PULSO*',
      civic_alert: '🚨 *ALERTA DA CIDADE • PULSO*',
      partner_offer: '🏷️ *DESTAQUE DO COMÉRCIO LOCAL • PULSO*',
      local_news: '📰 *INFORME COMUNITÁRIO • PULSO*',
    };
    const lines: string[] = [
      headers[selectedCategory] || '📢 *COMUNICADO PULSO*',
      `📍 _${selectedCity ? `${selectedCity.name} - ${selectedCity.state}` : 'Conquista - MG'}_`,
      '',
      `*${(title || 'Título do Comunicado').toUpperCase()}*`,
    ];
    if (selectedEst) {
      lines.push(`🏢 Parceiro: *${selectedEst.name}*`);
    }
    lines.push('', messageBody.trim() || 'Digite o conteúdo do comunicado para visualizar a formatação oficial de disparo...');
    if (ctaUrl.trim()) {
      lines.push('', `🔗 *Acesse:* ${ctaUrl.trim()}`);
    }
    lines.push('', '━━━━━━━━━━━━━━━━━━━━', '📻 *PULSO — Rede de Comunicação Local*');
    return lines.join('\n');
  })();

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const totalMembers = channels
    .filter((c) => c.isActive)
    .reduce((acc, c) => acc + (c.memberCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* KPI Header Card */}
      <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-white">
                Hub de Transmissão Comunitária via WhatsApp
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {channels.filter((c) => c.isActive).length} Grupos Ativos • {totalMembers} Moradores
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Padronização de comunicados oficiais, alertas municipais e ofertas de parceiros verificados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowChannelModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Novo Grupo / Lista</span>
          </button>
        </div>
      </div>

      {/* Navegação de Abas */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('composer')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'composer'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Formatador & Novo Comunicado</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Histórico de Disparos ({broadcasts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'channels'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Grupos & Listas da Cidade ({channels.length})</span>
        </button>
      </div>

      {/* ABA 1: COMPOSER & PREVIEW ESTRUTURADO */}
      {activeTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl">
            <h3 className="text-base font-bold text-white mb-1">
              Estruturar Comunicado Oficial
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              O sistema aplica automaticamente a assinatura criptográfica e a formatação de leitura rápida para WhatsApp.
            </p>

            {broadcastState?.error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{broadcastState.error}</span>
              </div>
            )}

            {broadcastState?.success && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Comunicado registrado na auditoria e pronto para distribuição!</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        broadcastState.formattedPreview || liveFormattedMessage,
                        'latest-broadcast'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedId === 'latest-broadcast' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Texto Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Mensagem Formatada</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      broadcastState.formattedPreview || liveFormattedMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Encaminhar no WhatsApp Web</span>
                  </a>
                </div>
              </div>
            )}

            <form action={broadcastAction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Cidade Alvo *
                  </label>
                  <select
                    name="cityId"
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Natureza do Comunicado *
                  </label>
                  <select
                    name="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="public_utility">📢 Utilidade Pública</option>
                    <option value="civic_alert">🚨 Alerta da Cidade / Urgente</option>
                    <option value="partner_offer">🏷️ Informe Comercial de Parceiro</option>
                    <option value="local_news">📰 Notícia / Informe Comunitário</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Grupo / Lista de Destino (Opcional)
                  </label>
                  <select
                    name="channelId"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Todos os Grupos da Cidade</option>
                    {channels.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.neighborhoodOrScope})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Comércio Parceiro Vinculado (Opcional)
                  </label>
                  <select
                    name="establishmentId"
                    value={selectedEstablishmentId}
                    onChange={(e) => setSelectedEstablishmentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Comunicado Institucional (Sem comércio)</option>
                    {establishments.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Título Principal *
                </label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ex: Campanha de Vacinação no Posto Central ou Oferta do Dia"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Corpo do Comunicado *
                </label>
                <textarea
                  name="messageBody"
                  rows={5}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  required
                  placeholder="Escreva as informações claras com horários, local ou detalhes para os moradores..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Link de Ação / WhatsApp Direto (Opcional)
                </label>
                <input
                  type="url"
                  name="ctaUrl"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://wa.me/5534999999999"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleCopy(liveFormattedMessage, 'live-preview')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedId === 'live-preview' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Prévia</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={isBroadcastPending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isBroadcastPending
                      ? 'Registrando Disparo...'
                      : 'Registrar & Gerar Disparo Oficial'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Simulador Visual WhatsApp */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Prévia Real no WhatsApp
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Formatação Automática
                  </span>
                </div>

                {/* Bolha estilo WhatsApp Dark */}
                <div className="p-4 rounded-2xl bg-[#0b141a] border border-emerald-500/20 shadow-inner">
                  <div className="p-3.5 rounded-xl bg-[#005c4b] text-slate-100 text-xs leading-relaxed whitespace-pre-wrap font-sans shadow-md">
                    {liveFormattedMessage}
                    <div className="text-[10px] text-emerald-200/70 text-right mt-2 font-mono">
                      PULSO Oficial ✓✓
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Pronto para colar em listas ou disparar via WhatsApp Web
                </span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(liveFormattedMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <span>Abrir WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: HISTÓRICO DE DISPAROS */}
      {activeTab === 'history' && (
        <div className="rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Registro Histórico de Comunicados & Disparos
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Todos os comunicados gerados ficam auditados com data, autor e cópia integral do texto
              </p>
            </div>
          </div>

          {broadcasts.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">
                Nenhum comunicado registrado até o momento
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Utilize a aba &ldquo;Formatador & Novo Comunicado&rdquo; para criar o primeiro disparo oficial.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {broadcasts.map((b) => {
                const meta = CATEGORY_META[b.category] || CATEGORY_META.public_utility;
                return (
                  <div
                    key={b.id}
                    className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {b.cityName}/{b.cityState}
                        </span>
                        {b.channelName && (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[11px]">
                            Grupo: {b.channelName}
                          </span>
                        )}
                        {b.establishmentName && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[11px]">
                            Parceiro: {b.establishmentName}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">
                          • {new Date(b.dispatchedAt).toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{b.title}</h4>
                      <p className="text-xs text-slate-300 whitespace-pre-line">
                        {b.messageBody}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(b.formattedMessage, b.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedId === b.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Formatado</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(b.formattedMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Reenviar</span>
                      </a>

                      <form
                        action={async () => {
                          await deleteWhatsappBroadcastAction(b.id);
                        }}
                      >
                        <button
                          type="submit"
                          title="Excluir do histórico"
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 3: GRUPOS E LISTAS DA CIDADE */}
      {activeTab === 'channels' && (
        <div className="rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Grupos Comunitários & Listas de Transmissão
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Canais de distribuição segmentados por bairro ou perfil em Conquista - MG
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowChannelModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Grupo</span>
            </button>
          </div>

          {channels.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">
                Nenhum grupo ou lista cadastrada
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Cadastre os grupos de WhatsApp da cidade para organizar seus canais de distribuição.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                    <th className="py-3.5 px-6">Nome do Grupo / Lista</th>
                    <th className="py-3.5 px-6">Bairro / Escopo</th>
                    <th className="py-3.5 px-6">Cidade</th>
                    <th className="py-3.5 px-6">Participantes</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {channels.map((ch) => (
                    <tr key={ch.id} className="hover:bg-white/[0.02]">
                      <td className="py-4 px-6 font-semibold text-white">
                        {ch.name}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-300">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {ch.neighborhoodOrScope}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400">
                        {ch.cityName} - {ch.cityState}
                      </td>
                      <td className="py-4 px-6 text-xs font-mono text-slate-300">
                        {ch.memberCount} membros
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            ch.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}
                        >
                          {ch.isActive ? 'Ativo' : 'Pausado'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {ch.inviteLink && (
                            <a
                              href={ch.inviteLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1"
                            >
                              <span>Abrir Grupo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          <form
                            action={async () => {
                              await toggleWhatsappChannelAction(ch.id, !ch.isActive);
                            }}
                          >
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                            >
                              {ch.isActive ? 'Pausar' : 'Ativar'}
                            </button>
                          </form>

                          <form
                            action={async () => {
                              await deleteWhatsappChannelAction(ch.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de Novo Canal / Grupo */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0f17] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                Cadastrar Grupo ou Lista de WhatsApp
              </h3>
              <button
                type="button"
                onClick={() => setShowChannelModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {channelState?.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {channelState.error}
              </div>
            )}

            <form action={channelAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Nome do Grupo / Lista *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: PULSO Conquista — Geral #01"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Bairro ou Escopo de Alcance *
                </label>
                <input
                  type="text"
                  name="neighborhoodOrScope"
                  required
                  placeholder="Ex: Centro & Bairros / Alertas Oficiais"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Qtd. Membros
                  </label>
                  <input
                    type="number"
                    name="memberCount"
                    min={0}
                    defaultValue={0}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Link de Convite (Opcional)
                  </label>
                  <input
                    type="url"
                    name="inviteLink"
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowChannelModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isChannelPending}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer"
                >
                  {isChannelPending ? 'Salvando...' : 'Salvar Grupo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
