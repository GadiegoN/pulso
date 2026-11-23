'use client';

import React, { useState, useActionState, useTransition } from 'react';
import {
  createSpotAction,
  toggleSpotStatusAction,
  deleteSpotAction,
  createScheduleAction,
  toggleScheduleStatusAction,
  deleteScheduleAction,
  createCityAction,
  type RadioActionState,
} from '@/lib/radio/actions';
import { updateSpotRequestStatusAction } from '@/lib/portal/actions';
import {
  Radio,
  Music,
  Calendar,
  Plus,
  Play,
  Upload,
  Clock,
  MapPin,
  Store,
  Trash2,
  CheckCircle,
  AlertCircle,
  Volume2,
  ListMusic,
} from 'lucide-react';

const initialActionState: RadioActionState = {};

interface Props {
  spots: any[];
  schedules: any[];
  cities: any[];
  establishments: any[];
  spotRequests?: any[];
}

export default function RadioManagerView({
  spots,
  schedules,
  cities,
  establishments,
  spotRequests = [],
}: Props) {
  const [activeTab, setActiveTab] = useState<'spots' | 'schedules' | 'requests'>('spots');
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [spotState, spotFormAction, isSpotPending] = useActionState(
    createSpotAction,
    initialActionState
  );

  const [scheduleState, scheduleFormAction, isSchedulePending] = useActionState(
    createScheduleAction,
    initialActionState
  );

  const [isPending, startTransition] = useTransition();

  // Fechar modais automaticamente se ação foi bem sucedida
  if (spotState?.success && showSpotModal) {
    setShowSpotModal(false);
    spotState.success = false;
  }

  if (scheduleState?.success && showScheduleModal) {
    setShowScheduleModal(false);
    scheduleState.success = false;
  }

  return (
    <div className="space-y-6">
      {/* Barra de Status e Ações */}
      <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Transmissão da Rádio Digital</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                No Ar
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {spots.length} spots cadastrados • {schedules.length} horários agendados na grade
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {cities.length === 0 && (
            <button
              type="button"
              onClick={() => setShowCityModal(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Cadastrar Cidade</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowSpotModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] text-white text-xs font-semibold shadow-[0_0_15px_rgba(255,51,102,0.3)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Spot Comercial</span>
          </button>

          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            disabled={spots.length === 0 || cities.length === 0}
            className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar na Grade</span>
          </button>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('spots')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'spots'
              ? 'border-[#ff3366] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Spots & Vinhetas ({spots.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schedules')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'schedules'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Grade Semanal de Transmissão ({schedules.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'requests'
              ? 'border-amber-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Pedidos do Portal do Comerciante ({spotRequests.length})</span>
        </button>
      </div>

      {/* ABA 1: SPOTS COMERCIAIS */}
      {activeTab === 'spots' && (
        <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-[#ff3366]" />
                <span>Biblioteca de Áudio da Rádio</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Áudios armazenados no Supabase Storage prontos para execução na frequência local
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Total: {spots.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-3 font-semibold">Título do Spot / Vinheta</th>
                  <th className="px-6 py-3 font-semibold">Anunciante</th>
                  <th className="px-6 py-3 font-semibold">Duração</th>
                  <th className="px-6 py-3 font-semibold">Pré-escuta</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {spots.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Nenhum spot cadastrado até o momento. Clique em "Novo Spot Comercial" para fazer o upload do primeiro áudio.
                    </td>
                  </tr>
                ) : (
                  spots.map((spot) => (
                    <tr key={spot.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5 font-semibold text-white">
                        {spot.title}
                      </td>

                      <td className="px-6 py-3.5 text-slate-400">
                        {spot.establishmentName ? (
                          <span className="flex items-center gap-1.5 text-cyan-300">
                            <Store className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{spot.establishmentName}</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Vinheta Institucional PULSO</span>
                        )}
                      </td>

                      <td className="px-6 py-3.5 font-mono text-slate-400">
                        {spot.durationSeconds}s
                      </td>

                      <td className="px-6 py-3.5">
                        <audio
                          controls
                          src={spot.audioUrl}
                          className="h-8 max-w-[220px] rounded-lg"
                        />
                      </td>

                      <td className="px-6 py-3.5">
                        <button
                          type="button"
                          onClick={() => toggleSpotStatusAction(spot.id, !spot.isActive)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            spot.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}
                        >
                          {spot.isActive ? 'Ativo' : 'Pausado'}
                        </button>
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remover spot "${spot.title}" e desprogramar seus horários?`)) {
                              deleteSpotAction(spot.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                          title="Excluir spot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: GRADE SEMANAL DE TRANSMISSÃO */}
      {activeTab === 'schedules' && (
        <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Grade de Disparos da Programação</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Horários automáticos em que os spots serão veiculados no streaming da cidade
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Total: {schedules.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-3 font-semibold">Horário de Veiculação</th>
                  <th className="px-6 py-3 font-semibold">Spot Programado</th>
                  <th className="px-6 py-3 font-semibold">Cidade / Praça</th>
                  <th className="px-6 py-3 font-semibold">Dias da Semana</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Nenhum horário agendado. Clique em "Agendar na Grade" para programar a transmissão de um spot.
                    </td>
                  </tr>
                ) : (
                  schedules.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5 font-mono text-base font-bold text-white">
                        {item.scheduledTime}
                      </td>

                      <td className="px-6 py-3.5 font-semibold text-purple-300">
                        {item.spotTitle || 'Spot Removido'}
                      </td>

                      <td className="px-6 py-3.5 text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.cityName ? `${item.cityName} - ${item.cityState}` : 'Todas as Cidades'}</span>
                      </td>

                      <td className="px-6 py-3.5 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[11px]">
                          {item.daysOfWeek === '1,2,3,4,5'
                            ? 'Segunda a Sexta'
                            : item.daysOfWeek === '6,0'
                            ? 'Finais de Semana'
                            : item.daysOfWeek === 'todos'
                            ? 'Todos os Dias'
                            : item.daysOfWeek}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <button
                          type="button"
                          onClick={() => toggleScheduleStatusAction(item.id, !item.isActive)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            item.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}
                        >
                          {item.isActive ? 'Ativo' : 'Pausado'}
                        </button>
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Remover este horário agendado da grade de transmissão?')) {
                              deleteScheduleAction(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                          title="Excluir agendamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: PEDIDOS DE SPOTS DO PORTAL DO COMERCIANTE */}
      {activeTab === 'requests' && (
        <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-400" />
                <span>Solicitações de Gravação e Veiculação de Comerciantes</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Roteiros e briefings enviados pelos comerciantes parceiros através do /portal
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Total: {spotRequests.length}
            </span>
          </div>

          {spotRequests.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              Nenhuma solicitação de spot pendente enviada pelo Portal do Comerciante até o momento.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {spotRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-white/[0.02]"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {req.establishmentName || 'Comércio Parceiro'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {req.merchantEmail}
                      </span>
                      {req.preferredTimeSlot && (
                        <span className="text-xs text-purple-300 font-mono">
                          • Faixa: {req.preferredTimeSlot}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{req.title}</h4>
                    <p className="text-xs text-slate-300 whitespace-pre-line bg-black/30 p-3 rounded-xl border border-white/5">
                      {req.scriptNotes}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateSpotRequestStatusAction(req.id, 'approved')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                        req.status === 'approved'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Em Gravação
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSpotRequestStatusAction(req.id, 'produced')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                        req.status === 'produced'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      No Ar
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSpotRequestStatusAction(req.id, 'rejected')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                        req.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-red-500/10'
                      }`}
                    >
                      Revisar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: CADASTRAR NOVO SPOT */}
      {showSpotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d1017] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-[#ff3366]" />
                <span>Novo Spot Comercial / Vinheta</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSpotModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            {spotState?.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{spotState.error}</span>
              </div>
            )}

            <form action={spotFormAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Título do Spot Comercial *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ex: Comercial Padaria Central - Ofertas da Manhã"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3366]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Estabelecimento Anunciante (Opcional)
                </label>
                <select
                  name="establishmentId"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff3366]"
                >
                  <option value="">Nenhum (Vinheta Institucional PULSO)</option>
                  {establishments.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Duração Estimada (Segundos) *
                  </label>
                  <input
                    type="number"
                    name="durationSeconds"
                    defaultValue={30}
                    min={1}
                    max={300}
                    required
                    className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#ff3366]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Upload de Áudio (.mp3, .wav)
                  </label>
                  <input
                    type="file"
                    name="audioFile"
                    accept="audio/*"
                    className="w-full text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-white/10 file:text-white file:text-xs hover:file:bg-white/20 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Ou URL Direta de Áudio
                </label>
                <input
                  type="url"
                  name="audioUrl"
                  placeholder="https://..."
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#ff3366]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSpotModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSpotPending}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] text-white font-semibold shadow-[0_0_15px_rgba(255,51,102,0.3)] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSpotPending ? 'Enviando áudio...' : 'Cadastrar Spot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AGENDAR NA GRADE */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d1017] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>Programar Horário na Grade</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            {scheduleState?.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{scheduleState.error}</span>
              </div>
            )}

            <form action={scheduleFormAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Spot Comercial Selecionado *
                </label>
                <select
                  name="spotId"
                  required
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">Selecione um spot...</option>
                  {spots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.durationSeconds}s)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Praça / Cidade de Transmissão *
                </label>
                <select
                  name="cityId"
                  required
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">Selecione uma cidade...</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Horário de Disparo (HH:mm) *
                  </label>
                  <input
                    type="time"
                    name="scheduledTime"
                    required
                    defaultValue="12:00"
                    className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Frequência Semanal *
                  </label>
                  <select
                    name="daysOfWeek"
                    required
                    className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="todos">Todos os Dias</option>
                    <option value="1,2,3,4,5">Segunda a Sexta-Feira</option>
                    <option value="6,0">Fins de Semana (Sáb/Dom)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSchedulePending}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSchedulePending ? 'Agendando...' : 'Confirmar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CADASTRAR CIDADE RÁPIDA */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0d1017] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Cadastrar Cidade</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCityModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              action={async (formData) => {
                await createCityAction(formData);
                setShowCityModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome da Cidade *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Conquista"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estado (UF) *</label>
                <input
                  type="text"
                  name="state"
                  required
                  maxLength={2}
                  defaultValue="MG"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2 text-white uppercase focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCityModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition-all"
                >
                  Salvar Cidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
