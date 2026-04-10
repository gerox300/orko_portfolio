'use client';

/**
 * EchoSystem
 * Atmospheric radial gradient pulse — fires every 100vh scroll boundary.
 *
 * Visuals:
 *   Fixed overlay, full viewport, pointer-events: none, z-index: 5
 *   Radial gradient: infrared glow centered at 50% 50%, peak opacity 0.05
 *
 * Trigger:
 *   GSAP ScrollTrigger onUpdate detects when scroll crosses a 100vh boundary.
 *   Each crossing: brief pulse (opacity 0 → peakOpacity → 0, 1200ms total).
 *   Concurrent crossings cancel the previous pulse before starting the new one.
 *
 * Prevents double-firing: boundary check uses integer division of scrollY / vh.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COLORS, ECHO, AUDIO_IDS } from '@/lib/constants';
import { playSound } from '@/lib/audioEngine';

gsap.registerPlugin(ScrollTrigger);

export function EchoSystem() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastBoundaryRef = useRef<number>(-1);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Initial state: fully transparent
    gsap.set(overlay, { opacity: 0 });

    function pulse() {
      if (!overlay) return;
      gsap.killTweensOf(overlay);
      playSound(AUDIO_IDS.heartbeatThud);
      // Rise 0 → peak, then decay peak → 0
      gsap.timeline()
        .fromTo(overlay,
          { opacity: 0 },
          { opacity: ECHO.peakOpacity, duration: 0.3, ease: 'power1.out' },
        )
        .to(overlay, {
          opacity: 0,
          duration: (ECHO.pulseDuration - 300) / 1000, // remaining ms → seconds
          ease: 'power1.inOut',
        });
    }

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const scrollY = self.scroll();
        const vh = window.innerHeight;
        const boundary = Math.floor(scrollY / vh);
        if (boundary !== lastBoundaryRef.current && boundary > 0) {
          lastBoundaryRef.current = boundary;
          pulse();
        }
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(overlay);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${COLORS.accentInfrared}14 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 5,
        willChange: 'opacity',
      }}
    />
  );
}
