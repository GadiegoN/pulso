"use client";

import React from "react";
import { 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Sparkles, 
  Award, 
  HeartHandshake, 
  Quote,
  CheckCircle2,
  Globe,
  ArrowUpRight
} from "lucide-react";

export function LeadershipSection() {
  const commitments = [
    {
      title: "Proximidade & Realidade Local",
      desc: "Nascido e vivendo no interior (Conquista – MG), conhecendo de perto as dores e a rotina do comerciante real.",
    },
    {
      title: "Solidez Técnica & Operacional",
      desc: "Formação em Sistemas de Informação e experiência prática unindo engenharia de software e processos operacionais.",
    },
    {
      title: "Respeito à Comunidade",
      desc: "Comunicação limpa, sem poluição sonora e com mensagens que as famílias realmente querem receber.",
    },
  ];

  return (
    <section id="lideranca" className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-[#0a0c1e]/50 border-t border-slate-200/80 dark:border-white/5">
      
      {/* Subtle Background Glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#ff2a85]/10 blur-[120px] rounded-full" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#00f0ff]/10 blur-[120px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Award className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span>LIDERANÇA & PROPÓSITO REGIONAL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Por trás da rede: o compromisso com a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#0284c7] dark:from-[#ff2a85] dark:via-[#ff7300] dark:to-[#00f0ff]">
              sua cidade.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            A tecnologia só transforma quando é conduzida por quem conhece a realidade do interior e entende a importância de cada comerciante para a cidade.
          </p>
        </div>

        {/* Executive Profile Card */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-tr from-[#ff2a85]/30 via-slate-200 to-[#00f0ff]/30 dark:from-[#ff2a85]/30 dark:via-white/10 dark:to-[#00f0ff]/30 shadow-2xl">
          <div className="rounded-[23px] bg-white dark:bg-[#101226] p-8 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: CEO Executive Card */}
              <div className="lg:col-span-5 flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
                
                {/* Ambient photo glow */}
                <div 
                  aria-hidden="true" 
                  className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#ff2a85]/20 to-[#00f0ff]/20 blur-2xl rounded-full" 
                />

                {/* Executive Avatar with Real Photo & Neon Rim */}
                <div className="relative mb-5 group">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl p-[3px] bg-gradient-to-tr from-[#ff2a85] via-[#ff7300] to-[#00f0ff] shadow-xl shadow-[#ff2a85]/20">
                    <div className="w-full h-full rounded-[13px] bg-slate-900 overflow-hidden relative">
                      <img 
                        src="https://github.com/GadiegoN.png" 
                        alt="Gadiego Nogueira - Fundador & CEO"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#101226]" title="Perfil Verificado">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Gadiego Nogueira
                </h3>
                <div className="text-xs font-bold uppercase tracking-wider text-[#ff2a85] dark:text-[#00f0ff] mt-1 mb-2">
                  Fundador & Diretor Executivo
                </div>

                {/* Origin tag */}
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Conquista – MG</span>
                  <span>•</span>
                  <span>Sistemas de Informação</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mb-6">
                  Especialista em tecnologia e sistemas, combinando engenharia de software à vivência prática em rotinas operacionais e compras do setor público.
                </p>

                {/* Executive Contact links */}
                <div className="w-full pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href="https://www.gadiegon.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-200 transition-all"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>gadiegon.com</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/gadiegon/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-200 transition-all"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                </div>

              </div>

              {/* Right Column: Founder's Letter & Principles */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Quote Icon */}
                <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                  <Quote className="w-8 h-8 text-[#ff2a85]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    MENSAGEM DO FUNDADOR
                  </span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  "O comércio local constrói o interior todos os dias. Ele merece tecnologia à altura do seu esforço."
                </h4>

                <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Vivendo e atuando em Conquista, no interior de Minas Gerais, acompanho de perto o desafio de quem acorda cedo para abrir uma padaria, uma farmácia ou uma loja de roupas. É um trabalho sério, mas que ainda depende das mesmas formas de divulgação de décadas atrás: carros de som pontuais ou o labirinto dos algoritmos das grandes redes sociais, que quase nunca entregam a mensagem para a vizinhança.
                  </p>
                  <p>
                    A <strong>Rede PULSO</strong> nasceu dessa percepção direta. Unindo a minha formação em Sistemas de Informação e a vivência em processos e operações reais, estamos desenhando uma <strong>infraestrutura de comunicação limpa, digital e integrada</strong> que valoriza a economia da cidade e respeita o sossego das famílias.
                  </p>
                </div>

                {/* 3 Core Commitments */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  {commitments.map((c, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{c.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {c.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Sign-off */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="italic font-serif text-sm font-semibold text-slate-800 dark:text-slate-200">
                    — Gadiego de Jesus Nogueira
                  </span>
                  <span>Conquista – MG • 2026</span>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
