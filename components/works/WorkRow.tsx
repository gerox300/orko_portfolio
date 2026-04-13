'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, AUDIO_IDS } from '@/lib/constants';
import { playSound } from '@/lib/audioEngine';
import type { CardProject } from './FloatingCard';

const GRID_COLS_DESKTOP = '48px 1fr 200px 150px 72px';
const GRID_COLS_MOBILE = '48px 1fr 56px';

interface WorkRowProps {
  project: CardProject;
  number: string;
  index: number;
  isDimmed: boolean;
  isMobile: boolean;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onOpenProject?: () => void;
}

export function WorkRow({
  project,
  number,
  index,
  isDimmed,
  isMobile,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onOpenProject,
}: WorkRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile) {
      setIsExpanded((prev) => !prev);
    } else {
      onMouseEnter(e);
      onClick();
    }
  }

  const rowStyle: React.CSSProperties = {
    borderBottom: `1px ${index % 3 === 2 ? 'dashed' : 'solid'} ${COLORS.lineAsh}`,
    opacity: isDimmed ? 0.25 : 1,
    transition: 'opacity 0.3s ease',
    cursor: isMobile ? 'pointer' : 'crosshair',
  };

  const cellBase: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains-mono), monospace',
    fontSize: 'clamp(0.58rem, 1vw, 0.72rem)',
    letterSpacing: '0.08em',
    color: COLORS.textBone,
    opacity: 0.65,
    textTransform: 'uppercase' as const,
    padding: 'clamp(14px, 2.2vh, 22px) 0',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div
      style={rowStyle}
      onMouseEnter={
        isMobile
          ? undefined
          : (e) => {
            playSound(AUDIO_IDS.hoverBeep);
            onMouseEnter(e);
          }
      }
      onMouseLeave={isMobile ? undefined : onMouseLeave}
      onClick={handleClick}
    >
      {/* ── Main row grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? GRID_COLS_MOBILE : GRID_COLS_DESKTOP,
          alignItems: 'center',
          gap: '0 clamp(12px, 2vw, 24px)',
          padding: '0 clamp(20px, 4vw, 40px)',
        }}
      >
        <span
          style={{
            ...cellBase,
            color: COLORS.accentInfrared,
            opacity: 0.7,
            fontSize: '0.55rem',
            letterSpacing: '0.12em',
            width: '32px', // Narrower column for number
          }}
        >
          {number}
        </span>

        <span
          style={{
            fontFamily: 'var(--font-headline), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(0.7rem, 1.4vw, 0.9rem)',
            letterSpacing: '-0.01em',
            color: COLORS.textBone,
            textTransform: 'uppercase',
            padding: `clamp(14px, 2.2vh, 22px) 0`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {project.client}
        </span>

        {!isMobile && <span style={cellBase}>{project.type}</span>}
        {!isMobile && <span style={{ ...cellBase, opacity: 0.4 }}>{project.sector}</span>}
        <span style={{ ...cellBase, opacity: 0.4, justifyContent: 'flex-end' }}>{project.year}</span>
      </div>

      {/* ── Mobile accordion ── */}
      <AnimatePresence initial={false}>
        {isMobile && isExpanded && (
          <motion.div
            key="accordion"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                paddingTop: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  aspectRatio: '16 / 9',
                  backgroundColor: COLORS.bgAbyss,
                  border: `1px solid ${COLORS.lineAsh}`,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {project.scrollVideo ? (
                  <video
                    src={project.scrollVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : project.identitySlides?.[0] ? (
                  <img
                    src={project.identitySlides[0]}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: [
                          `linear-gradient(${COLORS.lineAsh} 1px, transparent 1px)`,
                          `linear-gradient(90deg, ${COLORS.lineAsh} 1px, transparent 1px)`,
                        ].join(', '),
                        backgroundSize: '20px 20px',
                        opacity: 0.15,
                      }}
                    />
                    <span
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.5rem',
                        letterSpacing: '0.18em',
                        color: COLORS.textBone,
                        opacity: 0.2,
                        textTransform: 'uppercase',
                      }}
                    >
                      {project.key}
                    </span>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: '0.55rem',
                    letterSpacing: '0.1em',
                    color: COLORS.accentInfrared,
                    opacity: 0.9,
                    textTransform: 'uppercase',
                    border: `1px solid ${COLORS.accentInfrared}`,
                    padding: '3px 7px',
                  }}
                >
                  {project.type}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: '0.55rem',
                    letterSpacing: '0.1em',
                    color: COLORS.accentInfrared,
                    opacity: 0.85,
                    textTransform: 'uppercase',
                    border: `1px solid ${COLORS.accentInfrared}`,
                    padding: '3px 7px',
                  }}
                >
                  {project.sector}
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.72rem',
                  lineHeight: 1.75,
                  color: COLORS.textBone,
                  opacity: 0.6,
                  margin: 0,
                }}
              >
                {project.copy}
              </p>

              {/* Open Project button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProject?.();
                }}
                style={{
                  marginTop: 8,
                  background: 'transparent',
                  border: 'none',
                  color: COLORS.accentInfrared,
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '10px 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: 44,
                  alignSelf: 'flex-start',
                  opacity: 0.9,
                  transition: 'opacity 150ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.9'; }}
              >
                OPEN PROJECT ↗
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}