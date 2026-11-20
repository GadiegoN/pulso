"use client";

import React, { useState } from "react";
import { 
  Store, 
  UtensilsCrossed, 
  HeartPulse, 
  Wrench, 
  CalendarDays, 
  Building2, 
  Users, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

export function TargetAudienceSection() {
  const segments = [
    {
      id: "comercio",
      category: "varejo",
      icon: Store,
      title: "Comércio Local & Varejo",
      examples: "Supermercados, mercearias, lojas de roupas, calçados e materiais",
      benefit: "Divulgue ofertas semanais e queimas de estoque diretamente para a comunidade local, sem depender da rota de um veículo na rua.",
      tag: "Varejo & Moda",
    },
    {
      id: "alimentacao",
      category: "alimentacao",
      icon: UtensilsCrossed,
      title: "Alimentação & Gastronomia",
      examples: "Restaurantes, lanchonetes, pizzarias, padarias e deliveries",
      benefit: "Apresente pratos do dia, novidades do cardápio e promoções de finais de semana com agilidade e apelo visual.",
      tag: "Gastronomia",
    },
    {
      id: "saude",
      category: "saude",
      icon: HeartPulse,
      title: "Farmácias & Bem-Estar",
      examples: "Drogarias, farmácias de manipulação, clínicas e estéticas",
      benefit: "Informe escalas de plantão, campanhas de prevenção e produtos de cuidados pessoais com credibilidade e respeito.",
      tag: "Saúde & Cuidados",
    },
    {
      id: "servicos",
      category: "servicos",
      icon: Wrench,
      title: "Prestadores de Serviços",
      examples: "Oficinas mecânicas, contabilidades, consultorias e profissionais autônomos",
      benefit: "Consolide sua reputação no município para ser a primeira opção lembrada quando o morador precisar de um serviço essencial.",
      tag: "Serviços Gerais",
    },
    {
      id: "eventos",
      category: "eventos",
      icon: CalendarDays,
      title: "Organizadores de Eventos",
      examples: "Shows, feiras agropecuárias, inaugurações e festivais gastronômicos",
      benefit: "Crie expectativa e engajamento antecipado com áudio envolvente e avisos sincronizados em toda a rede regional.",
      tag: "Cultura & Lazer",
    },
    {
      id: "instituicoes",
      category: "institucional",
      icon: Building2,
      title: "Instituições Públicas & Privadas",
      examples: "Associações comerciais, cooperativas, sindicatos e órgãos locais",
      benefit: "Transmita comunicados cívicos, editais, datas comemorativas e informativos de interesse público de forma limpa e oficial.",
      tag: "Institucional",
    },
    {
      id: "comunidade",
      category: "comunidade",
      icon: Users,
      title: "Moradores & Comunidade",
      examples: "Cidadãos, famílias, estudantes e profissionais da cidade",
      benefit: "Acesso facilitado às promoções do comércio local, utilidade pública e acontecimentos da própria cidade, sem barulho invasivo.",
      tag: "Público Geral",
    },
  ];

  return (
    <section id="segmentos" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>PÚBLICO-ALVO INTEGRADO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Toda cidade tem histórias, oportunidades e negócios que{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#0284c7] dark:from-[#ff2a85] dark:via-[#ff7300] dark:to-[#00f0ff]">
              merecem ser conhecidos.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            A Rede PULSO foi pensada para abranger desde o pequeno empreendedor familiar até as maiores entidades do município.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((seg) => {
            const Icon = seg.icon;
            const isCommunity = seg.id === "comunidade";
            return (
              <div
                key={seg.id}
                className={`group relative p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isCommunity
                    ? "md:col-span-2 lg:col-span-3 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-[#151833] dark:via-[#101228] dark:to-[#151833] border-[#ff2a85]/30 dark:border-[#00f0ff]/30 shadow-md"
                    : "bg-white dark:bg-[#121428] border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#ff2a85] dark:text-[#00f0ff]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                      {seg.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                    {seg.title}
                  </h3>

                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
                    {seg.examples}
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {seg.benefit}
                  </p>
                </div>

                {isCommunity && (
                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Sem mensagens invasivas ou spam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ff2a85]" />
                      <span>Acesso 100% gratuito para o cidadão</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" />
                      <span>Valorização do comércio de bairro</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
