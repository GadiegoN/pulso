"use client";

import React from "react";
import {
  Radio,
  MessageSquare,
  Globe,
  Share2,
  Volume2,
  Send,
  Search,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Compass
} from "lucide-react";

export function SolutionSection() {
  const channels = [
    {
      id: "radio",
      icon: Radio,
      title: "Rádio Digital pela Internet",
      subtitle: "Áudio & Publicidade Contínua",
      description:
        "Programação musical, notícias da cidade e spots comerciais transmitidos online. Sintonizável no celular, no trânsito, em estabelecimentos e residências sem ruído nas ruas.",
      badge: "Módulo Ativo • Ao Vivo",
      gradient: "from-[#ff2a85] to-[#ff7300]",
      visualPreview: (
        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 text-white text-xs border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-pink-400 font-mono">
            <span>STREAM DIGITAL LOCAL</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              HQ AUDIO
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#ff2a85] shrink-0" />
            <div className="truncate text-slate-300 font-medium">Spot Comercial: Supermercado Local</div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] h-full w-2/3 rounded-full" />
          </div>
        </div>
      ),
    },
    {
      id: "whatsapp",
      icon: MessageSquare,
      title: "Distribuição pelo WhatsApp",
      subtitle: "Mensagens para Inscritos",
      description:
        "Envio estruturado e autorizado de comunicados, promoções do dia e avisos de utilidade pública diretamente para os moradores que optaram por se inscrever.",
      badge: "Módulo Ativo • Grupos",
      gradient: "from-emerald-500 to-teal-500",
      visualPreview: (
        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 text-white text-xs border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono">
            <span>CANAL OFICIAL WHATSAPP</span>
            <span>VERIFICADO</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-slate-200">
            <p className="text-[11px] leading-relaxed">
              🔔 <strong>Aviso da Semana:</strong> Festival gastronômico no centro da cidade com atrações e promoções exclusivas.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "portal",
      icon: Globe,
      title: "Portal de Informações Local",
      subtitle: "Centralizador Digital",
      description:
        "Um endereço virtual único para a cidade: guia comercial, catálogo de serviços, notícias locais, horários de plantão e classificados organizados.",
      badge: "Módulo Ativo • Guia & Mural",
      gradient: "from-[#0284c7] to-[#00f0ff]",
      visualPreview: (
        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 text-white text-xs border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono">
            <span>PORTAL REGIONAL</span>
            <Search className="w-3.5 h-3.5" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="p-1.5 rounded bg-white/5 border border-white/10 text-center text-slate-300">
              Guia de Empresas
            </div>
            <div className="p-1.5 rounded bg-white/5 border border-white/10 text-center text-slate-300">
              Agenda da Cidade
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "social",
      icon: Share2,
      title: "Redes Sociais Estruturadas",
      subtitle: "Presença Digital Padronizada",
      description:
        "Criação e curadoria de conteúdos audiovisuais adaptados para Instagram, TikTok e Facebook, garantindo que as empresas locais transmitam profissionalismo.",
      badge: "Módulo em Planejamento",
      gradient: "from-purple-500 to-pink-500",
      visualPreview: (
        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 text-white text-xs border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-purple-400 font-mono">
            <span>FORMATO MULTI-PLATAFORMA</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center justify-around py-1 text-slate-300 text-[10px] font-medium">
            <span className="px-2 py-0.5 rounded bg-white/5">Stories & Reels</span>
            <span className="px-2 py-0.5 rounded bg-white/5">Artes Digitais</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="solucao" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Compass className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#00f0ff]" />
            <span>ARQUITETURA DO PROJETO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Uma rede.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#0284c7] dark:from-[#ff2a85] dark:via-[#ff7300] dark:to-[#00f0ff]">
              Diferentes formas
            </span>{" "}
            de comunicar.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            A visão da rede PULSO é centralizar a veiculação de campanhas, ofertas, eventos e comunicados através de múltiplos canais digitais perfeitamente conectados.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <div
                key={ch.id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#121427] border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-2xl hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-[#ff2a85] dark:text-[#00f0ff]" />
                    </div>
                    <span className="text-[10px] font-semibold font-mono tracking-tight px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                      {ch.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#ff2a85] dark:group-hover:text-[#00f0ff] transition-colors">
                    {ch.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-3">
                    {ch.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {ch.description}
                  </p>
                </div>

                {/* Visual Simulation Preview */}
                <div className="pt-3">
                  {ch.visualPreview}
                </div>
              </div>
            );
          })}
        </div>

        {/* Vision disclaimer note */}
        <div className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Transparência:</strong> Estes canais compõem o escopo de desenvolvimento planejado para a rede PULSO, introduzidos gradualmente conforme a validação com a comunidade local.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}
