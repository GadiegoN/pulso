'use client';

import React, { useEffect, useState } from 'react';

/**
 * Motor Cinematográfico de Scroll & Parallax inspirado na estética Rockstar (GTA IV / GTA VI).
 * - Barra superior de progresso neon em tempo real.
 * - Efeito de revelação cinematográfica com zoom-down (Ken Burns) e stagger aplicado APENAS
 *   aos títulos e cards reais (sem aplicar overflow:hidden em colunas de layout da Hero).
 */
export function GtaScrollAnimator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setScrollProgress(pct);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    // 1. Títulos e cabeçalhos das seções (Zoom-down reveal sem overflow:hidden)
    const revealTargets = document.querySelectorAll(
      'main section:not(:first-of-type) h2, main section:not(:first-of-type) h3, #cenario .grid > div, #solucao .grid > div, #como-funciona .grid > div, #segmentos .grid > div, #lideranca .rounded-3xl, #visao .grid > div, #contato form'
    );

    revealTargets.forEach((el, index) => {
      el.classList.add('gta-reveal');
      (el as HTMLElement).style.transitionDelay = `${(index % 4) * 85}ms`;
    });

    // 2. Efeito Neon Light Sweep + Hover Lift aplicado apenas aos cards fechados de grid
    const sweepCards = document.querySelectorAll(
      '#cenario .grid > div, #solucao .grid > div, #como-funciona .grid > div, #segmentos .grid > div, #visao .grid > div'
    );

    sweepCards.forEach((card) => {
      card.classList.add('gta-card-sweep');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gta-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px',
      }
    );

    revealTargets.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', updateScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none bg-transparent"
    >
      <div
        style={{ width: `${scrollProgress}%` }}
        className="h-full bg-gradient-to-r from-[#ff2a85] via-[#ff7300] to-[#00f0ff] shadow-[0_0_14px_rgba(255,42,133,0.9)] transition-[width] duration-75 ease-out"
      />
    </div>
  );
}
