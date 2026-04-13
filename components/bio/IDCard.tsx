'use client';

/**
 * IDCard
 * Classified specimen card for the Bio section.
 *
 * Glitch hover effects:
 *   1. RGB split via CSS filter (drop-shadow: red +2px, blue -2px)
 *   2. Canvas static noise overlay at 8fps
 *   3. Brief positional jitter via GSAP (±3px, 5 repeats)
 *
 * Content:
 *   Top    — classification header bar
 *   Center — specimen visual placeholder (3:4 aspect ratio)
 *   Bottom — metadata rows (coordinates, clearance, status)
 *
 * ASSET: Replace placeholder visual with actual profile image.
 * pointer-events: all — interactive hover.
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { COLORS } from '@/lib/constants';

// ─── Static Noise ─────────────────────────────────────────────────────────────

function useStaticNoise(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  active: boolean,
) {
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const FPS = 8;
  const FRAME_MS = 1000 / FPS;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!active) {
      cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    function draw(now: number) {
      rafRef.current = requestAnimationFrame(draw);
      if (now - lastFrameRef.current < FRAME_MS) return;
      lastFrameRef.current = now;
      if (!canvas || !ctx) return;
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() < 0.06 ? 240 : 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = v ? 180 : 0;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, canvasRef, FRAME_MS]);
}

// ─── Chunky Glitch ────────────────────────────────────────────────────────────

function useChunkyGlitch(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  active: boolean,
) {
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const FPS = 12;
  const FRAME_MS = 1000 / FPS;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!active) {
      cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    function draw(now: number) {
      rafRef.current = requestAnimationFrame(draw);
      if (now - lastFrameRef.current < FRAME_MS) return;
      lastFrameRef.current = now;
      if (!canvas || !ctx) return;
      
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const blockSize = 16;
      for (let y = 0; y < height; y += blockSize) {
        for (let x = 0; x < width; x += blockSize) {
          if (Math.random() < 0.35) {
            ctx.fillStyle = Math.random() > 0.7 
              ? 'rgba(255,255,255,0.7)' 
              : (Math.random() > 0.5 ? 'rgba(150,150,150,0.8)' : 'rgba(30,30,30,0.9)');
            ctx.fillRect(x, y, blockSize, blockSize);
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, canvasRef, FRAME_MS]);
}

// ─── Constants ────────────────────────────────────────────────────────────────

const META_ROWS = [
  { label: 'age', value: '30' },
  { label: 'sign', value: 'SCORPIO' },
  { label: 'origin', value: 'CHILE' },
  { label: 'audio_op', value: 'PIANO / DJ / PRODUCER' },
  { label: 'langs', value: 'ES / EN / FR' },
  { label: 'status', value: 'ACTIVE' },
] as const;

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

// ─── IDCard ───────────────────────────────────────────────────────────────────

export function IDCard() {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chunkyRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useStaticNoise(canvasRef, isHovered);
  useChunkyGlitch(chunkyRef, isHovered);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (!cardRef.current) return;
    gsap.killTweensOf(cardRef.current);
    gsap.to(cardRef.current, {
      x: 3,
      duration: 0.04,
      yoyo: true,
      repeat: 5,
      ease: 'none',
      onComplete: () => {
        if (cardRef.current) gsap.set(cardRef.current, { x: 0 });
      },
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (!cardRef.current) return;
    gsap.killTweensOf(cardRef.current);
    gsap.set(cardRef.current, { x: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 320,
        border: `1px solid ${isHovered ? COLORS.accentInfrared : COLORS.lineAsh}`,
        backgroundColor: 'rgba(240,240,240,0.015)',
        filter: isHovered
          ? 'drop-shadow(2px 0 rgba(255,42,0,0.65)) drop-shadow(-2px 0 rgba(0,80,255,0.45))'
          : 'none',
        transition: 'border-color 0.12s ease',
        cursor: 'crosshair',
        willChange: 'transform',
      }}
    >
      {/* Noise overlay — active on hover */}
      <canvas
        ref={canvasRef}
        width={320}
        height={480}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: isHovered ? 0.55 : 0,
          transition: 'opacity 0.08s ease',
          zIndex: 10,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Classification header */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: `1px solid ${COLORS.lineAsh}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.5rem',
            letterSpacing: '0.15em',
            color: COLORS.accentInfrared,
            opacity: 0.85,
          }}
        >
          {t('bio.id.classified')}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '0.5rem',
            letterSpacing: '0.15em',
            color: COLORS.textBone,
            opacity: 0.3,
          }}
        >
          SPECIMEN_001
        </span>
      </div>

      {/* Specimen visual */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          backgroundColor: 'rgba(240,240,240,0.02)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Grid pattern background */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(240,240,240,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(240,240,240,0.04) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <img
          src="/gero_portrait.jpg"
          alt="Geronimo Astorga Portrait"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.15)',
            zIndex: 1,
            opacity: 0.95,
          }}
        />

        {/* Chunky Glitch Censorship Backdrop */}
        <canvas
          ref={chunkyRef}
          width={240}
          height={240}
          style={{
            position: 'absolute',
            top: 'calc(35% + 20px)',
            left: 'calc(50% - 3px)',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '60%',
            maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 70%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
            zIndex: 2,
            mixBlendMode: 'overlay', // Blends violently with the face
          }}
        />

        {/* Blurred Darkening layer for visibility */}
        <div style={{
          position: 'absolute',
          top: 'calc(35% + 20px)',
          left: 'calc(50% - 3px)',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          height: '45%',
          backgroundColor: 'rgba(5,5,5,0.4)',
          backdropFilter: 'blur(10px) contrast(1.2) grayscale(1)',
          WebkitBackdropFilter: 'blur(10px) contrast(1.2) grayscale(1)',
          maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Censorship Logo (Hover) */}
        <img
          src="/logo_isologo.png"
          alt="Classified"
          style={{
            position: 'absolute',
            top: 'calc(35% + 20px)', // Lowered an extra 5px
            left: 'calc(50% - 3px)', // Moved left by 3px
            width: '45%',
            height: 'auto',
            filter: 'brightness(0) invert(1)',
            opacity: isHovered ? 0.95 : 0,
            transform: isHovered ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(0.9)',
            transition: 'opacity 0.15s ease, transform 0.15s ease',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        {/* Corner crosshairs */}
        {CORNERS.map((corner) => (
          <div
            key={corner}
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 12,
              height: 12,
              ...(corner.includes('top') ? { top: 8 } : { bottom: 8 }),
              ...(corner.includes('left') ? { left: 8 } : { right: 8 }),
              borderTop: corner.includes('top')
                ? `1px solid ${COLORS.accentInfrared}`
                : 'none',
              borderBottom: corner.includes('bottom')
                ? `1px solid ${COLORS.accentInfrared}`
                : 'none',
              borderLeft: corner.includes('left')
                ? `1px solid ${COLORS.accentInfrared}`
                : 'none',
              borderRight: corner.includes('right')
                ? `1px solid ${COLORS.accentInfrared}`
                : 'none',
              opacity: 0.45,
            }}
          />
        ))}
      </div>

      {/* Metadata rows */}
      <div style={{ padding: '10px 12px 12px' }}>
        {META_ROWS.map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px 0',
              borderBottom: `1px solid rgba(26,26,26,0.6)`,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.1em',
                color: COLORS.textBone,
                opacity: 0.3,
              }}
            >
              {t(`bio.id.${label}` as any)}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.1em',
                color: COLORS.textBone,
                opacity: 0.7,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
