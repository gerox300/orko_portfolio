'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { COLORS } from '@/lib/constants';
import { ServiceCard } from '@/components/services/ServiceCard';
import { PerspectiveGrid } from '@/components/services/PerspectiveGrid';
import { GlitchText } from '@/components/GlitchText';

gsap.registerPlugin(ScrollTrigger);

const SERVICE_NUMBERS = ['01', '02', '03', '04'] as const;

export function Services() {
  const { t } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const cards = wrapper.querySelectorAll('[data-card]');
    if (!cards.length) return;

    // On mobile: no pin, no GSAP scrub — cards are always visible
    if (window.innerWidth < 768) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    // Use GSAP Context for React 18+ strict mode cleanup
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(cards, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // smooth scrubbing
        },
      });

      tl.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.18,
        ease: 'power2.out',
        duration: 0.6,
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div
      id="services-wrapper"
      ref={wrapperRef}
      style={{
        position: 'relative',
        // Desktop: 200vh gives the scroll-scrub effect; mobile: auto (normal flow)
        height: isMobile ? 'auto' : '200vh',
        backgroundColor: 'transparent',
      }}
    >
      <section
        id="services"
        ref={sectionRef}
        aria-label="Services — Mutation Vectors"
        style={{
          // Desktop: sticky pin so cards reveal over 200vh; mobile: normal flow
          position: isMobile ? 'relative' : 'sticky',
          top: isMobile ? 'auto' : 0,
          height: isMobile ? 'auto' : '100vh',
          minHeight: isMobile ? 'auto' : undefined,
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile
            ? 'clamp(64px, 10vh, 96px) clamp(20px, 4vw, 40px) clamp(48px, 8vh, 80px)'
            : 'clamp(64px, 10vh, 100px) clamp(20px, 4vw, 40px)',
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

          {/* Cards grid — 1 col on mobile, auto-fit on desktop */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: isMobile ? 'clamp(10px, 2vh, 16px)' : 'clamp(12px, 1.5vw, 20px)',
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
    </div>
  );
}
