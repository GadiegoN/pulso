'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { recordWhatsappClickAction } from '@/lib/commerce/actions';
import {
  Store,
  MapPin,
  MessageCircle,
  ExternalLink,
  Star,
  Radio,
  Megaphone,
  ArrowLeft,
  Share2,
  Check,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface Props {
  establishment: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    whatsapp: string | null;
    address: string | null;
    isFeatured: boolean;
    cityName: string;
    cityState: string;
    categoryName: string;
  };
  spots: {
    id: string;
    title: string;
    audioUrl: string;
    durationSeconds: number;
    createdAt: Date;
  }[];
  broadcasts: {
    id: string;
    title: string;
    messageBody: string;
    ctaUrl: string | null;
    dispatchedAt: Date;
  }[];
}

export default function EstablishmentShowcaseClient({
  establishment,
  spots,
  broadcasts,
}: Props) {
  const [copied, setCopied] = useState(false);

  const cleanPhone = establishment.whatsapp
    ? establishment.whatsapp.replace(/\D/g, '')
    : '';
  const waUrl = cleanPhone
    ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
        `Olá! Acessei a Vitrine Oficial de ${establishment.name} na Rede PULSO e gostaria de atendimento.`
      )}`
    : null;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${establishment.name} | Guia PULSO ${establishment.cityName}`,
          text:
            establishment.description ||
            `Confira a vitrine e o WhatsApp oficial de ${establishment.name} no PULSO!`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback para copiar link
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Topo / Voltar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/guia"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#ff2a85] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o Guia Comercial de {establishment.cityName}</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:border-[#ff2a85] transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Link da Vitrine Copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>Compartilhar Vitrine</span>
            </>
          )}
        </button>
      </div>

      {/* Hero da Vitrine do Comércio */}
      <div
        className={`p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0f17] border shadow-xl relative overflow-hidden ${
          establishment.isFeatured
            ? 'border-amber-400/70 dark:border-amber-400/50'
            : 'border-slate-200 dark:border-white/10'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {establishment.isFeatured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-600 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Parceiro Âncora Oficial</span>
                </span>
              )}

              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold">
                {establishment.categoryName}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Estabelecimento Verificado PULSO</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {establishment.name}
            </h1>

            {establishment.description ? (
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {establishment.description}
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Parceiro oficial integrante da Rede de Comunicação Local PULSO em{' '}
                {establishment.cityName} - {establishment.cityState}.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#ff2a85]" />
                <span>
                  {establishment.address
                    ? `${establishment.address} — ${establishment.cityName}/${establishment.cityState}`
                    : `${establishment.cityName} - ${establishment.cityState}`}
                </span>
              </div>
            </div>
          </div>

          {/* Bloco de Ação Direta WhatsApp */}
          <div className="w-full md:w-72 shrink-0 p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Atendimento Direto</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Fale diretamente com a equipe de <strong>{establishment.name}</strong> sem
              intermediários.
            </p>

            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordWhatsappClickAction(establishment.id)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chamar no WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            ) : (
              <div className="w-full py-3 px-4 rounded-xl bg-slate-200 dark:bg-white/5 text-slate-500 text-xs text-center font-semibold">
                WhatsApp em atualização
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Inferior: Spots na Rádio Digital & Comunicados no Mural */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna 1: Spots de Áudio na Rádio Digital */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Spots e Anúncios na Rádio PULSO
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ouça as chamadas em áudio deste parceiro na programação local
              </p>
            </div>
          </div>

          {spots.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
              Nenhum spot em áudio publicado no momento para este estabelecimento.
            </div>
          ) : (
            <div className="space-y-3">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {spot.title}
                    </span>
                    <span className="text-[11px] font-mono text-purple-500">
                      {spot.durationSeconds}s
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

        {/* Coluna 2: Comunicados e Ofertas Publicadas no Mural */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Ofertas & Comunicados no Mural
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Últimos informes disparados nos canais oficiais da cidade
              </p>
            </div>
          </div>

          {broadcasts.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
              Nenhum comunicado recente publicado no Mural para este estabelecimento.
            </div>
          ) : (
            <div className="space-y-3">
              {broadcasts.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {b.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(b.dispatchedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line">
                    {b.messageBody}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
