"use client";

import React from "react";
import { 
  Building, 
  Network, 
  HeartHandshake, 
  Radio, 
  Leaf, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp,
  Activity
} from "lucide-react";

export function VisionSection() {
  const pillars = [
    {
      icon: Network,
      title: "Infraestrutura Integrada",
      description:
        "Conectar canais complementares sob uma mesma coordenação operacional, permitindo que a divulgação local tenha consistência técnica, estética e estratégica.",
    },
    {
      icon: Leaf,
      title: "Sustentabilidade Urbana e Sonora",
      description:
        "Proporcionar alternativas modernas que reduzam a poluição acústica nos bairros e centros comerciais, respeitando o sossego da população e gerando comunicação com consentimento.",
    },
    {
      icon: HeartHandshake,
      title: "Fortalecimento da Economia Local",
      description:
        "Garantir que os recursos investidos em publicidade circulem dentro do próprio município, impulsionando os negócios de bairro e a sensação de identidade comunitária.",
    },
  ];

  return (
    <section id="visao" className="py-24 bg-slate-50/80 dark:bg-[#0a0c1c]/80 border-y border-slate-200/80 dark:border-white/5 relative overflow-hidden">
      
      {/* Subtle Glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-20 right-10 w-96 h-96 bg-[#ff2a85]/10 blur-[130px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Activity className="w-3.5 h-3.5 text-[#ff7300]" />
            <span>VISÃO INSTITUCIONAL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Uma nova infraestrutura para a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#0284c7] dark:from-[#ff2a85] dark:via-[#ff7300] dark:to-[#00f0ff]">
              comunicação das cidades.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            A proposta da Rede PULSO é construir uma base tecnológica que torne a comunicação local mais acessível, organizada e conectada, unindo a força do comércio à vida cotidiana dos moradores.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="relative p-8 rounded-2xl bg-white dark:bg-[#121428] border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white mb-6">
                    <Icon className="w-6 h-6 text-[#ff2a85] dark:text-[#00f0ff]" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Compromisso com a cidade</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manifesto Banner */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-[#10132b] to-slate-900 text-white relative overflow-hidden border border-white/10 shadow-2xl">
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-[#ff2a85]/30 to-[#00f0ff]/20 blur-3xl rounded-full" 
          />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              MANIFESTO DA REDE PULSO
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
              Cidades modernas pedem conexões reais e humanas.
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              O futuro da comunicação local não está na imposição sonora ou no ruído desenfreado, mas na relevância, no fácil acesso e no respeito mútuo entre comerciantes e moradores. A Rede PULSO foi desenhada para fazer a cidade pulsar no mesmo ritmo de quem produz, consome e vive cada bairro todos os dias.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
