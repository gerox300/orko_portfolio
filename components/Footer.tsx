'use client';

/**
 * Footer
 * Closure section — "START MUTATION" CTA + email copy + system status.
 *
 * CLOS-01: "START MUTATION" CTA full-width, clamp(2.5rem, 8vw, 8rem) Unbounded
 * CLOS-02: Hover: accent-infrared fills bottom-to-top (600ms, aggro ease)
 * CLOS-03: Click: text scrambles → "[ MUTATION INITIATED ]" → opens Calendly
 * CLOS-04: Email copy → clipboard → "[ COPIED ]" for 2s
 * CLOS-05: "ALL SYSTEMS OPERATIONAL" + system-green pulsing dot
 * CLOS-06: Section enter — GSAP fade-up ScrollTrigger on mount
 * CLOS-15: system-green ONLY used here (verified: not in any other section)
 */

import { useRef, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { COLORS, GSAP_EASE, AUDIO_IDS } from '@/lib/constants';
import { scramble } from '@/lib/textScramble';
import { playSound } from '@/lib/audioEngine';

gsap.registerPlugin(ScrollTrigger);

// Contact email — exception to i18n rule (legal/contact text)
const EMAIL = 'hello@orko.studio';

// Calendly link — placeholder until real URL wired (CLOS-03)
const CALENDLY_URL = 'https://calendly.com/orko_lab/60min';

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  // CTA fill + text refs for GSAP hover
  const ctaFillRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLSpanElement>(null);

  // CTA state
  const [ctaDisplay, setCtaDisplay] = useState('');
  const [isActivated, setIsActivated] = useState(false);
  const cancelScrambleRef = useRef<(() => void) | null>(null);

  // Email copy state
  const [isCopied, setIsCopied] = useState(false);

  // Initialize CTA text after mount (avoids SSR mismatch)
  useEffect(() => {
    setCtaDisplay(t('footer.cta'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Section enter animation (CLOS-06)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        );
      },
    });

    return () => trigger.kill();
  }, []);

  // Cleanup scramble on unmount
  useEffect(() => {
    return () => cancelScrambleRef.current?.();
  }, []);

  // ── CTA hover ──
  const handleCtaEnter = useCallback(() => {
    if (isActivated) return;
    const fill = ctaFillRef.current;
    const text = ctaTextRef.current;
    if (!fill || !text) return;
    gsap.to(fill, { scaleY: 1, duration: 0.6, ease: GSAP_EASE.aggro, overwrite: 'auto' });
    gsap.to(text, { color: COLORS.bgAbyss, duration: 0.25, delay: 0.18, overwrite: 'auto' });
  }, [isActivated]);

  const handleCtaLeave = useCallback(() => {
    if (isActivated) return;
    const fill = ctaFillRef.current;
    const text = ctaTextRef.current;
    if (!fill || !text) return;
    gsap.to(fill, { scaleY: 0, duration: 0.45, ease: 'power2.inOut', overwrite: 'auto' });
    gsap.to(text, { color: COLORS.textBone, duration: 0.2, overwrite: 'auto' });
  }, [isActivated]);

  const handleCtaClick = useCallback(() => {
    if (isActivated) return;
    cancelScrambleRef.current?.();
    playSound(AUDIO_IDS.glitchBurst);

    cancelScrambleRef.current = scramble(
      t('footer.ctaActive'),
      480,
      setCtaDisplay,
      () => {
        setIsActivated(true);
        window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
      },
    );
  }, [isActivated, t]);

  // ── Email copy ──
  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Silently fail if clipboard access denied
    }
  }

  return (
    <footer
      id="footer"
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: COLORS.bgAbyss,
        borderTop: `1px solid ${COLORS.lineAsh}`,
        overflow: 'hidden',
      }}
    >
      {/* ── Status bar (CLOS-05) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: 'clamp(14px, 2vh, 22px) clamp(20px, 4vw, 40px)',
          borderBottom: `1px solid ${COLORS.lineAsh}`,
        }}
      >
        <span
          data-glitchable
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.5rem',
            letterSpacing: '0.2em',
            color: COLORS.textBone,
            opacity: 0.25,
            textTransform: 'uppercase',
          }}
        >
          orko_ — MUTATION LABORATORY
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* System-green status dot — ONLY system-green usage in this section (CLOS-15) */}
          <motion.span
            aria-hidden="true"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.6, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: COLORS.systemGreen,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.5rem',
              letterSpacing: '0.15em',
              color: COLORS.systemGreen,
              textTransform: 'uppercase',
            }}
          >
            {t('footer.systemStatus')}
          </span>
        </div>
      </div>

      {/* ── START MUTATION CTA (CLOS-01, CLOS-02, CLOS-03) ── */}
      <button
        onMouseEnter={handleCtaEnter}
        onMouseLeave={handleCtaLeave}
        onClick={handleCtaClick}
        disabled={isActivated}
        aria-label={isActivated ? t('footer.ctaActive') : t('footer.cta')}
        style={{
          display: 'block',
          width: '100%',
          border: 'none',
          borderBottom: `1px solid ${COLORS.lineAsh}`,
          backgroundColor: 'transparent',
          padding: 'clamp(48px, 9vh, 88px) clamp(20px, 4vw, 40px)',
          position: 'relative',
          overflow: 'hidden',
          cursor: isActivated ? 'default' : 'crosshair',
          textAlign: 'left',
        }}
      >
        {/* Infrared fill layer */}
        <div
          ref={ctaFillRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.accentInfrared,
            transform: 'scaleY(0)',
            transformOrigin: 'bottom center',
            zIndex: 0,
            willChange: 'transform',
          }}
        />

        {/* CTA text */}
        <span
          ref={ctaTextRef}
          data-corruptible
          style={{
            position: 'relative',
            zIndex: 1,
            fontFamily: 'var(--font-headline), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 7.5vw, 8rem)',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: COLORS.textBone,
            lineHeight: 0.88,
            display: 'block',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {ctaDisplay || t('footer.cta')}
        </span>

        {/* Schedule hint */}
        {!isActivated && (
          <span
            aria-hidden="true"
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'block',
              marginTop: 'clamp(16px, 2.5vh, 28px)',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              color: COLORS.textBone,
              opacity: 0.28,
              textTransform: 'uppercase',
            }}
          >
            {t('footer.cursor')}
          </span>
        )}
      </button>

      {/* ── Bottom bar: email copy + legal (CLOS-04) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: 'clamp(14px, 2vh, 22px) clamp(20px, 4vw, 40px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Email address */}
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.62rem',
              letterSpacing: '0.06em',
              color: COLORS.textBone,
              opacity: 0.45,
            }}
          >
            {EMAIL}
          </span>

          {/* Copy button */}
          <button
            onClick={handleCopyEmail}
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.5rem',
              letterSpacing: '0.15em',
              color: isCopied ? COLORS.accentInfrared : COLORS.textBone,
              opacity: isCopied ? 1 : 0.35,
              textTransform: 'uppercase',
              background: 'none',
              border: `1px solid ${isCopied ? COLORS.accentInfrared : COLORS.lineAsh}`,
              padding: '4px 8px',
              cursor: 'crosshair',
              transition: 'color 0.2s ease, opacity 0.2s ease, border-color 0.2s ease',
            }}
          >
            {isCopied ? t('footer.copied') : t('footer.copyEmail')}
          </button>
        </div>

        {/* Legal */}
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.48rem',
            letterSpacing: '0.12em',
            color: COLORS.textBone,
            opacity: 0.18,
            textTransform: 'uppercase',
          }}
        >
          © {new Date().getFullYear()} orko_
        </span>
      </div>
    </footer>
  );
}
