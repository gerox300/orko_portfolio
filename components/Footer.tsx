'use client';

/**
 * Footer
 * Closure section — "START MUTATION" CTA + email copy + system status.
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

const EMAIL = 'geronimo.astorga@gmail.com';
const CALENDLY_URL = 'https://calendly.com/orko_lab/60min';

export function Footer() {
  const { t, lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const ctaFillRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLSpanElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);

  const [ctaDisplay, setCtaDisplay] = useState(() => t('footer.cta'));
  const [isMobile, setIsMobile] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const cancelScrambleRef = useRef<(() => void) | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const STATUS_STEPS = [
    t('footer.step1'),
    t('footer.step2'),
    t('footer.step3'),
    t('footer.step4'),
  ];

  useEffect(() => {
    if (!isActivated) setCtaDisplay(t('footer.cta'));
  }, [t, isActivated]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(section,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        );
      },
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    return () => cancelScrambleRef.current?.();
  }, []);

  const handleCtaEnter = useCallback(() => {
    if (isActivated) return;
    const fill = ctaFillRef.current;
    const text = ctaTextRef.current;
    if (!fill || !text) return;
    gsap.killTweensOf([fill, text]);
    gsap.to(fill, { scaleY: 1, duration: 0.6, ease: GSAP_EASE.aggro });
    gsap.to(text, { color: COLORS.bgAbyss, duration: 0.25, delay: 0.18 });
    if (ctaWrapperRef.current) gsap.to(ctaWrapperRef.current, { color: COLORS.bgAbyss, duration: 0.25, delay: 0.18 });
  }, [isActivated]);

  const handleCtaLeave = useCallback(() => {
    if (isActivated) return;
    const fill = ctaFillRef.current;
    const text = ctaTextRef.current;
    if (!fill || !text) return;
    gsap.killTweensOf([fill, text]);
    gsap.to(fill, { scaleY: 0, duration: 0.45, ease: 'power2.inOut' });
    gsap.to(text, { color: COLORS.textBone, duration: 0.2 });
    if (ctaWrapperRef.current) gsap.to(ctaWrapperRef.current, { color: COLORS.textBone, duration: 0.2 });
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
        setIsProcessing(true);
        setStatusText(STATUS_STEPS[0]);
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
                if (ctaWrapperRef.current) gsap.to(ctaWrapperRef.current, { color: COLORS.textBone, duration: 0.2 });
              }
            }, 1000);
          }
        };
        requestAnimationFrame(update);
      },
    );
  }, [isActivated, isProcessing, t, STATUS_STEPS]);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch { }
  }

  // Partir el texto en dos palabras para el layout izquierda/derecha
  const ctaParts = ctaDisplay.split(' ');
  const isTwoWords = ctaParts.length === 2 && !isActivated;

  return (
    <footer
      id="footer"
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: 'transparent',
        borderTop: `1px solid ${COLORS.lineAsh}`,
        overflow: 'hidden',
      }}
    >
      {/* Status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        padding: 'clamp(14px, 2vh, 22px) clamp(20px, 4vw, 40px)',
        borderBottom: `1px solid ${COLORS.lineAsh}`,
      }}>
        <span data-glitchable style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '0.8rem', letterSpacing: '0.2em',
          color: COLORS.textBone, opacity: 0.6, textTransform: 'uppercase',
        }}>
          {t('footer.labLabel')}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.span
            aria-hidden="true"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.6, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              display: 'inline-block', width: 6, height: 6,
              borderRadius: '50%', backgroundColor: COLORS.systemGreen, flexShrink: 0,
            }}
          />
          <span style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.75rem', letterSpacing: '0.15em',
            color: COLORS.systemGreen, textTransform: 'uppercase',
          }}>
            {t('footer.systemStatus')}
          </span>
        </div>
      </div>

      {/* CTA button */}
      <button
        onMouseEnter={handleCtaEnter}
        onMouseLeave={handleCtaLeave}
        onClick={handleCtaClick}
        disabled={isActivated}
        key={lang}
        aria-label={isActivated ? t('footer.ctaActive') : t('footer.cta')}
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          width: '100%',
          minHeight: 'clamp(160px, 25vh, 440px)',
          border: 'none',
          borderBottom: `1px solid ${COLORS.lineAsh}`,
          backgroundColor: 'transparent',
          padding: 'clamp(32px, 5vh, 64px) clamp(20px, 4vw, 40px)',
          position: 'relative', overflow: 'hidden',
          cursor: isActivated ? 'default' : 'crosshair',
          textAlign: 'left',
        }}
      >
        {/* Infrared fill */}
        <div
          ref={ctaFillRef}
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: COLORS.accentInfrared,
            transform: 'scaleY(0)', transformOrigin: 'bottom center',
            zIndex: 0, willChange: 'transform',
          }}
        />

        {/* Schedule hint */}
        {!isActivated && (
          <span aria-hidden="true" style={{
            position: 'relative', zIndex: 1, display: 'block',
            marginBottom: 'clamp(12px, 2vh, 20px)',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 'min(1.2rem, 4.5vw)', letterSpacing: '0.22em',
            color: '#FFFFFF', opacity: 0.9, textTransform: 'uppercase',
          }}>
            {t('footer.cursor')}
          </span>
        )}

        {/* CTA text
            FIX: el layout space-between va en un div wrapper estático.
            motion.span solo maneja el color via GSAP ref — no toca el layout.
        */}
        <div
          ref={ctaWrapperRef}
          style={{
            position: 'relative', zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: (isTwoWords && lang === 'en') ? 'space-between' : 'flex-start',
            gap: (isTwoWords && lang === 'es') ? 'clamp(0.5rem, 2vw, 2rem)' : 0,
            color: COLORS.textBone,
          }}
        >
          {isTwoWords ? (
            <>
              <span
                ref={ctaTextRef}
                data-corruptible
                style={{
                  fontFamily: 'var(--font-headline), sans-serif',
                  fontWeight: 700,
                  fontSize: lang === 'es'
                    ? 'clamp(2rem, 6vw, 6.5rem)'
                    : 'clamp(2rem, 7.5vw, 8rem)',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'inherit',
                  lineHeight: 0.88,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {ctaParts[0]}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-headline), sans-serif',
                  fontWeight: 700,
                  fontSize: lang === 'es'
                    ? 'clamp(2rem, 6vw, 6.5rem)'
                    : 'clamp(2rem, 7.5vw, 8rem)',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: 'inherit',
                  lineHeight: 0.88,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {ctaParts[1]}
              </span>
            </>
          ) : (
            <motion.span
              ref={ctaTextRef}
              data-corruptible
              style={{
                fontFamily: 'var(--font-headline), sans-serif',
                fontWeight: 700,
                fontSize: lang === 'es'
                  ? (isActivated ? 'clamp(1.5rem, 5.5vw, 5.5rem)' : 'clamp(1.5rem, 6.8vw, 6.8rem)')
                  : (isActivated ? 'clamp(1.5rem, 5.5vw, 6rem)' : 'clamp(2rem, 7.5vw, 8rem)'),
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: COLORS.textBone,
                lineHeight: 0.88,
                userSelect: 'none',
              }}
            >
              {ctaDisplay}
            </motion.span>
          )}
        </div>

        {/* Handshake Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
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
                  fontSize: '0.55rem', letterSpacing: '0.2em',
                  color: COLORS.accentInfrared, display: 'block', marginBottom: 4, opacity: 0.8,
                }}>
                  [ CALL_HANDSHAKE_INIT ]
                </span>
                <span style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.75rem', letterSpacing: '0.05em',
                  color: COLORS.textBone, display: 'block', fontWeight: 600,
                }}>
                  {statusText}
                </span>
              </div>
              <div style={{
                height: 4, backgroundColor: 'rgba(240,240,240,0.1)',
                position: 'relative', overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  style={{
                    height: '100%', backgroundColor: COLORS.accentInfrared,
                    boxShadow: `0 0 10px ${COLORS.accentInfrared}`,
                  }}
                />
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.45rem', color: COLORS.textBone, opacity: 0.3,
                }}>PORT_8080:CONNECTED</span>
                <span style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.45rem', color: COLORS.textBone, opacity: 0.3,
                }}>{Math.round(progress * 100)}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Bottom bar */}
      <div style={{
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: 'wrap', gap: isMobile ? 8 : 12,
        padding: 'clamp(14px, 2vh, 22px) clamp(20px, 4vw, 40px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: isMobile ? 'clamp(0.65rem, 3.5vw, 0.8rem)' : 'clamp(0.8rem, 1.5vw, 1rem)',
            letterSpacing: '0.06em',
            color: COLORS.textBone, opacity: 0.8,
          }}>
            {EMAIL}
          </span>
          {/* Copy button — 44px min touch target on mobile */}
          <button
            onClick={handleCopyEmail}
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.75rem', letterSpacing: '0.15em',
              color: isCopied ? COLORS.systemGreen : COLORS.textBone,
              opacity: isCopied ? 1 : 0.65,
              textTransform: 'uppercase',
              background: 'none',
              border: isMobile ? `1px solid ${isCopied ? COLORS.systemGreen : COLORS.lineAsh}` : 'none',
              padding: isMobile ? '10px 14px' : '4px 8px',
              minHeight: isMobile ? '44px' : undefined,
              cursor: 'crosshair',
              transition: 'color 0.2s ease, opacity 0.2s ease, border-color 0.2s ease',
            }}
          >
            {isCopied ? t('footer.copied') : t('footer.copyEmail')}
          </button>
        </div>
        <span style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '0.55rem', letterSpacing: '0.12em',
          color: '#B0B0B0', opacity: 0.7, textTransform: 'uppercase',
        }}>
          © {new Date().getFullYear()} orko_ — {t('footer.rights')}
        </span>
      </div>
    </footer>
  );
}