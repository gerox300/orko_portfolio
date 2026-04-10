'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@/lib/constants';

/**
 * SpecimenPills — Floating capability tags that orbit around the headline area.
 * 
 * Behavior: 
 * - Pills appear one at a time with a digital "materialization" effect
 * - Each pill lives for a few seconds, then dissolves and a new one spawns elsewhere
 * - At most 3 pills visible simultaneously — keeps it sparse and clinical
 * - Each pill has a subtle float drift (Framer spring) so they feel alive
 * - On hover: pill glitches with RGB split then stabilizes
 */

const SPECIMENS = [
  'WEB DESIGN',
  'BRANDING',
  'LOGO DESIGN',
  'WRITING',
  'AUTOMATIONS',
  'CULTURAL RESEARCH',
  'VISUAL IDENTITY',
  'ART DIRECTION',
];

// Predefined spawn zones (relative to the container) — scattered around the headline
// These avoid the headline area (left side, vertically centered) and the video (right side)
const SPAWN_ZONES = [
  { top: '8%', left: '2%' },
  { top: '15%', left: '28%' },
  { top: '5%', left: '42%' },
  { top: '32%', left: '38%' },
  { top: '72%', left: '5%' },
  { top: '78%', left: '25%' },
  { top: '65%', left: '38%' },
  { top: '85%', left: '42%' },
  { top: '45%', left: '42%' },
  { top: '55%', left: '2%' },
];

interface ActivePill {
  id: number;
  label: string;
  zone: { top: string; left: string };
  driftX: number;
  driftY: number;
}

function Pill({ label, zone, driftX, driftY, onComplete }: {
  label: string;
  zone: { top: string; left: string };
  driftX: number;
  driftY: number;
  onComplete: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const charsRef = useRef(0);

  // Character-by-character type-in effect on mount
  useEffect(() => {
    const interval = setInterval(() => {
      charsRef.current += 1;
      if (charsRef.current <= label.length) {
        // Mix random chars with revealed chars for digital materialization
        const revealed = label.slice(0, charsRef.current);
        const scrambled = Array.from(
          { length: Math.max(0, label.length - charsRef.current) },
          () => '░▒▓█▐▌╳·'[Math.floor(Math.random() * 9)]
        ).join('');
        setDisplayText(revealed + scrambled);
      } else {
        setDisplayText(label);
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [label]);

  // Auto-dismiss after visible duration
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500 + Math.random() * 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        x: [0, driftX, 0, -driftX * 0.5, 0],
        y: [0, driftY, 0, -driftY * 0.7, 0],
        z: 0, // Force 3D transform for hardware acceleration
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        filter: 'blur(6px)',
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        filter: { duration: 0.4 },
        x: { duration: 12 + Math.random() * 6, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 10 + Math.random() * 5, repeat: Infinity, ease: 'easeInOut' },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        top: zone.top,
        left: zone.left,
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: '0.6rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isHovered ? COLORS.bgAbyss : COLORS.textBone,
        backgroundColor: isHovered ? COLORS.accentInfrared : 'rgba(5, 5, 5, 0.6)',
        border: `1px solid ${isHovered ? COLORS.accentInfrared : 'rgba(240, 240, 240, 0.12)'}`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        willChange: 'transform, filter',
        padding: '6px 14px',
        whiteSpace: 'nowrap',
        pointerEvents: 'auto',
        cursor: 'none',
        transition: 'color 150ms, background-color 150ms, border-color 150ms',
        textShadow: isHovered
          ? `1px 0 0 rgba(0,255,65,0.5), -1px 0 0 rgba(255,42,0,0.5)`
          : 'none',
      }}
    >
      <span style={{ opacity: 0.4, marginRight: 6, color: COLORS.accentInfrared }}>●</span>
      {displayText}
    </motion.div>
  );
}

export function SpecimenPills() {
  const [activePills, setActivePills] = useState<ActivePill[]>([]);
  const counterRef = useRef(0);
  const usedLabelsRef = useRef<Set<string>>(new Set());
  const usedZonesRef = useRef<Set<number>>(new Set());

  const spawnPill = () => {
    // Pick a label not currently visible
    const available = SPECIMENS.filter(s => !usedLabelsRef.current.has(s));
    if (available.length === 0) {
      usedLabelsRef.current.clear();
      return;
    }
    const label = available[Math.floor(Math.random() * available.length)];

    // Pick a zone not currently occupied
    const availableZones = SPAWN_ZONES.map((z, i) => i).filter(i => !usedZonesRef.current.has(i));
    const zoneIndex = availableZones.length > 0
      ? availableZones[Math.floor(Math.random() * availableZones.length)]
      : Math.floor(Math.random() * SPAWN_ZONES.length);
    const zone = SPAWN_ZONES[zoneIndex];

    const id = counterRef.current++;
    usedLabelsRef.current.add(label);
    usedZonesRef.current.add(zoneIndex);

    const newPill: ActivePill = {
      id,
      label,
      zone,
      driftX: 4 + Math.random() * 8,
      driftY: 3 + Math.random() * 6,
    };

    setActivePills(prev => [...prev, newPill]);
  };

  const removePill = (id: number) => {
    setActivePills(prev => {
      const pill = prev.find(p => p.id === id);
      if (pill) {
        usedLabelsRef.current.delete(pill.label);
        const zoneIdx = SPAWN_ZONES.findIndex(
          z => z.top === pill.zone.top && z.left === pill.zone.left
        );
        if (zoneIdx >= 0) usedZonesRef.current.delete(zoneIdx);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  // Spawn cycle — stagger initial pills, then keep spawning
  useEffect(() => {
    // Initial stagger: spawn 3 pills with delay
    const timers = [
      setTimeout(spawnPill, 800),
      setTimeout(spawnPill, 1800),
      setTimeout(spawnPill, 3000),
    ];

    // Continuous spawning
    const interval = setInterval(() => {
      setActivePills(prev => {
        if (prev.length < 3) {
          // Use setTimeout to avoid setState-in-render
          setTimeout(spawnPill, 0);
        }
        return prev;
      });
    }, 2000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="popLayout">
        {activePills.map(pill => (
          <Pill
            key={pill.id}
            label={pill.label}
            zone={pill.zone}
            driftX={pill.driftX}
            driftY={pill.driftY}
            onComplete={() => removePill(pill.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}