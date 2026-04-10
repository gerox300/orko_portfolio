'use client';

/**
 * LenisProvider
 * Initializes Lenis smooth scroll and wires the mandatory GSAP bridge.
 *
 * Bridge (MANDATORY per spec):
 *   lenis.on('scroll', ScrollTrigger.update)
 *   gsap.ticker.add((time) => lenis.raf(time * 1000))
 *   gsap.ticker.lagSmoothing(0)
 *
 * Lenis uses native scrollbar — no ScrollTrigger.scrollerProxy().
 */

import { useEffect, useRef, createContext, useContext, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollSmooth } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: scrollSmooth,
      smoothWheel: true,
      // Note: @studio-freight/lenis 1.x used `duration`, new lenis uses `lerp`
    });

    lenisRef.current = lenis;

    // ── MANDATORY GSAP BRIDGE ──────────────────────────────────────────────
    lenis.on('scroll', ScrollTrigger.update);

    // Store reference so cleanup can remove the exact same function
    const rafCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);

    gsap.ticker.lagSmoothing(0);
    // ──────────────────────────────────────────────────────────────────────

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis(): LenisContextValue {
  return useContext(LenisContext);
}
