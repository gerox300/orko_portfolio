'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { GLITCH, COLORS } from './constants';

export function useGlitchEngine(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    // ─── FUNCIÓN CORE DEL EFECTO (Extraída para reutilizar) ───────────────
    function executeGlitch(el: HTMLElement) {
      if (!el) return;

      // Position jitter
      gsap.to(el, {
        x: (Math.random() - 0.5) * GLITCH.positionJitterDistance * 2,
        y: (Math.random() - 0.5) * GLITCH.positionJitterDistance,
        duration: GLITCH.positionJitterDuration / 1000,
        yoyo: true,
        repeat: 3,
        ease: 'none',
        overwrite: 'auto',
        onComplete: () => { gsap.set(el, { x: 0, y: 0 }); },
      });

      // Opacity flicker
      gsap.to(el, {
        opacity: GLITCH.opacityFlickerValue,
        duration: GLITCH.opacityFlickerDuration / 1000,
        yoyo: true,
        repeat: 1,
        ease: 'none',
        overwrite: false,
        onComplete: () => { gsap.set(el, { opacity: 1 }); },
      });

      // RGB color-bleed filter
      gsap.to(el, {
        filter: `drop-shadow(2px 0 ${COLORS.accentInfrared}60) drop-shadow(-2px 0 rgba(0,80,255,0.35))`,
        duration: GLITCH.colorBleedDuration / 1000,
        yoyo: true,
        repeat: 1,
        ease: 'none',
        delay: 0.04,
        onComplete: () => { gsap.set(el, { filter: 'none' }); },
      });
    }

    // ─── LÓGICA AUTOMÁTICA (Reloj) ────────────────────────────────────────
    function fireAmbientGlitch() {
      const elements = document.querySelectorAll('[data-glitchable]');
      if (elements.length > 0) {
        const el = elements[Math.floor(Math.random() * elements.length)] as HTMLElement;
        executeGlitch(el);
      }
      schedule();
    }

    function schedule() {
      const delay = GLITCH.minInterval + Math.random() * (GLITCH.maxInterval - GLITCH.minInterval);
      timeoutId = setTimeout(fireAmbientGlitch, delay);
    }

    // ─── LÓGICA MANUAL (El "Oído" para el Logo) ───────────────────────────
    const handleManualTrigger = () => {
      const elements = document.querySelectorAll('[data-glitchable]');
      if (elements.length > 0) {
        // Al clickear, glitcheamos 2 o 3 elementos al mismo tiempo para que se note el "impacto"
        const count = Math.min(elements.length, 3);
        for (let i = 0; i < count; i++) {
          const el = elements[Math.floor(Math.random() * elements.length)] as HTMLElement;
          executeGlitch(el);
        }
      }
    };

    window.addEventListener('trigger-glitch', handleManualTrigger);

    // Inicio del ciclo ambiente
    timeoutId = setTimeout(fireAmbientGlitch, GLITCH.minInterval * Math.random());

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('trigger-glitch', handleManualTrigger);
    };
  }, []);
}