'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  ShieldAlert,
  Store,
  Newspaper,
  MessageCircle,
  Users,
  ExternalLink,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  Radio,
} from 'lucide-react';

interface BroadcastItem {
  id: string;
  category: 'public_utility' | 'civic_alert' | 'partner_offer' | 'local_news';
  title: string;
  messageBody: string;
  ctaUrl: string | null;
  dispatchedAt: Date;
  cityName: string | null;
  cityState: string | null;
  channelName: string | null;
  establishmentName: string | null;
  establishmentWhatsapp: string | null;
}

interface ChannelItem {
  id: string;
  name: string;
  neighborhoodOrScope: string;
  inviteLink: string | null;
  memberCount: number;
  cityName: string | null;
  cityState: string | null;
}

interface Props {
  broadcasts: BroadcastItem[];
  channels: ChannelItem[];
}

const CATEGORY_CONFIG: Record<
  string,
  {
    label: string;
    badgeClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  public_utility: {
    label: 'Utilidade Pública',
    badgeClass:
      'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30',
    icon: Megaphone,
  },
  civic_alert: {
    label: 'Alerta da Cidade',
    badgeClass:
      'bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/30',
    icon: ShieldAlert,
  },
  partner_offer: {
    label: 'Destaque Comercial',
    badgeClass:
      'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30',
    icon: Store,
  },
  local_news: {
    label: 'Informe Comunitário',
    badgeClass:
      'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30',
    icon: Newspaper,
  },
};

export default function MuralClientView({ broadcasts, channels }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((b) => {
      const matchesCat =
        selectedCategory === 'all' || b.category === selectedCategory;
      const matchesSearch =
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.messageBody.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.establishmentName &&
          b.establishmentName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [broadcasts, selectedCategory, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      {/* Cabeçalho do Mural */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Transmissão Oficial • Conquista - MG
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
          Mural da Cidade &{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#00f0ff]">
            Comunicados Oficiais
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
          Acompanhe avisos de utilidade pública, alertas comunitários, novidades do comércio
          local e participe dos grupos verificados do seu bairro no WhatsApp.
        </p>
      </div>

      {/* Seção 1: Grupos Oficiais de WhatsApp da Cidade */}
      {channels.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 block mb-1">
                Canais Verificados PULSO
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Grupos Comunitários & Listas de Transmissão no WhatsApp
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Receba alertas da cidade e ofertas verificadas diretamente no seu celular
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {ch.neighborhoodOrScope}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      {ch.memberCount} moradores
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {ch.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {ch.cityName || 'Conquista'} - {ch.cityState || 'MG'}
                  </p>
                </div>

                {ch.inviteLink ? (
                  <a
                    href={ch.inviteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Entrar no Grupo Oficial</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                ) : (
                  <Link
                    href="/#contato"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Solicitar Inclusão na Lista</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seção 2: Filtro & Busca de Comunicados */}
      <div className="space-y-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar comunicados, alertas ou parceiros..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:justify-center">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#ff2a85] to-[#7928ca] text-white shadow-md shadow-[#ff2a85]/20'
                : 'bg-white dark:bg-[#0c0f17] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10'
            }`}
          >
            Todos os Comunicados ({broadcasts.length})
          </button>

          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
            const count = broadcasts.filter((b) => b.category === key).length;
            const isSelected = selectedCategory === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#ff2a85] to-[#7928ca] text-white shadow-md shadow-[#ff2a85]/20'
                    : 'bg-white dark:bg-[#0c0f17] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                }`}
              >
                {cfg.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed de Comunicados */}
      {filteredBroadcasts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBroadcasts.map((item) => {
            const cfg =
              CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.public_utility;
            const IconComponent = cfg.icon;
            const cleanPhone = item.establishmentWhatsapp
              ? item.establishmentWhatsapp.replace(/\D/g, '')
              : '';

            return (
              <article
                key={item.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cfg.badgeClass}`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(item.dispatchedAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  {item.establishmentName && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300 text-xs font-semibold">
                      <Store className="w-3.5 h-3.5" />
                      <span>Parceiro: {item.establishmentName}</span>
                    </div>
                  )}

                  <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {item.messageBody}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    📍 {item.cityName || 'Conquista'} - {item.cityState || 'MG'}
                  </span>

                  <div className="flex items-center gap-2">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                          `Olá! Vi o comunicado "${item.title}" no Mural da rede PULSO.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Falar no WhatsApp</span>
                      </a>
                    )}

                    {item.ctaUrl && (
                      <a
                        href={item.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <span>Acessar Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 mx-auto flex items-center justify-center mb-4">
            <Radio className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Nenhum comunicado publicado nesta categoria ainda
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Os comunicados oficiais de utilidade pública, alertas da cidade e campanhas de
            parceiros aparecem aqui assim que disparados pela Central PULSO.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guia"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-bold hover:opacity-90 transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Explorar Guia Comercial</span>
            </Link>
            <Link
              href="/#contato"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#7928ca] text-white text-xs font-bold shadow-lg shadow-[#ff2a85]/30 hover:opacity-90 transition-all"
            >
              <span>Divulgar no PULSO</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
