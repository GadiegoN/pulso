'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Minimize2,
  Sparkles,
  SkipForward,
  ListMusic,
  Clock,
  MessageCircle,
} from 'lucide-react';
import type { RadioQueueItem } from '@/app/api/radio/queue/route';

interface Props {
  initialSpot?: {
    title: string;
    audioUrl: string;
    durationSeconds: number;
  };
}

const DEFAULT_LIVE_STREAM = 'https://stream.zeno.fm/f3wvbbqmdg8uv';

export function DigitalRadioPlayer({ initialSpot }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);

  // Automação de Fila & Sequenciador
  const [queue, setQueue] = useState<RadioQueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1); // -1 = stream musical contínuo; >= 0 = spot da grade
  const [fallbackStreamUrl, setFallbackStreamUrl] = useState(DEFAULT_LIVE_STREAM);
  const [progressSeconds, setProgressSeconds] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTriggeredMinuteRef = useRef<string>('');

  // Busca fila programada no servidor
  const fetchRadioQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/radio/queue', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.fallbackStreamUrl) {
        setFallbackStreamUrl(data.fallbackStreamUrl);
      }
      if (Array.isArray(data.queue)) {
        setQueue(data.queue);
      }
    } catch {
      // Mantém stream contínuo caso offline
    }
  }, []);

  useEffect(() => {
    fetchRadioQueue();
    const pollInterval = setInterval(fetchRadioQueue, 60_000);
    return () => clearInterval(pollInterval);
  }, [fetchRadioQueue]);

  // Verificador automático de horário agendado (dispara spot programado para o minuto atual)
  useEffect(() => {
    if (queue.length === 0) return;

    const timer = setInterval(() => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      if (lastTriggeredMinuteRef.current === hhmm) return;

      const scheduledIdx = queue.findIndex(
        (item) => item.isScheduledForToday && item.scheduledTime === hhmm
      );

      if (scheduledIdx !== -1) {
        lastTriggeredMinuteRef.current = hhmm;
        setCurrentIndex(scheduledIdx);
        if (isPlaying && audioRef.current) {
          audioRef.current.src = queue[scheduledIdx].audioUrl;
          audioRef.current.play().catch(() => {});
        }
      }
    }, 10_000);

    return () => clearInterval(timer);
  }, [queue, isPlaying]);

  const activeSpot: RadioQueueItem | null =
    currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;

  const currentAudioUrl = activeSpot
    ? activeSpot.audioUrl
    : initialSpot?.audioUrl || fallbackStreamUrl;

  const playSource = useCallback(
    (url: string) => {
      if (!audioRef.current) return;
      audioRef.current.src = url;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    },
    [isMuted, volume]
  );

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Se existem spots na fila e estamos iniciando agora, começa pelo primeiro spot da grade
      if (currentIndex === -1 && queue.length > 0) {
        setCurrentIndex(0);
        playSource(queue[0].audioUrl);
      } else {
        playSource(currentAudioUrl);
      }
    }
  };

  // Quando um spot termina, avança automaticamente para o próximo spot ou retorna à transmissão contínua
  const handleTrackEnded = () => {
    setProgressSeconds(0);
    if (currentIndex >= 0 && currentIndex + 1 < queue.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      playSource(queue[nextIdx].audioUrl);
    } else {
      // Fim do bloco de spots: entra na transmissão contínua ao vivo
      setCurrentIndex(-1);
      playSource(fallbackStreamUrl);
    }
  };

  const skipToNext = () => {
    if (queue.length === 0) return;
    if (currentIndex === -1) {
      setCurrentIndex(0);
      if (isPlaying) playSource(queue[0].audioUrl);
    } else if (currentIndex + 1 < queue.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (isPlaying) playSource(queue[nextIdx].audioUrl);
    } else {
      setCurrentIndex(-1);
      if (isPlaying) playSource(fallbackStreamUrl);
    }
  };

  const selectQueueItem = (idx: number) => {
    setCurrentIndex(idx);
    playSource(queue[idx].audioUrl);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleTrackEnded}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setProgressSeconds(Math.floor(audioRef.current.currentTime));
          }
        }}
      />

      {/* Floating Radio Widget */}
      <div className="fixed bottom-6 right-6 z-40 font-sans selection:bg-[#ff3366] selection:text-white">
        {isCollapsed ? (
          /* Botão Pílula Compacto */
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0a0d14]/95 border border-purple-500/40 text-white shadow-[0_0_25px_rgba(168,85,247,0.35)] backdrop-blur-xl hover:border-purple-400 transition-all cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  activeSpot ? 'bg-amber-400' : 'bg-purple-400'
                } ${isPlaying ? 'animate-ping' : ''}`}
              />
              <Radio className="w-4 h-4 text-purple-300 ml-1.5" />
            </div>

            <div className="text-left text-xs max-w-[160px]">
              <span className="font-bold text-white block truncate">
                {activeSpot ? activeSpot.title : 'PULSO RÁDIO'}
              </span>
              <span className="text-[10px] text-purple-300 font-mono block -mt-0.5 truncate">
                {isPlaying
                  ? activeSpot
                    ? `Spot • ${activeSpot.establishmentName || 'Parceiro'}`
                    : 'Sintonizado Ao Vivo'
                  : queue.length > 0
                  ? `${queue.length} spot(s) na programação`
                  : 'Ouvir Transmissão'}
              </span>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff3366] to-[#7928ca] flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" />
              )}
            </div>
          </button>
        ) : (
          /* Card Expandido do Player com Sequenciador */
          <div className="w-84 bg-[#0a0d14]/95 border border-purple-500/30 rounded-2xl p-4 shadow-[0_0_35px_rgba(168,85,247,0.25)] backdrop-blur-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeSpot ? 'bg-amber-400' : 'bg-emerald-400'
                  } animate-pulse`}
                />
                <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300 font-bold">
                  {activeSpot ? 'SPOT COMERCIAL NO AR' : 'RÁDIO DIGITAL LOCAL'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {queue.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowQueueDrawer(!showQueueDrawer)}
                    title="Ver fila de programação"
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      showQueueDrawer
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ListMusic className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Informação da Faixa / Spot Ativo */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white truncate">
                  {activeSpot
                    ? activeSpot.title
                    : initialSpot?.title || 'Frequência Local PULSO • Conquista - MG'}
                </h4>
                {activeSpot && (
                  <span className="text-[10px] font-mono text-amber-300 shrink-0">
                    {progressSeconds}s / {activeSpot.durationSeconds}s
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono truncate">
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">
                    {activeSpot?.establishmentName
                      ? `Anunciante: ${activeSpot.establishmentName}`
                      : 'Programação Automática & Spots da Cidade'}
                  </span>
                </p>

                {activeSpot?.establishmentWhatsapp && (
                  <a
                    href={`https://wa.me/55${activeSpot.establishmentWhatsapp.replace(
                      /\D/g,
                      ''
                    )}?text=${encodeURIComponent(
                      `Olá! Ouvi seu anúncio "${activeSpot.title}" na Rádio Digital PULSO!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 shrink-0"
                  >
                    <MessageCircle className="w-2.5 h-2.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Visualizador de Ondas Equalizadoras */}
            <div className="h-6 flex items-end justify-center gap-1 bg-white/5 rounded-lg px-3 py-1">
              {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 35, 75, 50, 85].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlaying
                      ? `${Math.max(15, (h * Math.sin(i + 1 + progressSeconds)) % 100)}%`
                      : '15%',
                    transition: 'height 0.15s ease-in-out',
                  }}
                  className={`w-1 rounded-full ${
                    isPlaying
                      ? activeSpot
                        ? 'bg-gradient-to-t from-amber-500 to-[#ff3366]'
                        : 'bg-gradient-to-t from-purple-500 to-[#ff3366]'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Gaveta da Fila de Spots Programados */}
            {showQueueDrawer && queue.length > 0 && (
              <div className="max-h-36 overflow-y-auto rounded-xl bg-black/40 border border-white/10 p-2 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1.5 flex items-center justify-between">
                  <span>Sequência Programada ({queue.length})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIndex(-1);
                      playSource(fallbackStreamUrl);
                    }}
                    className="text-purple-300 hover:underline cursor-pointer"
                  >
                    Stream Contínuo
                  </button>
                </div>
                {queue.map((item, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectQueueItem(idx)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-purple-500/20 text-white border border-purple-500/40'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-semibold block truncate text-[11px]">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.establishmentName || 'Institucional PULSO'}
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        {item.scheduledTime ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-amber-300">
                            <Clock className="w-2.5 h-2.5" />
                            {item.scheduledTime}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">
                            {item.durationSeconds}s
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Controles Principais */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {/* Botão Play / Pause */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,51,102,0.4)] transition-all cursor-pointer hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                {/* Avançar na Fila */}
                {queue.length > 0 && (
                  <button
                    type="button"
                    onClick={skipToNext}
                    title="Avançar para próximo spot / transmissão"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/5">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
