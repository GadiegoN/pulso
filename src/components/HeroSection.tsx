"use client";

import React from "react";
import {
  ArrowRight,
  Radio,
  MessageSquare,
  Globe,
  Share2,
  Zap,
  MapPin,
  Sparkles,
  CheckCircle2,
  Activity,
  Layers,
  Volume2
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden vice-grid-bg">
      {/* GTA 6 Ambient Lighting Blooms */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] md:w-[900px] md:h-[500px] bg-gradient-to-tr from-[#ff2a85]/20 via-[#ff7300]/15 to-[#00f0ff]/20 blur-3xl opacity-60 dark:opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-40 w-96 h-96 bg-[#ff2a85]/15 blur-[120px] rounded-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-40 w-96 h-96 bg-[#00f0ff]/15 blur-[120px] rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8">

            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#ff2a85] animate-ping" />
              <span className="text-xs font-semibold tracking-wide text-slate-800 dark:text-slate-200">
                PULSO • NOVA GERAÇÃO EM COMUNICAÇÃO LOCAL
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.12]">
              A comunicação da sua cidade está{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#0284c7] dark:from-[#ff2a85] dark:via-[#ff7300] dark:to-[#00f0ff]">
                evoluindo.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              <strong className="font-semibold text-slate-900 dark:text-white">Uma mensagem. Vários canais. Toda a cidade conectada.</strong>{" "}
              Uma nova maneira de integrar empresas, comércio e pessoas. Mais alcance para quem comunica, mais informação para quem vive a cidade.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#contato"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#ff2a85] to-[#ff7300] shadow-lg shadow-[#ff2a85]/30 hover:shadow-[#ff2a85]/50 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Quero conhecer o projeto</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#como-funciona"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/30 backdrop-blur-md transition-all cursor-pointer"
              >
                <span>Como funciona?</span>
              </a>
            </div>

            {/* Value Indicators */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="space-y-1">
                <div className="text-2xl font-black text-slate-900 dark:text-white">100%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Digital & Integrado</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] to-[#ff7300]">Multi</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Canais de Difusão</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-[#0284c7] dark:text-[#00f0ff]">Pulso</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">No Ritmo da Cidade</div>
              </div>
            </div>

          </div>

          {/* Right Column: Custom Graphic Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Central Glowing Card Container */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-[#ff2a85] via-[#ff7300] to-[#00f0ff] shadow-2xl shadow-[#ff2a85]/20 dark:shadow-[#00f0ff]/10">
                <div className="rounded-[22px] bg-slate-900 text-white p-6 sm:p-7 relative overflow-hidden">

                  {/* Subtle Vice City Palm / Grid Silhouette in BG */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ff2a85_1px,transparent_1px)] [background-size:16px_16px]"
                  />

                  {/* Header of the Simulation */}
                  <div className="relative flex items-center justify-between pb-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff2a85] to-[#ff7300] flex items-center justify-center text-white">
                        <Activity className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-sm font-bold tracking-wide">PULSO HUB</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Rede Ativa em Fase Piloto
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white/10 text-cyan-300 border border-cyan-400/20">
                      LIVE FREQ
                    </span>
                  </div>

                  {/* Simulated Channels Showcase */}
                  <div className="relative mt-5 space-y-3.5">

                    {/* Simulated Stream 1: Digital Radio */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#ff2a85]/50 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-[#ff2a85]" />
                          <span className="font-semibold text-slate-200">Pulso Rádio Web</span>
                        </div>
                        <span className="text-[10px] text-pink-400 font-mono font-bold">STREAM AO VIVO</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-slate-400 truncate">
                          Programação de áudio contínua e spots comerciais
                        </div>
                        {/* Animated Sound Wave Bars */}
                        <div className="flex items-end gap-1 h-5">
                          <span className="w-1 bg-[#ff2a85] h-2 rounded-full animate-pulse" />
                          <span className="w-1 bg-[#ff7300] h-5 rounded-full animate-pulse delay-75" />
                          <span className="w-1 bg-[#00f0ff] h-3 rounded-full animate-pulse delay-150" />
                          <span className="w-1 bg-[#ff2a85] h-4 rounded-full animate-pulse delay-100" />
                        </div>
                      </div>
                    </div>

                    {/* Simulated Stream 2: WhatsApp VIP Channel */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-slate-200">Distribuição via WhatsApp</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">INSCRITOS</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Comunicados e ofertas direto no celular das pessoas cadastradas.
                      </p>
                    </div>

                    {/* Simulated Stream 3: Local Portal */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00f0ff]/50 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-[#00f0ff]" />
                          <span className="font-semibold text-slate-200">Portal & Vitrine da Cidade</span>
                        </div>
                        <span className="text-[10px] text-[#00f0ff] font-bold">CENTRALIZADO</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Um único endereço para conferir o que acontece na região.
                      </p>
                    </div>

                  </div>

                  {/* Flow footer indicator */}
                  <div className="relative mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#ff7300]" />
                      Conectando marcas e comunidade
                    </span>
                    <span className="font-semibold text-slate-200">Sem poluição sonora</span>
                  </div>

                </div>
              </div>

              {/* Floating Badge Bottom Left */}
              <div className="absolute -bottom-12 -left-4 sm:-left-6 p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#121427] border border-slate-200 dark:border-white/15 shadow-xl flex items-center gap-3 backdrop-blur-lg">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Mais Organização</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Para o comércio e a cidade</div>
                </div>
              </div>

              {/* Floating Badge Top Right */}
              <div className="hidden sm:flex absolute -top-5 -right-4 p-3 rounded-2xl bg-white dark:bg-[#121427] border border-slate-200 dark:border-white/15 shadow-xl items-center gap-2.5 backdrop-blur-lg">
                <Zap className="w-4 h-4 text-[#ff7300]" />
                <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
                  Visão Multicanal
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
