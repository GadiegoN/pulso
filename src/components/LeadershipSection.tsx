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
  CheckCircle2
} from "lucide-react";

export function LeadershipSection() {
  const commitments = [
    {
      title: "Proximidade Real",
      desc: "Não somos um algoritmo distante. A PULSO é pensada para estar próxima dos comerciantes e da realidade de cada município.",
    },
    {
      title: "Acessibilidade para Todos",
      desc: "Modelos viáveis tanto para o pequeno comércio de bairro quanto para os maiores varejistas da cidade.",
    },
    {
      title: "Respeito à Comunidade",
      desc: "Comunicação limpa, sem poluição sonora e com mensagens que as pessoas realmente querem receber.",
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
            <span>LIDERANÇA & COMPROMISSO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Por trás da rede: o compromisso com a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#0284c7] dark:from-[#ff2a85] dark:via-[#ff7300] dark:to-[#00f0ff]">
              sua cidade.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            A tecnologia só tem valor quando existe responsabilidade humana, liderança transparente e paixão por ver os negócios locais prosperarem.
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

                {/* Executive Avatar / Portrait Mockup with Neon Rim */}
                <div className="relative mb-5 group">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl p-[3px] bg-gradient-to-tr from-[#ff2a85] via-[#ff7300] to-[#00f0ff] shadow-xl shadow-[#ff2a85]/20">
                    <div className="w-full h-full rounded-[13px] bg-slate-900 flex items-center justify-center relative overflow-hidden">
                      {/* Stylized Executive Silhouette / Avatar */}
                      <div className="w-full h-full bg-gradient-to-b from-slate-700 to-slate-950 flex flex-col items-center justify-end pb-3 text-slate-300">
                        <div className="w-14 h-14 rounded-full bg-slate-600/70 border border-white/20 mb-2 flex items-center justify-center text-white text-xl font-black">
                          GN
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                          FOUNDER
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#101226]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Gabriel Nogueira
                </h3>
                <div className="text-xs font-bold uppercase tracking-wider text-[#ff2a85] dark:text-[#00f0ff] mt-1 mb-3">
                  Fundador & CEO da Rede PULSO
                </div>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mb-6">
                  Empreendedor focado em inovação, tecnologia de comunicação e soluções para o desenvolvimento do interior do Brasil.
                </p>

                {/* Executive Contact links */}
                <div className="w-full pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-3">
                  <a
                    href="mailto:contato@pulsorede.com.br"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-200 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#ff2a85]" />
                    <span>Falar com a Diretoria</span>
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
                  "O comércio local é a espinha dorsal de qualquer cidade. Ele merece ferramentas à altura do seu valor."
                </h4>

                <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Cresci acompanhando de perto o dia a dia de cidades do interior. É inspirador ver a dedicação de quem acorda cedo para abrir uma mercearia, uma farmácia ou uma loja de roupas. Porém, na hora de divulgar, o comerciante quase sempre se depara com duas opções frustrantes: o custo passageiro de um carro de som ou o labirinto dos algoritmos das redes sociais, que escondem suas postagens.
                  </p>
                  <p>
                    A <strong>Rede PULSO</strong> nasceu para preencher esse vazio. Não viemos para inventar fórmulas mágicas ou prometer números mirabolantes, mas para construir uma <strong>infraestrutura limpa, digital e centralizada</strong> que valorize o comércio local e respeite o morador da cidade.
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
                  <span className="italic font-serif text-sm text-slate-700 dark:text-slate-300">
                    — Gabriel Nogueira
                  </span>
                  <span>São Paulo, Brasil • 2026</span>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
