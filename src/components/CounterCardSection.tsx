"use client";

import React from "react";
import {
  Building2,
  MapPin,
  Users,
  Radio,
  Rocket,
  ArrowRight,
} from "lucide-react";

interface CounterStats {
  citiesCount: number;
  establishmentsCount: number;
  activeChannelsCount: number;
  connectedResidentsCount: number;
}

export function CounterCardSection({ stats }: { stats?: CounterStats }) {
  const citiesCount = stats?.citiesCount ?? 0;
  const establishmentsCount = stats?.establishmentsCount ?? 0;
  const activeChannelsCount = stats?.activeChannelsCount ?? 0;
  const connectedResidentsCount = stats?.connectedResidentsCount ?? 0;

  const metrics = [
    {
      label: "Cidades",
      value: `+${citiesCount}`,
      description: "Primeiros municípios integrados à rede PULSO",
      icon: MapPin,
      badge: citiesCount > 0 ? "Em Operação" : "Pioneirismo",
      gradient: "from-[#ff2a85] to-[#ff7300]",
    },
    {
      label: "Estabelecimentos",
      value: `+${establishmentsCount}`,
      description: "Comércios e parceiros ativos no Guia Local",
      icon: Building2,
      badge: "Inscrições Abertas",
      gradient: "from-[#ff7300] to-[#f59e0b]",
    },
    {
      label: "Canais & Spots Ativos",
      value: `+${activeChannelsCount}`,
      description: "Grupos comunitários e spots de áudio em transmissão",
      icon: Radio,
      badge: "Infraestrutura",
      gradient: "from-[#0284c7] to-[#00f0ff]",
    },
    {
      label: "Moradores Conectados",
      value: `+${connectedResidentsCount}`,
      description: "Comunidade local integrada sem poluição sonora",
      icon: Users,
      badge: "Tempo Real",
      gradient: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <section className="relative py-12 -mt-6 sm:-mt-10 mb-8 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-[#ff2a85]/40 via-[#ff7300]/30 to-[#00f0ff]/40 shadow-2xl backdrop-blur-xl">
          <div className="rounded-[23px] bg-white/90 dark:bg-[#0c0e20]/90 p-6 sm:p-8 md:p-10">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200/80 dark:border-white/10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Rocket className="w-3.5 h-3.5 text-[#ff2a85]" />
                  <span>INDICADORES EM TEMPO REAL • DADOS DO ECOSSISTEMA</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Crescimento transparente em tempo real.
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Transparência total desde o primeiro dia. Os indicadores abaixo refletem diretamente os registros ativos da nossa base de dados.
                </p>
              </div>

              <a
                href="#contato"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#ff2a85] to-[#ff7300] hover:shadow-lg hover:shadow-[#ff2a85]/30 hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer"
              >
                <span>Seja um pioneiro</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Grid of Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="relative p-6 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-[#ff2a85] dark:text-[#00f0ff]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                        {item.badge}
                      </span>
                    </div>

                    {/* Numeric Counter with Neon Gradient */}
                    <div className="flex items-baseline gap-1 mb-1">
                      <span
                        className={`text-4xl sm:text-5xl font-black font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${item.gradient}`}
                      >
                        {item.value}
                      </span>
                    </div>

                    <div className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      {item.label}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status strip */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sincronizado ao vivo com o banco de dados PostgreSQL</span>
              </div>
              <div>
                Primeiras cidades e comércios cadastrados têm destaque na inauguração regional.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
