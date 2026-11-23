'use client';

import React, { useState, useTransition } from 'react';
import {
  startMfaEnrollAction,
  verifyMfaEnrollAction,
  disableMfaAction,
  revokeOtherSessionsAction,
  type MfaEnrollState,
} from '@/lib/auth/mfa-actions';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  LogOut,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Clock,
  Laptop,
} from 'lucide-react';

interface Props {
  profile: any;
  verifiedTotp: any;
  recentLogs: any[];
}

export default function SecuritySettingsView({
  profile,
  verifiedTotp,
  recentLogs,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [enrollData, setEnrollData] = useState<MfaEnrollState | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const hasMfa = !!verifiedTotp || profile.mfaEnabled;

  // Iniciar processo de pareamento do autenticador
  const handleStartEnroll = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await startMfaEnrollAction();
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setEnrollData(res);
      }
    });
  };

  // Validar código para ativar MFA
  const handleVerifyEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollData?.factorId || !verificationCode) return;

    setMessage(null);
    startTransition(async () => {
      const res = await verifyMfaEnrollAction(enrollData.factorId!, verificationCode);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'MFA ativado com sucesso! Sua conta está duplamente protegida.' });
        setEnrollData(null);
        setVerificationCode('');
      }
    });
  };

  // Desativar MFA
  const handleDisableMfa = () => {
    if (!confirm('Tem certeza que deseja desativar a autenticação em duas etapas? Isso reduz a segurança da sua conta.')) {
      return;
    }

    setMessage(null);
    startTransition(async () => {
      const res = await disableMfaAction(verifiedTotp?.id);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Autenticação em duas etapas desativada.' });
        setEnrollData(null);
      }
    });
  };

  // Revogar outras sessões ativas
  const handleRevokeOtherSessions = () => {
    if (!confirm('Isso desconectará todos os outros dispositivos e navegadores que possam estar conectados com suas credenciais. Deseja continuar?')) {
      return;
    }

    setMessage(null);
    startTransition(async () => {
      const res = await revokeOtherSessionsAction();
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Todas as outras sessões ativas foram desconectadas e revogadas com sucesso.' });
      }
    });
  };

  const copySecretToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Alertas de Notificação */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Card 1: Autenticação Multifator (TOTP) */}
      <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                hasMfa
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Autenticação Multifator (TOTP)</h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    hasMfa
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {hasMfa ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exige um código de 6 dígitos gerado pelo Google Authenticator ou Authy no login
              </p>
            </div>
          </div>

          <div>
            {hasMfa ? (
              <button
                type="button"
                onClick={handleDisableMfa}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending ? 'Processando...' : 'Desativar MFA'}
              </button>
            ) : (
              !enrollData && (
                <button
                  type="button"
                  onClick={handleStartEnroll}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Gerando...' : 'Configurar App Autenticador'}
                </button>
              )
            )}
          </div>
        </div>

        {/* Formulário de Configuração do QR Code (Apenas no fluxo de ativação) */}
        {enrollData && !hasMfa && (
          <div className="p-6 rounded-xl bg-white/5 border border-cyan-500/30 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold text-white mb-1">
                Etapa 1: Escanear o QR Code no seu aplicativo
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Abra seu aplicativo autenticador (Google Authenticator, Authy ou 1Password) e aponte a câmera para o QR Code abaixo:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* QR Code SVG */}
              {enrollData.qrCode && (
                <div
                  className="p-3 bg-white rounded-xl shadow-lg shrink-0"
                  dangerouslySetInnerHTML={{ __html: enrollData.qrCode }}
                />
              )}

              <div className="space-y-3 flex-1 text-xs">
                <p className="text-slate-300">
                  Ou adicione manualmente usando a chave secreta:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={enrollData.secret || ''}
                    className="flex-1 bg-[#121622] border border-white/10 rounded-lg px-3 py-2 font-mono text-cyan-300 text-xs select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copySecretToClipboard(enrollData.secret || '')}
                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSecret ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-bold text-white mb-2">
                Etapa 2: Confirmar ativação
              </h3>
              <form onSubmit={handleVerifyEnroll} className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full sm:w-48 bg-[#121622] border border-white/10 rounded-xl px-4 py-2.5 text-center font-mono text-base tracking-[0.25em] text-white focus:outline-none focus:border-cyan-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={isPending || verificationCode.length !== 6}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Verificando...' : 'Confirmar & Ativar MFA'}
                </button>
                <button
                  type="button"
                  onClick={() => setEnrollData(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Card 2: Gerenciamento e Revogação de Sessões Ativas */}
      <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Sessões Ativas & Controle de Acesso</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Revogue instantaneamente o acesso de outros navegadores e dispositivos conectados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRevokeOtherSessions}
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{isPending ? 'Revogando...' : 'Revogar Outras Sessões'}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="font-semibold text-white">Esta sessão atual</p>
              <p className="text-[11px] text-slate-400">Conectado via Next.js 16 Proxy • Cookie HTTP-Only criptografado</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
            Em Uso
          </span>
        </div>
      </div>

      {/* Card 3: Histórico de Ações de Segurança da Conta */}
      <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ff3366]" />
            <span>Histórico de Atividades Desta Conta</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Últimas ações auditadas associadas ao seu identificador
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-3 font-semibold">Data / Hora</th>
                <th className="px-6 py-3 font-semibold">Ação Registrada</th>
                <th className="px-6 py-3 font-semibold">IP de Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-slate-500 font-sans">
                    Nenhum registro individual recente.
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 text-slate-400">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-3 text-white">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-400">
                      <span
                        className="inline-block blur-xs hover:blur-none transition-all duration-200 cursor-pointer select-all"
                        title="Passe o mouse para revelar o IP"
                      >
                        {log.ipAddress || '127.0.0.1'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
