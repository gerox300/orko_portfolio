'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { scramble } from '@/lib/textScramble';
import { TerminalTicker } from '@/components/hero/TerminalTicker';
import { DataNodes } from '@/components/hero/DataNodes';
import { SpecimenPills } from '@/components/hero/SpecimenPills';
import { GlitchText } from '@/components/GlitchText';
import { COLORS, heroEase } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_SCRAMBLE_DURATION = 1100;
const SUBHEADLINE_DELAY = 500;

// ─── Headline ─────────────────────────────────────────────────────────────
function Headline() {
  const { t } = useLanguage();
  const target = t('hero.headline');
  const [display, setDisplay] = useState('');
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setDisplay('');
    const timer = setTimeout(() => {
      cancelRef.current?.();
      cancelRef.current = scramble(target, HEADLINE_SCRAMBLE_DURATION, setDisplay);
    }, 120);
    return () => { clearTimeout(timer); cancelRef.current?.(); };
  }, [target]);

  return (
    <h1 style={{
      fontFamily: 'var(--font-headline), sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(2.6rem, 7vw, 6.5rem)',
      lineHeight: 0.9,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      color: COLORS.textBone,
      margin: 0,
      minHeight: '2em',
      cursor: 'none',
      maxWidth: '100%',
    }}>
      <GlitchText text={display} />
    </h1>
  );
}

function Subheadline() {
  const { t } = useLanguage();
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 0.5, y: 0 }}
      transition={{ delay: SUBHEADLINE_DELAY / 1000, duration: 0.7, ease: heroEase }}
      style={{
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 'clamp(0.82rem, 1.5vw, 0.95rem)',
        lineHeight: 1.6,
        letterSpacing: '0.02em',
        color: COLORS.textBone,
        maxWidth: 480,
        margin: 0,
        marginTop: 'clamp(20px, 4vh, 32px)',
      }}
    >
      {t('hero.subheadline')}
    </motion.p>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO — Uses GSAP timeline with scrub (GPU-accelerated, no onUpdate jank)
// ═══════════════════════════════════════════════════════════════════════════

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const ticker = tickerRef.current;
    if (!section || !content) return;

    const overlays = section.querySelectorAll('.hero-overlay');

    const ctx = gsap.context(() => {
      // Use a GSAP timeline with scrub — GSAP handles the interpolation
      // internally (GPU-composited) instead of us setting styles every frame
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8, // slightly laggy = smooth + weighty
        }
      });

      // Content: shrink → rise → fade (using GSAP transforms, not manual style)
      tl.to(content, {
        scale: 0.85,
        duration: 0.5, // first half of timeline
        ease: 'none',
      }, 0);
      tl.to(content, {
        y: -100,
        opacity: 0,
        duration: 0.5, // second half
        ease: 'power1.in',
      }, 0.5);

      // Ticker: just fade
      if (ticker) {
        tl.to(ticker, {
          opacity: 0,
          y: -40,
          duration: 0.5,
          ease: 'none',
        }, 0);
      }

      // Overlays (DataNodes + Pills): move up instead of fading to preserve Safari backdrop-filter
      overlays.forEach(el => {
        tl.to(el, {
          y: -150,
          duration: 0.5,
          ease: 'power1.in',
        }, 0);
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      id="hero"
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
      }}
    >
      {/* Overlays */}
      <div className="hero-overlay" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
      }}>
        <DataNodes />
      </div>
      <div className="hero-overlay" style={{
        position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
      }}>
        <SpecimenPills />
      </div>

      {/* Copy */}
      <div
        ref={contentRef}
        style={{
          flexGrow: 1,
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 clamp(20px, 4vw, 40px)',
          maxWidth: '55vw',
        }}
      >
        <Headline />
        <Subheadline />
      </div>

      {/* Ticker */}
      <div ref={tickerRef} style={{ position: 'relative', zIndex: 10 }}>
        <TerminalTicker />
      </div>
    </motion.section>
  );
}