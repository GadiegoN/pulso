"use client";

import React from "react";
import { 
  Car, 
  Share2, 
  Layers, 
  Store, 
  AlertCircle, 
  TrendingUp,
  Sparkles,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export function ProblemSection() {
  const painPoints = [
    {
      icon: Car,
      title: "Circulação física limitada",
      description:
        "Carros de som dependem de rotas e horários específicos. Se a pessoa estiver ocupada ou distante no momento em que o veículo passa, a mensagem é perdida sem chance de consulta posterior.",
      tag: "Alcance pontual",
      accent: "from-amber-500 to-rose-500",
    },
    {
      icon: Share2,
      title: "Algoritmos que filtram o alcance",
      description:
        "Publicações isoladas em redes sociais disputam atenção com conteúdos globais. Na maioria das vezes, o algoritmo entrega a postagem para apenas uma pequena fração dos moradores locais.",
      tag: "Alcance imprevisível",
      accent: "from-rose-500 to-pink-500",
    },
    {
      icon: Layers,
      title: "Informações espalhadas e desordenadas",
      description:
        "Promoções, horários de funcionamento, cardápios e comunicados municipais ficam dispersos em múltiplos grupos e perfis. Quem busca uma informação local raramente sabe onde encontrar.",
      tag: "Fragmentação",
      accent: "from-purple-500 to-indigo-500",
    },
    {
      icon: Store,
      title: "Comércio sem estrutura especializada",
      description:
        "O pequeno e médio comerciante foca na operação diária e nem sempre dispõe de tempo, equipe ou tecnologia para planejar e veicular campanhas consistentes nos meios digitais.",
      tag: "Complexidade",
      accent: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section id="cenario" className="py-24 bg-slate-50/60 dark:bg-[#0c0e1e]/60 relative border-y border-slate-200/70 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>O CENÁRIO DA PUBLICIDADE LOCAL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Sua cidade ainda depende das{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] to-[#ff7300]">
              mesmas formas
            </span>{" "}
            de divulgação?
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            A comunicação local merece evoluir. As empresas precisam de novas possibilidades para divulgar suas mensagens, e os moradores precisam de maneiras mais simples de acompanhar o que acontece na própria cidade.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {painPoints.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative p-7 sm:p-8 rounded-2xl bg-white dark:bg-[#121428] border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-white/25 transition-all duration-300"
              >
                {/* Glow accent */}
                <div 
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.accent} opacity-5 group-hover:opacity-15 rounded-tr-2xl blur-2xl transition-opacity pointer-events-none`}
                />

                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:text-[#ff2a85] dark:group-hover:text-[#00f0ff] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                    </div>

                    <span className="inline-block text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                      {item.tag}
                    </span>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Constructive Notice box (Respecting Traditional Methods) */}
        <div className="mt-12 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-white/[0.04] dark:via-white/[0.02] dark:to-white/[0.04] border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ff7300]/10 text-[#ff7300] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Respeito à história e abertura para o novo
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Os meios tradicionais desempenharam um papel essencial e continuam presentes. O objetivo do projeto é somar e construir novos caminhos integrados, oferecendo alternativas digitais modernas e organizadas para toda a cidade.
              </p>
            </div>
          </div>
          <a
            href="#solucao"
            className="shrink-0 text-xs sm:text-sm font-semibold text-[#ff2a85] dark:text-[#00f0ff] hover:underline flex items-center gap-1.5"
          >
            <span>Ver nossa solução proposta</span>
            <span>&rarr;</span>
          </a>
        </div>

      </div>
    </section>
  );
}
