'use client';

/**
 * BootSequence
 * Full-screen boot experience. User must pass through this to enter the site.
 *
 * Layers (bottom to top):
 *   1. Dot grid background (CSS radial-gradient pattern)
 *   2. Animated static noise (canvas, 8fps, sparse white pixels)
 *   3. [K_O] watermark (large Unbounded text, opacity 0.015)
 *   4. Terminal (sequential line-by-line character typing)
 *   5. [ ENTER LAB ] button (appears after terminal completes)
 *
 * CRT snap exit:
 *   1. Button click → brief white flash (50ms)
 *   2. scaleY compress → 0 with snapEase (300ms)
 *   3. AnimatePresence removes from DOM
 *   4. markBooted() called → HUD + cursor become active
 *
 * z-index: 50 (above HUD at 40, below TextureOverlay at 99)
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBootContext } from '@/contexts/BootContext';
import { initAudio, playSound } from '@/lib/audioEngine';
import { AUDIO_IDS, COLORS } from '@/lib/constants';

// ─── Boot Lines ───────────────────────────────────────────────────────────────

const SEPARATOR = '────────────────────────────────────────────';

const BOOT_LINES: Array<{ text: string; color?: string; delay: number }> = [
  { text: 'ORKO_ MUTATION LABORATORY v1.0.0', color: COLORS.textBone, delay: 0 },
  { text: SEPARATOR, color: COLORS.lineAsh, delay: 320 },
  { text: '> INITIALIZING BIOLOGICAL FRAMEWORK', color: COLORS.textBone, delay: 800 },
  { text: '> LOADING MUTATION MODULES', color: COLORS.textBone, delay: 1360 },
  { text: '> SCANNING NEURAL PATHWAYS', color: COLORS.textBone, delay: 1880 },
  { text: '> CALIBRATING XENOBIOLOGY ENGINE', color: COLORS.textBone, delay: 2360 },
  { text: SEPARATOR, color: COLORS.lineAsh, delay: 2900 },
  { text: '[ ENVIRONMENT READY ]', color: COLORS.systemGreen, delay: 3200 },
  { text: SEPARATOR, color: COLORS.lineAsh, delay: 3500 },
];

const BUTTON_DELAY = 4000; // ms after mount before [ ENTER LAB ] appears
const CHAR_SPEED = 14;     // ms per character (average typing speed)

// ─── Static Noise Canvas ─────────────────────────────────────────────────────

function StaticNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let lastTime = 0;
    const FPS = 8;
    const INTERVAL = 1000 / FPS;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw(timestamp: number) {
      raf = requestAnimationFrame(draw);
      if (timestamp - lastTime < INTERVAL) return;
      lastTime = timestamp;

      if (!canvas || !ctx) return;
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Sparse noise: ~6% of pixels are white
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() > 0.94 ? 255 : 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = v > 0 ? 55 : 0;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.07,
      }}
    />
  );
}

// ─── Terminal Line ────────────────────────────────────────────────────────────

interface TerminalLineProps {
  text: string;
  color: string;
  startTyping: boolean;
  onComplete: () => void;
}

function TerminalLine({ text, color, startTyping, onComplete }: TerminalLineProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTyping) return;
    if (done) return;

    let charIndex = 0;
    setDisplayed('');

    const interval = setInterval(() => {
      charIndex++;
      setDisplayed(text.slice(0, charIndex));

      if (charIndex >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete();
      }
    }, CHAR_SPEED);

    return () => clearInterval(interval);
  }, [startTyping, text, done, onComplete]);

  if (!startTyping && !done) return null;

  return (
    <div
      style={{
        color,
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
        lineHeight: 1.7,
        letterSpacing: '0.05em',
        whiteSpace: 'pre',
        minHeight: '1.7em',
      }}
    >
      {displayed}
      {!done && (
        <span
          style={{
            display: 'inline-block',
            width: '0.5em',
            height: '1em',
            backgroundColor: COLORS.textBone,
            marginLeft: 1,
            opacity: 0.8,
            animation: 'cursorblink 0.8s step-end infinite',
          }}
        />
      )}
    </div>
  );
}

// ─── BootSequence ─────────────────────────────────────────────────────────────

export function BootSequence() {
  const { hasBooted, markBooted } = useBootContext();
  const [visible, setVisible] = useState(!hasBooted);
  const [exiting, setExiting] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Start the first line after a brief pause
  useEffect(() => {
    if (hasBooted) return;
    const timer = setTimeout(() => setCurrentLine(1), 300);
    return () => clearTimeout(timer);
  }, [hasBooted]);

  // Show button after all lines + delay
  useEffect(() => {
    if (hasBooted) return;
    const timer = setTimeout(() => setShowButton(true), BUTTON_DELAY);
    return () => clearTimeout(timer);
  }, [hasBooted]);

  const handleLineComplete = useCallback((lineIndex: number) => {
    // Small gap between lines
    setTimeout(() => {
      setCurrentLine(lineIndex + 1);
    }, 120);
  }, []);

  const handleEnter = useCallback(async () => {
    if (exiting) return;
    setExiting(true);

    // Unlock AudioContext, play glitch burst on click, start ambient drone
    await initAudio();
    playSound(AUDIO_IDS.glitchBurst);
    playSound(AUDIO_IDS.bgDrone);

    // Brief white flash
    setFlashActive(true);
    setTimeout(() => {
      setFlashActive(false);
      setVisible(false);
      // markBooted fires after AnimatePresence exit completes
    }, 180);
  }, [exiting]);

  if (hasBooted) return null;

  return (
    <>
      {/* Cursor blink keyframes */}
      <style>{`
        @keyframes cursorblink {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* White flash overlay */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            key="flash"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: '#FFFFFF',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Main boot overlay */}
      <AnimatePresence onExitComplete={markBooted}>
        {visible && (
          <motion.div
            key="boot"
            initial={{ opacity: 1, scaleY: 1 }}
            exit={{
              scaleY: 0,
              opacity: 0,
              transition: {
                duration: 0.35,
                ease: [0.85, 0, 0.15, 1],
              },
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              backgroundColor: COLORS.bgAbyss,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transformOrigin: 'center center',
            }}
          >
            {/* Layer 1: Dot grid */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(circle, rgba(240,240,240,0.25) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                opacity: 0.12,
                pointerEvents: 'none',
              }}
            />

            {/* Layer 2: Animated static noise */}
            <StaticNoise />

            {/* Layer 3: [K_O] watermark */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'var(--font-headline), sans-serif',
                fontSize: 'clamp(80px, 18vw, 260px)',
                fontWeight: 700,
                color: COLORS.textBone,
                opacity: 0.018,
                letterSpacing: '-0.04em',
                pointerEvents: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              [K_O]
            </div>

            {/* Layer 4: Terminal */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '680px',
                padding: '0 40px',
              }}
            >
              {BOOT_LINES.map((line, i) => (
                <TerminalLine
                  key={i}
                  text={line.text}
                  color={line.color ?? COLORS.textBone}
                  startTyping={currentLine > i}
                  onComplete={() => handleLineComplete(i)}
                />
              ))}

              {/* [ ENTER LAB ] button */}
              <AnimatePresence>
                {showButton && !exiting && (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ marginTop: '2.5rem' }}
                  >
                    <button
                      onClick={handleEnter}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${COLORS.textBone}`,
                        color: COLORS.textBone,
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
                        letterSpacing: '0.2em',
                        padding: '0.8em 2em',
                        cursor: 'none',
                        textTransform: 'uppercase',
                        transition: `border-color 150ms ease, color 150ms ease, background 150ms ease`,
                        outline: 'none',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = COLORS.accentInfrared;
                        el.style.color = COLORS.accentInfrared;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = COLORS.textBone;
                        el.style.color = COLORS.textBone;
                      }}
                    >
                      [ ENTER LAB ]
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
