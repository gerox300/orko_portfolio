'use client';

/**
 * ServiceCard
 * Single service card with infrared bottom-to-top fill on hover.
 *
 * Hover animation:
 *   Fill div: scaleY 0 → 1 from transformOrigin: bottom, 600ms, aggro ease
 *   Text color: textBone/infrared → bgAbyss, delay 150ms, 250ms
 *   On leave: reverse — fill scaleY → 0, text reverts
 *
 * Props:
 *   number      — "01" to "04"
 *   title       — service name (translated)
 *   description — service description (translated)
 */

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { COLORS, GSAP_EASE, AUDIO_IDS } from '@/lib/constants';
import { playSound } from '@/lib/audioEngine';

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
}

export function ServiceCard({ number, title, description }: ServiceCardProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const handleMouseEnter = useCallback(() => {
    const fill = fillRef.current;
    const num = numberRef.current;
    const ttl = titleRef.current;
    const dsc = descRef.current;
    if (!fill || !ttl) return;

    playSound(AUDIO_IDS.hoverBeep);

    gsap.killTweensOf([fill, num, ttl, dsc]);

    // Scramble title effect
    let iteration = 0;
    const maxIterations = 8;
    const originalText = title;
    const interval = setInterval(() => {
      if (iteration >= maxIterations) {
        clearInterval(interval);
        ttl.innerText = originalText;
      } else {
        ttl.innerText = originalText
          .split('')
          .map((char) => {
            if (char === ' ') return ' ';
            return '░▒▓█▐▌╳·'[Math.floor(Math.random() * 8)];
          })
          .join('');
      }
      iteration++;
    }, 30);

    // Infrared fill: bottom → top, 600ms, aggro ease
    gsap.to(fill, {
      scaleY: 1,
      duration: 0.6,
      ease: GSAP_EASE.aggro,
    });

    // Text → bgAbyss (delayed to match when fill reaches text)
    gsap.to([num, ttl, dsc], {
      color: COLORS.bgAbyss,
      duration: 0.25,
      delay: 0.18,
    });
  }, [title]);

  const handleMouseLeave = useCallback(() => {
    const fill = fillRef.current;
    const num = numberRef.current;
    const ttl = titleRef.current;
    const dsc = descRef.current;
    if (!fill || !ttl) return;

    gsap.killTweensOf([fill, num, ttl, dsc]);
    
    // Ensure title reverted in case scramble was running
    ttl.innerText = title;

    // Retract fill
    gsap.to(fill, {
      scaleY: 0,
      duration: 0.45,
      ease: 'power2.inOut',
    });

    // Revert text colors
    gsap.to(num, { color: COLORS.accentInfrared, duration: 0.2 });
    gsap.to([ttl, dsc], { color: COLORS.textBone, duration: 0.2 });
  }, [title]);

  return (
    <motion.div
      data-card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        boxShadow: [
          `inset 0 0 0 1px ${COLORS.lineAsh}`,
          `inset 0 0 0 1px #2C2C2C`,
          `inset 0 0 0 1px ${COLORS.lineAsh}`,
        ],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'relative',
        border: `1px solid ${COLORS.lineAsh}`,
        padding: 'clamp(24px, 3.5vh, 36px) clamp(20px, 2.5vw, 28px)',
        overflow: 'hidden',
        cursor: 'crosshair',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        minHeight: 'clamp(320px, 45vh, 400px)',
      }}
    >
      {/* Infrared fill layer */}
      <div
        ref={fillRef}
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

      {/* Card content — above fill */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Number */}
        <span
          ref={numberRef}
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: COLORS.accentInfrared,
            opacity: 0.75,
            display: 'block',
            marginBottom: 20,
          }}
        >
          {number}
        </span>

        {/* Title */}
        <h3
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-headline), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(0.82rem, 1.4vw, 1.05rem)',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: COLORS.textBone,
            margin: 0,
            marginBottom: 14,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          ref={descRef}
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
            lineHeight: 1.7,
            color: COLORS.textBone,
            opacity: 0.52,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}
