"use client";

import React from "react";
import { 
  FileEdit, 
  Workflow, 
  RadioTower, 
  Users, 
  ArrowRight, 
  Check, 
  Zap,
  Sparkles
} from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "A empresa prepara sua divulgação",
      description:
        "O anunciante define o objetivo da campanha: promoção semanal, inauguração, evento cultural, oferta de serviços ou comunicado institucional.",
      icon: FileEdit,
      pill: "Etapa Inicial",
      color: "from-[#ff2a85] to-[#ff7300]",
      details: ["Definição da mensagem central", "Material e referências básicas"],
    },
    {
      step: "02",
      title: "A campanha é organizada",
      description:
        "O material é padronizado e formatado adequadamente para cada canal: gravação do spot em áudio profissional, redação clara para o WhatsApp e artes digitais.",
      icon: Workflow,
      pill: "Estruturação",
      color: "from-[#ff7300] to-[#f59e0b]",
      details: ["Adaptação para múltiplos formatos", "Revisão e controle de qualidade"],
    },
    {
      step: "03",
      title: "O conteúdo é distribuído",
      description:
        "A mensagem entra na programação da rádio web, no portal e nos canais de transmissão do WhatsApp com horários e segmentação inteligente.",
      icon: RadioTower,
      pill: "Difusão",
      color: "from-[#0284c7] to-[#00f0ff]",
      details: ["Disparo multicanal sincronizado", "Sem poluição ou invasão indevida"],
    },
    {
      step: "04",
      title: "A população acompanha",
      description:
        "Os moradores acessam as novidades com comodidade no smartphone, em estabelecimentos parceiros ou no portal, fortalecendo a economia local.",
      icon: Users,
      pill: "Conexão",
      color: "from-emerald-500 to-teal-400",
      details: ["Moradores bem informados", "Comércio valorizado e próximo"],
    },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-slate-50/70 dark:bg-[#0a0c1b]/70 border-y border-slate-200/80 dark:border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-3.5 h-3.5 text-[#ff7300]" />
            <span>FLUXO SIMPLIFICADO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            A comunicação local{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] to-[#ff7300]">
              em um só lugar.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Eliminamos a complexidade de gerenciar múltiplos meios isolados. Um fluxo contínuo e inteligente para fazer sua voz ecoar na cidade.
          </p>
        </div>

        {/* Visual Workflow Steps */}
        <div className="relative">
          
          {/* Connector Line (Desktop) */}
          <div 
            aria-hidden="true" 
            className="hidden lg:block absolute top-1/2 left-10 right-10 -translate-y-8 h-1 bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#00f0ff] opacity-25 rounded-full" 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="relative group flex flex-col justify-between p-7 rounded-2xl bg-white dark:bg-[#121428] border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Header: Step Number & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-[#ff2a85] dark:text-[#00f0ff]" />
                      </div>
                      <span className="text-2xl font-black font-mono bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-400">
                        {item.step}
                      </span>
                    </div>

                    {/* Step pill */}
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 mb-2 border border-slate-200 dark:border-white/10">
                      {item.pill}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                    {item.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
