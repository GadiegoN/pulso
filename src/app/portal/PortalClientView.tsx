'use client';

import React, { useState, useActionState } from 'react';
import {
  updateMerchantEstablishmentAction,
  createSpotRequestAction,
  type PortalActionState,
} from '@/lib/portal/actions';
import {
  Store,
  Radio,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit3,
  MapPin,
  Volume2,
  Sparkles,
  Send,
  ExternalLink,
  QrCode,
  Printer,
  Copy,
  Check,
  Star,
} from 'lucide-react';

const initialState: PortalActionState = {};

interface Props {
  profile: {
    id: string;
    fullName: string | null;
    email: string;
    role: string;
  };
  establishments: any[];
  spots: any[];
  schedules: any[];
  spotRequests: any[];
}

const REQUEST_STATUS_META: Record<
  string,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: 'Em Análise pela Rádio',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  approved: {
    label: 'Aprovado / Em Gravação',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  },
  produced: {
    label: 'No Ar na Programação',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  rejected: {
    label: 'Revisão Necessária',
    badgeClass: 'bg-red-500/15 text-red-300 border-red-500/30',
  },
};

export default function PortalClientView({
  profile,
  establishments,
  spots,
  schedules,
  spotRequests,
}: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'spots' | 'qrcode'>('overview');
  const [selectedEstId, setSelectedEstId] = useState<string>(
    establishments[0]?.id || ''
  );
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateMerchantEstablishmentAction,
    initialState
  );

  const [reqState, reqAction, isReqPending] = useActionState(
    createSpotRequestAction,
    initialState
  );

  if (reqState?.success && showRequestModal) {
    setShowRequestModal(false);
    reqState.success = false;
  }

  const currentEst =
    establishments.find((e) => e.id === selectedEstId) || establishments[0];

  const totalClicks = establishments.reduce(
    (acc, e) => acc + (e.whatsappClicks || 0),
    0
  );
  const activeSpotsCount = spots.filter((s) => s.isActive).length;

  if (establishments.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-[#0c0f17] border border-white/10 text-center max-w-2xl mx-auto my-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Bem-vindo ao Portal do Parceiro PULSO, {profile.fullName || profile.email}
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          Sua conta de comerciante está ativa e verificada. No momento, a administração
          está finalizando a vinculação do seu estabelecimento ao seu perfil. Assim que
          vinculado, seus indicadores de WhatsApp, dados da vitrine e spots da rádio
          aparecerão automaticamente aqui.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Credencial de Comerciante Ativa ({profile.email})</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Topo & Seletor de Estabelecimento */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Painel do Comerciante Parceiro
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Acompanhe o desempenho do seu comércio no Guia Local e gerencie seus spots na Rádio Digital
          </p>
        </div>

        <div className="flex items-center gap-3">
          {establishments.length > 1 && (
            <select
              value={selectedEstId}
              onChange={(e) => setSelectedEstId(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#0c0f17] border border-white/10 text-xs font-semibold text-white"
            >
              {establishments.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#ff3366]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Solicitar Novo Spot na Rádio</span>
          </button>
        </div>
      </div>

      {/* KPIs do Comerciante */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">
              Status no Guia Comercial
            </span>
            <Store className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                currentEst?.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span className="text-xl font-black text-white">
              {currentEst?.isActive ? 'Vitrine Ativa' : 'Em Revisão'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {currentEst?.categoryName} • {currentEst?.cityName}/{currentEst?.cityState}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">
              Cliques no WhatsApp Oficial
            </span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalClicks}</div>
          <p className="text-[11px] text-emerald-400/80 mt-1">
            Contatos diretos originados no Guia PULSO
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">
              Spots de Áudio Ativos
            </span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeSpotsCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {schedules.filter((s) => s.isActive).length} inserções programadas na grade
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">
              Solicitações de Campanha
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {spotRequests.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {spotRequests.filter((r) => r.status === 'pending').length} aguardando produção
          </p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Meus Spots & Grade na Rádio ({spots.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('spots')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'spots'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Pedidos de Novos Spots ({spotRequests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'edit'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editar Dados do Meu Comércio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qrcode')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'qrcode'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Plaquinha QR Code & Vitrine</span>
        </button>
      </div>

      {/* ABA 1: SPOTS E GRADE */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl bg-[#0c0f17] border border-white/10 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Spots de Áudio Vinculados
                </h3>
                <p className="text-xs text-slate-400">
                  Ouça os spots produzidos para o seu estabelecimento na Rádio PULSO
                </p>
              </div>
            </div>

            {spots.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl">
                <Volume2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">
                  Nenhum spot de áudio ativo ainda
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Envie uma solicitação com o texto da sua oferta ou anúncio para nossa equipe gravar.
                </p>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(true)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white cursor-pointer"
                >
                  Solicitar Primeiro Spot
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {spots.map((spot) => (
                  <div
                    key={spot.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {spot.title}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {spot.establishmentName} • {spot.durationSeconds}s
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          spot.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {spot.isActive ? 'Em Veiculação' : 'Inativo'}
                      </span>
                    </div>

                    <audio
                      controls
                      preload="none"
                      src={spot.audioUrl}
                      className="w-full h-9 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#0c0f17] border border-white/10 p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Horários Programados na Grade
              </h3>
              <p className="text-xs text-slate-400">
                Janelas de transmissão automática dos seus anúncios
              </p>
            </div>

            {schedules.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-white/10 rounded-2xl">
                <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">
                  Nenhum horário agendado para exibição automática no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-sm font-mono font-bold text-purple-300">
                        {sch.scheduledTime}
                      </span>
                      <p className="text-xs text-white font-medium">
                        {sch.spotTitle}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Dias: {sch.daysOfWeek}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        sch.isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-500/10 text-slate-400'
                      }`}
                    >
                      {sch.isActive ? 'Ativo' : 'Pausado'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: SOLICITAÇÕES DE SPOTS */}
      {activeTab === 'spots' && (
        <div className="rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Minhas Solicitações de Campanha & Áudio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Acompanhe o status de gravação e aprovação dos seus pedidos de spot
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#ff3366] hover:bg-[#e62e5c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Solicitação</span>
            </button>
          </div>

          {spotRequests.length === 0 ? (
            <div className="p-12 text-center">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">
                Você ainda não enviou solicitações de spot
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Clique em &ldquo;Solicitar Novo Spot na Rádio&rdquo; para enviar o roteiro da sua promoção.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {spotRequests.map((req) => {
                const meta =
                  REQUEST_STATUS_META[req.status] || REQUEST_STATUS_META.pending;
                return (
                  <div
                    key={req.id}
                    className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          {req.establishmentName}
                        </span>
                        {req.preferredTimeSlot && (
                          <span className="text-xs text-purple-300 font-mono">
                            • Faixa preferida: {req.preferredTimeSlot}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">
                          • {new Date(req.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{req.title}</h4>
                      <p className="text-xs text-slate-300 whitespace-pre-line bg-white/[0.02] p-3 rounded-xl border border-white/5">
                        {req.scriptNotes}
                      </p>
                      {req.adminFeedback && (
                        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                          <strong>Retorno da Equipe PULSO:</strong> {req.adminFeedback}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 3: EDITAR MEU COMÉRCIO */}
      {activeTab === 'edit' && currentEst && (
        <div className="max-w-2xl rounded-2xl bg-[#0c0f17] border border-white/10 p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-1">
            Atualizar Informações Públicas da Vitrine
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            As alterações salvas aqui atualizam imediatamente o Guia Comercial de Conquista - MG.
          </p>

          {updateState?.error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{updateState.error}</span>
            </div>
          )}

          {updateState?.success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Dados do estabelecimento atualizados com sucesso no Guia Comercial!</span>
            </div>
          )}

          <form action={updateAction} className="space-y-4">
            <input type="hidden" name="establishmentId" value={currentEst.id} />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Nome Fantasia do Estabelecimento *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={currentEst.name}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                WhatsApp Comercial de Atendimento (Com DDD) *
              </label>
              <input
                type="text"
                name="whatsapp"
                defaultValue={currentEst.whatsapp || ''}
                required
                placeholder="34999999999"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Endereço e Ponto de Referência
              </label>
              <input
                type="text"
                name="address"
                defaultValue={currentEst.address || ''}
                placeholder="Rua, Número, Bairro"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Descrição, Produtos, Serviços & Horário de Atendimento
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={currentEst.description || ''}
                placeholder="Descreva seus principais produtos, diferenciais e horário de atendimento..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatePending}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                {isUpdatePending ? 'Salvando...' : 'Salvar Alterações na Vitrine'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABA 4: PLAQUINHA QR CODE DE BALCÃO & LINK DA VITRINE */}
      {activeTab === 'qrcode' && currentEst && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controles e Link Direto */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                Divulgação no Ponto de Venda
              </span>
              <h3 className="text-lg font-bold text-white">
                Sua Vitrine Exclusiva & Plaquinha de Balcão
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Imprima a plaquinha oficial ao lado e deixe no caixa ou balcão da sua loja.
                Qualquer cliente que apontar a câmera do celular cairá direto na sua vitrine
                com seu WhatsApp e seus anúncios de ofertas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Link Oficial da Sua Vitrine PULSO:
              </span>
              <code className="block text-xs font-mono text-cyan-300 break-all">
                {typeof window !== 'undefined'
                  ? `${window.location.origin}/guia/${currentEst.slug}`
                  : `/guia/${currentEst.slug}`}
              </code>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const url = `${window.location.origin}/guia/${currentEst.slug}`;
                    await navigator.clipboard.writeText(url);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>

                <a
                  href={`/guia/${currentEst.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Abrir Minha Vitrine</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-[#ff3366] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Plaquinha QR Code para Balcão</span>
            </button>
          </div>

          {/* Cartaz / Plaquinha Imprimível */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md p-8 rounded-3xl bg-white text-slate-900 border-4 border-amber-400 shadow-2xl text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 text-amber-400 text-[11px] font-black uppercase tracking-widest">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Estabelecimento Verificado PULSO</span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentEst.name}
                </h2>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  {currentEst.categoryName} • {currentEst.cityName}/{currentEst.cityState}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 inline-block mx-auto">
                {/* QR Code Escaneável apontando para a vitrine individual */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(
                    typeof window !== 'undefined'
                      ? `${window.location.origin}/guia/${currentEst.slug}`
                      : `https://pulsorede.com.br/guia/${currentEst.slug}`
                  )}`}
                  alt={`QR Code ${currentEst.name}`}
                  width={220}
                  height={220}
                  className="mx-auto rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-black text-slate-900">
                  Aponte a câmera do seu celular!
                </p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Acesse nosso WhatsApp oficial em 1 clique, confira nossas ofertas e ouça a
                  Rádio Digital PULSO.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500">
                <span>⚡ PULSO — Rede de Comunicação Local</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Solicitação de Spot */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0f17] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                Solicitar Novo Spot para a Rádio Digital
              </h3>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {reqState?.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {reqState.error}
              </div>
            )}

            <form action={reqAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Estabelecimento *
                </label>
                <select
                  name="establishmentId"
                  defaultValue={currentEst?.id}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                >
                  {establishments.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Título da Campanha ou Promoção *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ex: Queima de Estoque de Fim de Semana"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Roteiro / Texto ou Informações da Oferta *
                </label>
                <textarea
                  name="scriptNotes"
                  rows={4}
                  required
                  placeholder="Informe o que deve ser falado no spot: produtos em destaque, preços, telefone/WhatsApp e endereço..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Faixa de Horário Preferencial (Opcional)
                </label>
                <input
                  type="text"
                  name="preferredTimeSlot"
                  placeholder="Ex: Manhã (08h às 11h) e Tarde (16h às 18h)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07090e] border border-white/10 text-sm text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isReqPending}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] text-xs font-bold text-white cursor-pointer"
                >
                  {isReqPending ? 'Enviando...' : 'Enviar Solicitação à Rádio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
