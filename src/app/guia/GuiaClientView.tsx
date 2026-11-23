'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { recordWhatsappClickAction } from '@/lib/commerce/actions';
import {
  Search,
  Store,
  MapPin,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  Radio,
  CheckCircle2,
  Star,
} from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
  slug: string;
  whatsapp: string | null;
  address: string | null;
  description: string | null;
  isFeatured?: boolean;
  cityName: string;
  cityState: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface Props {
  initialCategories: Category[];
  establishments: Establishment[];
}

export default function GuiaClientView({
  initialCategories,
  establishments,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEstablishments = useMemo(() => {
    return establishments.filter((est) => {
      const matchesCategory =
        selectedCategory === 'all' || est.categoryId === selectedCategory;
      const matchesSearch =
        est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (est.description &&
          est.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (est.address &&
          est.address.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [establishments, selectedCategory, searchTerm]);

  // Contagem por categoria
  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    establishments.forEach((e) => {
      map[e.categoryId] = (map[e.categoryId] || 0) + 1;
    });
    return map;
  }, [establishments]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header do Guia */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Conquista - MG em Tempo Real
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
          Guia Comercial &{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#00f0ff]">
            Parceiros Locais
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
          Conecte-se diretamente com o comércio, serviços e empresas de Conquista.
          Clique e converse diretamente no WhatsApp oficial de cada parceiro.
        </p>
      </div>

      {/* Barra de Busca & Filtros */}
      <div className="space-y-6 mb-10">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, produto, serviço ou endereço..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Pílulas de Categorias */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#ff2a85] to-[#7928ca] text-white shadow-md shadow-[#ff2a85]/20'
                : 'bg-white dark:bg-[#0c0f17] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todas as Categorias ({establishments.length})
          </button>

          {initialCategories.map((cat) => {
            const count = countsByCategory[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#ff2a85] to-[#7928ca] text-white shadow-md shadow-[#ff2a85]/20'
                    : 'bg-white dark:bg-[#0c0f17] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Estabelecimentos */}
      {filteredEstablishments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEstablishments.map((est) => {
            const cleanPhone = est.whatsapp ? est.whatsapp.replace(/\D/g, '') : '';
            const waUrl = cleanPhone
              ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                  `Olá! Encontrei o(a) ${est.name} pelo Guia Comercial da rede PULSO e gostaria de mais informações.`
                )}`
              : null;

            return (
              <div
                key={est.id}
                className={`group p-6 rounded-2xl bg-white dark:bg-[#0c0f17] border transition-all flex flex-col justify-between relative overflow-hidden ${
                  est.isFeatured
                    ? 'border-amber-400/70 dark:border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                    : 'border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#ff2a85]/40'
                }`}
              >
                <div>
                  {est.isFeatured && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-600 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>Parceiro Âncora Oficial</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-semibold">
                      {est.categoryName}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Atendimento Ativo
                    </span>
                  </div>

                  <Link href={`/guia/${est.slug}`}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#ff2a85] transition-colors">
                      {est.name}
                    </h3>
                  </Link>

                  {est.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                      {est.description}
                    </p>
                  )}

                  {est.address && (
                    <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                      <span>{est.address} — {est.cityName}/{est.cityState}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2">
                  {waUrl ? (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        recordWhatsappClickAction(est.id);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chamar no WhatsApp Oficial</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  ) : (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 text-xs text-center font-medium">
                      WhatsApp em cadastramento
                    </div>
                  )}

                  <Link
                    href={`/guia/${est.slug}`}
                    className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Ver Vitrine, Áudios & Ofertas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mx-auto flex items-center justify-center mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Nenhum comércio cadastrado nesta busca
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Você é comerciante ou prestador de serviço em Conquista - MG? Integre sua
            empresa ao PULSO para divulgar seus produtos na rádio digital e no catálogo.
          </p>
          <Link
            href="/#contato"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#7928ca] text-white text-xs font-bold shadow-lg shadow-[#ff2a85]/30 hover:opacity-90 transition-all"
          >
            <span>Cadastrar Meu Comércio no PULSO</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Banner de Engajamento para Comerciantes */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[#0e121e] to-[#161a29] border border-white/10 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-[#ff2a85]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#00f0ff] font-bold block mb-1">
              Divulgação Inteligente
            </span>
            <h2 className="text-2xl font-black mb-2">
              Sua empresa no centro da comunicação da cidade
            </h2>
            <p className="text-sm text-slate-300">
              Anuncie na rádio digital, apareça em destaque no guia local e receba
              pedidos e contatos diretamente no seu WhatsApp sem intermediários.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/#contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#ff7300] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff2a85]/30 hover:scale-105 transition-all"
            >
              <span>Quero Conhecer os Planos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
