"use client";

import React from "react";
import { X, ShieldCheck } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#121428] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Política de Privacidade & Termos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rede PULSO • Em conformidade com a LGPD (Lei nº 13.709/2018)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>1. Finalidade do Cadastro:</strong> Os dados fornecidos através deste formulário (nome, empresa, cidade, contato e mensagem) destinam-se exclusivamente ao registro de interesse de participação no projeto piloto da Rede PULSO.
          </p>
          <p>
            <strong>2. Não Comercialização:</strong> A Rede PULSO compromete-se a não vender, alugar ou transferir seus dados pessoais ou comerciais para terceiros para fins publicitários externos.
          </p>
          <p>
            <strong>3. Comunicação Transparente:</strong> Entraremos em contato unicamente para apresentar o projeto, colher percepções de mercado e notificar sobre novidades do lançamento em sua cidade.
          </p>
          <p>
            <strong>4. Cancelamento e Exclusão:</strong> Você poderá, a qualquer momento, solicitar a atualização ou exclusão definitiva de seus dados de nossa base de contato, mediante simples solicitação pelo nosso e-mail oficial.
          </p>
          <p>
            <strong>5. Segurança da Informação:</strong> Adotamos práticas adequadas de segurança cibernética para garantir que as informações coletadas permaneçam protegidas contra acessos não autorizados.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
