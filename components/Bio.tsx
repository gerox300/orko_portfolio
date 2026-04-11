'use client';

/**
 * Bio — "The Operator"
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { COLORS } from '@/lib/constants';
import { IDCard } from '@/components/bio/IDCard';
import { StatBar } from '@/components/bio/StatBar';
import { GlitchText } from '@/components/GlitchText';
import type { DictionaryKey } from '@/lib/i18n';

gsap.registerPlugin(ScrollTrigger);

const STATS: { key: DictionaryKey; pct: number }[] = [
  { key: 'bio.stat.research', pct: 99 },
  { key: 'bio.stat.development', pct: 90 },
  { key: 'bio.stat.artDirection', pct: 95 },
  { key: 'bio.stat.automation', pct: 83 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const viewportOpts = { once: true, amount: 0.25 };

// ─── Bio ──────────────────────────────────────────────────────────────────

export function Bio() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const trigger = ScrollTrigger.create({
      trigger: section, start: 'bottom 40%', end: 'bottom top', scrub: 0.6,
      onUpdate: (self) => { gsap.set(section, { opacity: 1 - self.progress * 0.4 }); },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bio"
      aria-label="Bio — The Operator"
      style={{
        position: 'relative',
        // Total transparency so spores and texture bleed through 100%
        backgroundColor: 'transparent',
        padding: 'clamp(72px, 12vh, 120px) clamp(20px, 4vw, 40px)',
        overflow: 'hidden',
        zIndex: 3,
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'clamp(280px, 60%, 700px) 1fr',
        gap: isMobile ? '32px' : 'clamp(40px, 6vw, 80px)', 
        alignItems: 'start',
        position: 'relative', zIndex: 1,
      }}>
        {/* Left Column: Headers + Body + Stats — order:2 on mobile so card shows first */}
        <div style={{ order: isMobile ? 2 : 1 }}>
          <motion.div
            initial="hidden" whileInView="visible" viewport={viewportOpts} variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 'calc(0.55rem + 3px)',
              letterSpacing: '0.2em', color: COLORS.textBone, opacity: 1,
              textTransform: 'uppercase', marginBottom: 'clamp(16px, 2.5vh, 24px)',
            }}
          >
            {t('bio.label')}
          </motion.div>

          <motion.h2
            initial="hidden" whileInView="visible" viewport={viewportOpts} variants={fadeUp}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-headline), sans-serif', fontWeight: 700,
              fontSize: 'clamp(1.4rem, 4vw, 3rem)', letterSpacing: '-0.02em',
              textTransform: 'uppercase', color: COLORS.textBone, margin: 0,
              marginBottom: 'clamp(40px, 6vh, 56px)', lineHeight: 1.05,
            }}
          >
            <GlitchText text={t('bio.role')} />
          </motion.h2>

          <motion.p
            initial="hidden" whileInView="visible" viewport={viewportOpts} variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 'clamp(0.75rem, 1.4vw, 0.92rem)', lineHeight: 1.8,
              letterSpacing: '0.01em', color: COLORS.textBone, opacity: 0.6,
              margin: 0, marginBottom: 'clamp(40px, 6vh, 56px)', maxWidth: 600,
            }}
          >
            {t('bio.body')}
          </motion.p>

          <div>
            {STATS.map(({ key, pct }, i) => (
              <motion.div key={key} initial="hidden" whileInView="visible" viewport={viewportOpts}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}>
                <StatBar label={t(key)} targetPct={pct} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: ID Card — order:1 on mobile so it renders above text */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={viewportOpts} variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'center',
            paddingTop: isMobile ? 0 : 'clamp(40px, 8vh, 80px)',
            order: isMobile ? 1 : 2,
          }}
        >
          <IDCard />
        </motion.div>
      </div>
    </section>
  );
}