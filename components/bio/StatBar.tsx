'use client';

/**
 * StatBar
 * Single stat row: label + percentage fill bar.
 *
 * Animation: GSAP ScrollTrigger (once: true) fires when bar enters viewport.
 * The fill scaleX animates from 0 → (targetPct/100) over 1.2s.
 * The counter increments from 0 → targetPct in sync.
 *
 * Props:
 *   label     — translated stat name (e.g., "RESEARCH")
 *   targetPct — 0-100 percentage the bar fills to
 */

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COLORS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface StatBarProps {
  label: string;
  targetPct: number; // 0-100
}

export function StatBar({ label, targetPct }: StatBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    const counter = counterRef.current;
    if (!fill || !counter) return;

    // Initial state — hidden
    gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' });

    const proxy = { value: 0 };

    const tween = gsap.to(proxy, {
      value: targetPct,
      duration: 1.2,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        fill.style.transform = `scaleX(${proxy.value / 100})`;
        fill.style.transformOrigin = 'left center';
        counter.textContent = `${Math.round(proxy.value)}%`;
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: fill,
      start: 'top 88%',
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      tween.kill();
      trigger.kill();
    };
  }, [targetPct]);

  return (
    <div style={{ marginBottom: 22 }}>
      {/* Label + counter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 7,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.58rem',
            letterSpacing: '0.16em',
            color: COLORS.textBone,
            opacity: 0.45,
          }}
        >
          {label}
        </span>
        <span
          ref={counterRef}
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: COLORS.accentInfrared,
            opacity: 0.85,
            minWidth: '2.5ch',
            textAlign: 'right',
          }}
        >
          0%
        </span>
      </div>

      {/* Track */}
      <div
        style={{
          position: 'relative',
          height: 1,
          backgroundColor: COLORS.lineAsh,
          overflow: 'hidden',
        }}
      >
        {/* Fill */}
        <div
          ref={fillRef}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.textBone,
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  );
}
