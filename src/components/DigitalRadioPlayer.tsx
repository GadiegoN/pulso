'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Radio, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Sparkles } from 'lucide-react';

interface Props {
  initialSpot?: {
    title: string;
    audioUrl: string;
    durationSeconds: number;
  };
}

export function DigitalRadioPlayer({ initialSpot }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Áudio padrão de demonstração de rádio digital caso não haja spot enviado
  const audioSource = initialSpot?.audioUrl || 'https://stream.zeno.fm/f3wvbbqmdg8uv';

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Erro na reprodução automática:', err);
          setIsPlaying(false);
        });
    }
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
        src={audioSource}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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
              <span className={`w-2.5 h-2.5 rounded-full bg-purple-400 ${isPlaying ? 'animate-ping' : ''}`} />
              <Radio className="w-4 h-4 text-purple-300 ml-1.5" />
            </div>

            <div className="text-left text-xs">
              <span className="font-bold text-white block">PULSO RÁDIO</span>
              <span className="text-[10px] text-purple-300 font-mono block -mt-0.5">
                {isPlaying ? 'Sintonizado Ao Vivo' : 'Ouvir Streaming'}
              </span>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-7 h-7 rounded-full bg-gradient-to-r from-[#ff3366] to-[#7928ca] flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </div>
          </button>
        ) : (
          /* Card Expandido do Player */
          <div className="w-80 bg-[#0a0d14]/95 border border-purple-500/30 rounded-2xl p-4 shadow-[0_0_35px_rgba(168,85,247,0.25)] backdrop-blur-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300 font-bold">
                  RÁDIO DIGITAL LOCAL
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Informação da Faixa / Spot */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white truncate">
                  {initialSpot?.title || 'Frequência Local PULSO • Conquista - MG'}
                </h4>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Spots Comerciais & Comunicação da Cidade</span>
              </p>
            </div>

            {/* Visualizador de Ondas Equalizadoras (Mermaid/CSS Bars) */}
            <div className="h-6 flex items-end justify-center gap-1 bg-white/5 rounded-lg px-3 py-1">
              {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 35, 75, 50, 85].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * Math.sin(i + 1)) % 100)}%` : '15%',
                    transition: 'height 0.15s ease-in-out',
                  }}
                  className={`w-1 rounded-full ${
                    isPlaying ? 'bg-gradient-to-t from-purple-500 to-[#ff3366]' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Controles Principais */}
            <div className="flex items-center justify-between pt-1">
              {/* Botão Play / Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#7928ca] hover:from-[#e62e5c] hover:to-[#6b22b5] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,51,102,0.4)] transition-all cursor-pointer hover:scale-105"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-2.5 py-1.5 border border-white/5">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
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
