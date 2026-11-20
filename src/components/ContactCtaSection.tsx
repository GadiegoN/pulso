"use client";

import React, { useState } from "react";
import { 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { PrivacyModal } from "./PrivacyModal";

export function ContactCtaSection() {
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    segmento: "comercio",
    cidade: "",
    estado: "SP",
    whatsapp: "",
    email: "",
    mensagem: "",
    concordaTermos: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.nome.trim()) err.nome = "Por favor, informe seu nome.";
    if (!formData.empresa.trim()) err.empresa = "Informe sua empresa, negócio ou profissão.";
    if (!formData.cidade.trim()) err.cidade = "Informe a cidade.";
    if (!formData.whatsapp.trim()) {
      err.whatsapp = "Informe um número de WhatsApp ou telefone.";
    } else if (formData.whatsapp.replace(/\D/g, "").length < 10) {
      err.whatsapp = "Informe um telefone válido com DDD (mínimo 10 dígitos).";
    }
    if (!formData.concordaTermos) {
      err.concordaTermos = "É necessário aceitar os termos da política de privacidade.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulating validation and storing registered interest in localStorage
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("pulso-cadastros") || "[]");
        stored.push({
          ...formData,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("pulso-cadastros", JSON.stringify(stored));
      } catch (e) {
        console.error(e);
      }
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const handlePhoneChange = (val: string) => {
    const numeric = val.replace(/\D/g, "").slice(0, 11);
    let formatted = numeric;
    if (numeric.length > 2) {
      formatted = `(${numeric.slice(0, 2)}) ${numeric.slice(2)}`;
    }
    if (numeric.length > 7) {
      formatted = `(${numeric.slice(0, 2)}) ${numeric.slice(2, 7)}-${numeric.slice(7)}`;
    }
    setFormData({ ...formData, whatsapp: formatted });
  };

  return (
    <section id="contato" className="py-24 relative overflow-hidden">
      
      {/* Background Neon Accent Glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#ff2a85]/15 via-[#ff7300]/10 to-[#00f0ff]/15 blur-3xl opacity-60 rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Headline & Project Context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>CADASTRO DE INTERESSE PIONEIRO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Sua cidade pode se comunicar de uma{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#0284c7] dark:from-[#ff2a85] dark:via-[#ff7300] dark:to-[#00f0ff]">
                nova maneira.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Estamos desenvolvendo a Rede PULSO, uma proposta contemporânea para a comunicação local. Queremos conhecer empresas e pessoas interessadas em fazer parte dessa transformação pioneira.
            </p>

            {/* Quick Benefits Checklist */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Prioridade para conhecer a rede em primeira mão em sua região.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ff2a85] shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Oportunidade de sugerir canais e necessidades específicas da sua cidade.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Sem custos ou compromissos comerciais nesta fase de apresentação.
                </span>
              </div>
            </div>

            {/* Contact Alternatives */}
            <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Canal Direto de Atendimento
              </div>
              <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
                <a 
                  href="mailto:contato@pulsorede.com.br" 
                  className="hover:text-[#ff2a85] dark:hover:text-[#00f0ff] flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>contato@pulsorede.com.br</span>
                </a>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Iniciativa voltada para cidades do interior do Brasil</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-tr from-[#ff2a85]/40 via-slate-200 to-[#00f0ff]/40 dark:from-[#ff2a85]/40 dark:via-white/10 dark:to-[#00f0ff]/40 shadow-2xl">
              <div className="rounded-[23px] bg-white dark:bg-[#121428] p-7 sm:p-9">
                
                {isSuccess ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Interesse Registrado com Sucesso!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                      Obrigado por apoiar a modernização da comunicação local com a Rede PULSO. Guardamos seus dados com segurança e entraremos em contato quando iniciarmos a fase de testes na sua cidade.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setIsSuccess(false);
                          setFormData({
                            nome: "",
                            empresa: "",
                            segmento: "comercio",
                            cidade: "",
                            estado: "SP",
                            whatsapp: "",
                            email: "",
                            mensagem: "",
                            concordaTermos: false,
                          });
                        }}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        Enviar outro registro
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="border-b border-slate-200 dark:border-white/10 pb-4 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Formulário de Interesse Institucional
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Preencha os campos abaixo para acompanhar a evolução da Rede PULSO.
                      </p>
                    </div>

                    {/* Row 1: Nome & Empresa */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Seu Nome *
                        </label>
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          placeholder="Ex: Carlos Silva"
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a85] transition-all ${
                            errors.nome ? "border-rose-500" : "border-slate-300 dark:border-white/10"
                          }`}
                        />
                        {errors.nome && <p className="text-xs text-rose-500 mt-1">{errors.nome}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Empresa / Atividade *
                        </label>
                        <input
                          type="text"
                          value={formData.empresa}
                          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                          placeholder="Ex: Supermercado Central"
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a85] transition-all ${
                            errors.empresa ? "border-rose-500" : "border-slate-300 dark:border-white/10"
                          }`}
                        />
                        {errors.empresa && <p className="text-xs text-rose-500 mt-1">{errors.empresa}</p>}
                      </div>
                    </div>

                    {/* Row 2: Segmento & Cidade / UF */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Segmento de Atuação
                        </label>
                        <select
                          value={formData.segmento}
                          onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-sm bg-slate-50 dark:bg-[#121428] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a85] transition-all"
                        >
                          <option value="comercio">Comércio / Varejo</option>
                          <option value="alimentacao">Alimentação / Gastronomia</option>
                          <option value="farmacia">Farmácia / Saúde</option>
                          <option value="servicos">Prestação de Serviços</option>
                          <option value="eventos">Eventos / Lazer</option>
                          <option value="instituicao">Instituição / Associação</option>
                          <option value="morador">Morador Interessado</option>
                          <option value="outro">Outro segmento</option>
                        </select>
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          value={formData.cidade}
                          onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                          placeholder="Ex: Rio Claro"
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a85] transition-all ${
                            errors.cidade ? "border-rose-500" : "border-slate-300 dark:border-white/10"
                          }`}
                        />
                        {errors.cidade && <p className="text-xs text-rose-500 mt-1">{errors.cidade}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          UF
                        </label>
                        <input
                          type="text"
                          maxLength={2}
                          value={formData.estado}
                          onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                          placeholder="SP"
                          className="w-full px-3 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-sm bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-center uppercase focus:outline-none focus:ring-2 focus:ring-[#ff2a85]"
                        />
                      </div>
                    </div>

                    {/* Row 3: WhatsApp & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          WhatsApp / Telefone *
                        </label>
                        <input
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="(00) 00000-0000"
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a85] transition-all ${
                            errors.whatsapp ? "border-rose-500" : "border-slate-300 dark:border-white/10"
                          }`}
                        />
                        {errors.whatsapp && <p className="text-xs text-rose-500 mt-1">{errors.whatsapp}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                          E-mail (opcional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="contato@suaempresa.com.br"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-sm bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a85] transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 4: Mensagem / Dúvida */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Mensagem ou Dúvida (opcional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.mensagem}
                        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                        placeholder="Conte-nos o que achou da ideia ou como sua empresa costuma divulgar hoje..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 text-sm bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2a85] transition-all"
                      />
                    </div>

                    {/* Terms Checkbox */}
                    <div>
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={formData.concordaTermos}
                          onChange={(e) => setFormData({ ...formData, concordaTermos: e.target.checked })}
                          className="mt-0.5 rounded border-slate-300 text-[#ff2a85] focus:ring-[#ff2a85]"
                        />
                        <span>
                          Concordo em fornecer meus dados para fins de contato sobre o projeto da Rede PULSO, nos termos da{" "}
                          <button
                            type="button"
                            onClick={() => setPrivacyModalOpen(true)}
                            className="text-[#ff2a85] dark:text-[#00f0ff] underline font-semibold hover:opacity-80"
                          >
                            Política de Privacidade
                          </button>
                          .
                        </span>
                      </label>
                      {errors.concordaTermos && (
                        <p className="text-xs text-rose-500 mt-1">{errors.concordaTermos}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#0284c7] hover:opacity-95 shadow-lg shadow-[#ff2a85]/30 hover:shadow-xl hover:shadow-[#ff2a85]/40 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processando interesse...</span>
                        </>
                      ) : (
                        <>
                          <span>Tenho interesse em conhecer</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                      Não compartilhamos suas informações. Formulário institucional de fase preliminar.
                    </p>
                  </form>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>

      <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
    </section>
  );
}
