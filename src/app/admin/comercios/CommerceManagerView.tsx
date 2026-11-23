'use client';

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import {
  createEstablishmentAction,
  toggleEstablishmentStatusAction,
  toggleEstablishmentFeaturedAction,
  deleteEstablishmentAction,
  createCategoryAction,
  type CommerceActionState,
} from '@/lib/commerce/actions';
import {
  Store,
  Building2,
  Plus,
  MapPin,
  Phone,
  Tag,
  UserCheck,
  Trash2,
  AlertCircle,
  ExternalLink,
  Layers,
  Star,
} from 'lucide-react';

const initialActionState: CommerceActionState = {};

interface Props {
  establishments: any[];
  categories: any[];
  cities: any[];
  merchants: any[];
}

export default function CommerceManagerView({
  establishments,
  categories,
  cities,
  merchants,
}: Props) {
  const [activeTab, setActiveTab] = useState<'establishments' | 'categories'>('establishments');
  const [showEstModal, setShowEstModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);

  const [estState, estFormAction, isEstPending] = useActionState(
    createEstablishmentAction,
    initialActionState
  );

  const [catState, catFormAction, isCatPending] = useActionState(
    createCategoryAction,
    initialActionState
  );

  if (estState?.success && showEstModal) {
    setShowEstModal(false);
    estState.success = false;
  }

  if (catState?.success && showCatModal) {
    setShowCatModal(false);
    catState.success = false;
  }

  const activeCount = establishments.filter((e) => e.isActive).length;

  return (
    <div className="space-y-6">
      {/* Topo / Status */}
      <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Diretório Comercial Parceiro</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                {activeCount} Ativos
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {establishments.length} estabelecimentos cadastrados • {categories.length} segmentos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCatModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Nova Categoria</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEstModal(true)}
            disabled={cities.length === 0 || categories.length === 0}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Estabelecimento</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('establishments')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'establishments'
              ? 'border-amber-400 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Comércios Cadastrados ({establishments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'border-cyan-400 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Segmentos & Categorias ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: ESTABELECIMENTOS */}
      {activeTab === 'establishments' && (
        <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nome Comercial</th>
                  <th className="px-6 py-3 font-semibold">Categoria</th>
                  <th className="px-6 py-3 font-semibold">Praça / Cidade</th>
                  <th className="px-6 py-3 font-semibold">WhatsApp / Cliques</th>
                  <th className="px-6 py-3 font-semibold">Responsável</th>
                  <th className="px-6 py-3 font-semibold">Plano / Destaque</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {establishments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      Nenhum estabelecimento cadastrado. Clique em "Cadastrar Estabelecimento" para adicionar o primeiro comércio parceiro.
                    </td>
                  </tr>
                ) : (
                  establishments.map((est) => (
                    <tr key={est.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{est.name}</span>
                          <Link
                            href={`/guia/${est.slug}`}
                            target="_blank"
                            className="text-slate-400 hover:text-amber-300 transition-colors"
                            title="Abrir Vitrine Pública Individual"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        {est.description && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{est.description}</div>
                        )}
                        {est.address && (
                          <div className="text-[10px] text-slate-500 truncate max-w-xs">{est.address}</div>
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-medium">
                          {est.categoryName || 'Geral'}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{est.cityName} - {est.cityState}</span>
                        </span>
                      </td>

                      <td className="px-6 py-3.5 font-mono text-emerald-400">
                        {est.whatsapp ? (
                          <div>
                            <a
                              href={`https://wa.me/55${est.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{est.whatsapp}</span>
                            </a>
                            <span className="text-[10px] text-slate-500 block">
                              {est.whatsappClicks || 0} clique(s) no Guia
                            </span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="px-6 py-3.5 text-slate-400">
                        {est.ownerName || est.ownerEmail ? (
                          <span className="flex items-center gap-1 text-[11px] text-slate-300">
                            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>{est.ownerName || est.ownerEmail}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 italic">Não vinculado</span>
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        <button
                          type="button"
                          onClick={() => toggleEstablishmentFeaturedAction(est.id, !est.isFeatured)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 transition-all cursor-pointer ${
                            est.isFeatured
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                              : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                          }`}
                          title="Alternar destaque de Parceiro Âncora no topo do Guia"
                        >
                          <Star className={`w-3 h-3 ${est.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                          <span>{est.isFeatured ? 'Parceiro Âncora' : 'Vitrine Padrão'}</span>
                        </button>
                      </td>

                      <td className="px-6 py-3.5">
                        <button
                          type="button"
                          onClick={() => toggleEstablishmentStatusAction(est.id, !est.isActive)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            est.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          }`}
                        >
                          {est.isActive ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remover "${est.name}" do catálogo de parceiros?`)) {
                              deleteEstablishmentAction(est.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                          title="Excluir estabelecimento"
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

      {/* TAB 2: CATEGORIAS */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl bg-[#0c0f17] border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">/{cat.slug}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: CADASTRAR ESTABELECIMENTO */}
      {showEstModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d1017] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <span>Novo Estabelecimento Parceiro</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEstModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            {estState?.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{estState.error}</span>
              </div>
            )}

            <form action={estFormAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Nome Fantasia / Comercial *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Supermercado Triângulo"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Categoria / Ramo *
                  </label>
                  <select
                    name="categoryId"
                    required
                    className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Selecione...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Cidade de Atuação *
                  </label>
                  <select
                    name="cityId"
                    required
                    className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Selecione...</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name} - {city.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    WhatsApp de Atendimento *
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    required
                    placeholder="(34) 99999-9999"
                    className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                    Comerciante Responsável
                  </label>
                  <select
                    name="ownerId"
                    className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Nenhum (Gestão Central)</option>
                    {merchants.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName || m.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Endereço Físico / Bairro
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Ex: Av. Brasil, 450 - Centro"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1.5">
                  Descrição / Slogan Curto
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Ex: O melhor em carnes selecionadas e hortifruti fresco para sua família."
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  className="rounded accent-amber-400"
                />
                <span className="text-amber-200 font-medium">
                  ⭐ Destacar como <strong>Parceiro Âncora / Patrocinador Master</strong> (Fixado no topo do Guia Comercial)
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEstModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isEstPending}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isEstPending ? 'Cadastrando...' : 'Salvar Estabelecimento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CADASTRAR CATEGORIA */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0d1017] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                <span>Nova Categoria</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {catState?.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {catState.error}
              </div>
            )}

            <form action={catFormAction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome do Segmento *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Óticas & Relojoarias"
                  className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCatPending}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCatPending ? 'Criando...' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
