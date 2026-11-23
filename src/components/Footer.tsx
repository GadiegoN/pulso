"use client";

import React, { useState } from "react";
import { Activity, Mail, MapPin, Heart, Shield, ArrowUp } from "lucide-react";
import { PrivacyModal } from "./PrivacyModal";

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white dark:bg-[#070814] border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Col 1 & 2: Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff2a85] via-[#ff7300] to-[#00f0ff] p-[2px]">
                <div className="w-full h-full bg-white dark:bg-[#0d0f23] rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#ff2a85] dark:text-[#00f0ff]" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#0284c7] dark:from-[#ff2a85] dark:via-[#ff7300] dark:to-[#00f0ff]">
                  PULSO
                </span>
                <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Rede Integrada de Comunicação Local
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Um novo conceito para modernizar a publicidade e a circulação de informações em cidades do interior. Conectando comércio, moradores e instituições em uma rede inteligente, digital e sustentável.
            </p>

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Plataforma em Operação • Conquista - MG • 2026</span>
            </div>
          </div>

          {/* Col 3: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#cenario" className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  O Cenário Atual
                </a>
              </li>
              <li>
                <a href="/#solucao" className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  A Solução Multicanal
                </a>
              </li>
              <li>
                <a href="/#como-funciona" className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  Como Funciona o Fluxo
                </a>
              </li>
              <li>
                <a href="/#segmentos" className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  Para Quem É
                </a>
              </li>
              <li>
                <a href="/#lideranca" className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  Liderança & CEO
                </a>
              </li>
              <li>
                <a href="/#visao" className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  Visão de Futuro
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Ecossistema Ativo */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Ecossistema PULSO
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="/guia" className="flex items-center gap-1.5 hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Guia Comercial Local</span>
                </a>
              </li>
              <li>
                <a href="/mural" className="flex items-center gap-1.5 hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Mural & Grupos WhatsApp</span>
                </a>
              </li>
              <li>
                <a href="/portal" className="flex items-center gap-1.5 hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                  <span>Portal do Comerciante</span>
                </a>
              </li>
              <li>
                <a href="/login" className="flex items-center gap-1.5 hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85]" />
                  <span>Acesso Administrativo</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Contato & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Contato & Termos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#contato"
                  className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors"
                >
                  Registrar Interesse
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@pulsorede.com.br"
                  className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors"
                >
                  contato@pulsorede.com.br
                </a>
              </li>
              <li>
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] transition-colors text-left"
                >
                  Política de Privacidade
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300"
              >
                <span>Voltar ao topo</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <div>
            &copy; 2026 PULSO — Rede de Comunicação Local. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-3">
            <span>Iniciativa de inovação em comunicação regional</span>
          </div>
        </div>

      </div>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  );
}
