'use client';

/**
 * Services
 * "MUTATION VECTORS" — 4 service cards with GSAP ScrollTrigger pin.
 *
 * Layout:
 *   Section label + title above a 4-column card grid
 *   Desktop (≥960px): 4 cards in a row
 *   Tablet (480-960px): 2×2 grid
 *   Mobile (<480px): single column
 *
 * GSAP Pin:
 *   trigger: #services, pin: true, start: 'top top', end: '+=100%'
 *   scrub: 0.8 — cards reveal staggered across 1 viewport of scroll
 *
 * Cards start at opacity:0, y:40 and animate in via stagger.
 * Hover animation (infrared fill + text invert) lives in ServiceCard.
 *
 * PerspectiveGrid renders as absolute overlay behind the cards.
 */

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { COLORS } from '@/lib/constants';
import { ServiceCard } from '@/components/services/ServiceCard';
import { PerspectiveGrid } from '@/components/services/PerspectiveGrid';
import { GlitchText } from '@/components/GlitchText';

gsap.registerPlugin(ScrollTrigger);

// ─── Service data ─────────────────────────────────────────────────────────────

const SERVICE_NUMBERS = ['01', '02', '03', '04'] as const;

// ─── Services ─────────────────────────────────────────────────────────────────

export function Services() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const services = [
    {
      number: '01',
      title: t('services.brand.title'),
      description: t('services.brand.desc'),
    },
    {
      number: '02',
      title: t('services.research.title'),
      description: t('services.research.desc'),
    },
    {
      number: '03',
      title: t('services.digital.title'),
      description: t('services.digital.desc'),
    },
    {
      number: '04',
      title: t('services.ai.title'),
      description: t('services.ai.desc'),
    },
  ] as const;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('[data-card]');
    if (!cards.length) return;

    // Initial state — cards hidden below
    gsap.set(cards, { opacity: 0, y: 40 });

    // Reveal timeline — staggered across the pin scroll range
    const tl = gsap.timeline({ paused: true });
    tl.to(cards, {
      opacity: 1,
      y: 0,
      stagger: 0.18,
      ease: 'power2.out',
      duration: 0.6,
    });

    // Pin the section; animate cards in as user scrolls through
    const trigger = ScrollTrigger.create({
      trigger: section,
      pin: true,
      pinSpacing: true,
      start: 'top top',
      end: '+=100%',
      scrub: 0.8,
      animation: tl,
    });

    return () => {
      tl.kill();
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Services — Mutation Vectors"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: COLORS.bgAbyss,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(64px, 10vh, 100px) clamp(20px, 4vw, 40px)',
        overflow: 'hidden',
      }}
    >
      {/* Perspective grid — behind cards */}
      <PerspectiveGrid />

      {/* Content — above grid */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 'calc(0.55rem + 3px)',
            letterSpacing: '0.2em',
            color: COLORS.textBone,
            textTransform: 'uppercase',
            marginBottom: 'clamp(14px, 2vh, 20px)',
          }}
        >
          {t('services.sectionLabel')}
        </motion.div>

        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-headline), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.4rem, 4vw, 3rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: COLORS.textBone,
            margin: 0,
            marginBottom: 'clamp(36px, 6vh, 56px)',
            lineHeight: 1.05,
          }}
        >
          <GlitchText text={t('services.sectionTitle')} />
        </motion.h2>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(12px, 1.5vw, 20px)',
          }}
        >
          {services.map((service) => (
            <ServiceCard
              key={service.number}
              number={service.number}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
