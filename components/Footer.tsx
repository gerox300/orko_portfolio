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
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { COLORS, GSAP_EASE, AUDIO_IDS } from '@/lib/constants';
import { scramble } from '@/lib/textScramble';
import { playSound } from '@/lib/audioEngine';

gsap.registerPlugin(ScrollTrigger);

// Contact email — exception to i18n rule (legal/contact text)
const EMAIL = 'geronimo.astorga@gmail.com';

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

  // Processing state for Handshake
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const STATUS_STEPS = [
    'ESTABLISHING_VECTORS...',
    'PINGING_AVAILABILITY_LAB...',
    'ENCRYPTING_HANDSHAKE...',
    'OPENING_BOOKING_PORTAL...',
  ];

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
    gsap.killTweensOf([fill, text]);
    gsap.to(fill, { scaleY: 1, duration: 0.6, ease: GSAP_EASE.aggro });
    gsap.to(text, { color: COLORS.bgAbyss, duration: 0.25, delay: 0.18 });
  }, [isActivated]);

  const handleCtaLeave = useCallback(() => {
    if (isActivated) return;
    const fill = ctaFillRef.current;
    const text = ctaTextRef.current;
    if (!fill || !text) return;
    gsap.killTweensOf([fill, text]);
    gsap.to(fill, { scaleY: 0, duration: 0.45, ease: 'power2.inOut' });
    gsap.to(text, { color: COLORS.textBone, duration: 0.2 });
  }, [isActivated]);

  const handleCtaClick = useCallback(() => {
    if (isActivated || isProcessing) return;
    setIsActivated(true);
    cancelScrambleRef.current?.();
    playSound(AUDIO_IDS.glitchBurst);

    cancelScrambleRef.current = scramble(
      t('footer.ctaActive'),
      480,
      setCtaDisplay,
      () => {
        // Scramble done! Now start the process
        setIsProcessing(true);
        setStatusText(STATUS_STEPS[0]);
        
        // Progress bar simulation
        const duration = 2800;
        const startTime = Date.now();
        
        const update = () => {
          const elapsed = Date.now() - startTime;
          const p = Math.min(1, elapsed / duration);
          setProgress(p);
          
          const stepIdx = Math.floor(p * STATUS_STEPS.length);
          if (stepIdx < STATUS_STEPS.length) setStatusText(STATUS_STEPS[stepIdx]);

          if (p < 1) {
            requestAnimationFrame(update);
          } else {
            // DONE! Open the portal
            window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
            
            setTimeout(() => {
              setIsProcessing(false);
              setIsActivated(false);
              setProgress(0);
              setCtaDisplay(t('footer.cta'));
              
              const fill = ctaFillRef.current;
              const text = ctaTextRef.current;
              if (fill && text) {
                gsap.killTweensOf([fill, text]);
                gsap.to(fill, { scaleY: 0, duration: 0.45, ease: 'power2.inOut' });
                gsap.to(text, { color: COLORS.textBone, duration: 0.2 });
              }
            }, 1000);
          }
        };
        requestAnimationFrame(update);
      },
    );
  }, [isActivated, isProcessing, t]);

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
            fontSize: '1rem', // Enlarged
            letterSpacing: '0.2em',
            color: COLORS.textBone,
            opacity: 0.6,
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
              fontSize: '0.95rem', // Enlarged
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          minHeight: 'clamp(240px, 35vh, 440px)', // Stable height
          border: 'none',
          borderBottom: `1px solid ${COLORS.lineAsh}`,
          backgroundColor: 'transparent',
          padding: 'clamp(32px, 5vh, 64px) clamp(20px, 4vw, 40px)',
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

        {/* Schedule hint - NOW ABOVE (Positioned relative to button flex) */}
        {!isActivated && (
          <span
            aria-hidden="true"
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'block',
              marginBottom: 'clamp(12px, 2vh, 20px)',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 'min(1.2rem, 4.5vw)', // Enlarged
              letterSpacing: '0.22em',
              color: '#FFFFFF',
              opacity: 0.9,
              textTransform: 'uppercase',
            }}
          >
            {t('footer.cursor')}
          </span>
        )}

        {/* CTA text */}
        <span
          ref={ctaTextRef}
          data-corruptible
          style={{
            position: 'relative',
            zIndex: 1,
            fontFamily: 'var(--font-headline), sans-serif',
            fontWeight: 700,
            fontSize: isActivated ? 'clamp(1.5rem, 5.5vw, 6rem)' : 'clamp(2rem, 7.5vw, 8rem)',
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

        {/* ── Handshake Overlay ── */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                backgroundColor: 'rgba(5, 5, 5, 0.92)',
                border: `1px solid ${COLORS.accentInfrared}`,
                backdropFilter: 'blur(12px)',
                width: 'clamp(280px, 40vw, 400px)',
                padding: '24px 28px',
                boxShadow: `0 24px 48px rgba(0,0,0,0.5), 0 0 20px ${COLORS.accentInfrared}33`,
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <span style={{ 
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.2em',
                  color: COLORS.accentInfrared,
                  display: 'block',
                  marginBottom: 4,
                  opacity: 0.8
                }}>
                  [ CALL_HANDSHAKE_INIT ]
                </span>
                <span style={{ 
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  color: COLORS.textBone,
                  display: 'block',
                  fontWeight: 600
                }}>
                  {statusText}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div style={{ 
                height: 4, 
                backgroundColor: 'rgba(240,240,240,0.1)', 
                position: 'relative',
                overflow: 'hidden'
              }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  style={{ 
                    height: '100%', 
                    backgroundColor: COLORS.accentInfrared,
                    boxShadow: `0 0 10px ${COLORS.accentInfrared}`
                  }}
                />
              </div>

              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ 
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.45rem',
                  color: COLORS.textBone,
                  opacity: 0.3
                }}>
                  PORT_8080:CONNECTED
                </span>
                <span style={{ 
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.45rem',
                  color: COLORS.textBone,
                  opacity: 0.3
                }}>
                  {Math.round(progress * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
              letterSpacing: '0.06em',
              color: COLORS.textBone,
              opacity: 0.8,
            }}
          >
            {EMAIL}
          </span>

          {/* Copy button */}
          <button
            onClick={handleCopyEmail}
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: isCopied ? COLORS.systemGreen : COLORS.textBone,
              opacity: isCopied ? 1 : 0.65,
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              padding: '4px 8px',
              cursor: 'crosshair',
              transition: 'color 0.2s ease, opacity 0.2s ease',
            }}
          >
            {isCopied ? '[ COPIED! ]' : '[ COPY EMAIL ]'}
          </button>
        </div>

        {/* Legal */}
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.55rem', // Smaller
            letterSpacing: '0.12em',
            color: '#B0B0B0',
            opacity: 0.7,
            textTransform: 'uppercase',
          }}
        >
          © {new Date().getFullYear()} orko_ — ALL RIGHTS RESERVED
        </span>
      </div>
    </footer>
  );
}
