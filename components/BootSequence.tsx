'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBootContext } from '@/contexts/BootContext';
import { initAudio, playSound } from '@/lib/audioEngine';
import { AUDIO_IDS, COLORS } from '@/lib/constants';
import { useLanguage } from '@/components/providers/LanguageProvider';

const CHAOS_DURATION = 1800;
const COLLAPSE_DURATION = 500;
const KO_HOLD = 700;
const TERMINAL_START = CHAOS_DURATION + COLLAPSE_DURATION + KO_HOLD;
const CHAR_SPEED = 13;

const LUNA_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789→⊕⤴⤵_//\\[]{}|<>!?#%&*';
const SEPARATOR = '────────────────────────────────────────────';

const BOOT_LINES_EN = [
  { text: 'ORKO_ MUTATION LABORATORY v1.0.0', color: COLORS.textBone },
  { text: SEPARATOR, color: COLORS.lineAsh },
  { text: '> INITIALIZING BIOLOGICAL FRAMEWORK', color: COLORS.textBone },
  { text: '> LOADING MUTATION MODULES', color: COLORS.textBone },
  { text: '> SCANNING NEURAL PATHWAYS', color: COLORS.textBone },
  { text: '> CALIBRATING XENOBIOLOGY ENGINE', color: COLORS.textBone },
  { text: SEPARATOR, color: COLORS.lineAsh },
  { text: '[ ENVIRONMENT READY ]', color: COLORS.systemGreen },
  { text: SEPARATOR, color: COLORS.lineAsh },
];

const BOOT_LINES_ES = [
  { text: 'ORKO_ LABORATORIO CREATIVO v1.0.0', color: COLORS.textBone },
  { text: SEPARATOR, color: COLORS.lineAsh },
  { text: '> INICIALIZANDO MARCO BIOLÓGICO', color: COLORS.textBone },
  { text: '> CARGANDO MÓDULOS DE MUTACIÓN', color: COLORS.textBone },
  { text: '> ESCANEANDO RUTAS NEURALES', color: COLORS.textBone },
  { text: '> CALIBRANDO MOTOR XENOBIOLÓGICO', color: COLORS.textBone },
  { text: SEPARATOR, color: COLORS.lineAsh },
  { text: '[ ENTORNO PREPARADO ]', color: COLORS.systemGreen },
  { text: SEPARATOR, color: COLORS.lineAsh },
];

const BIO_BARS = [
  { label: 'NEURAL_SYNC', labelMobile: 'NEURAL', targetPct: 94, color: '#00FF41', failAt: 45 },
  { label: 'CELL_DENSITY', labelMobile: 'CELL', targetPct: 78, color: '#00FF41', failAt: null },
  { label: 'MUTATION_CORE', labelMobile: 'MUTATION', targetPct: 100, color: '#00FF41', failAt: 67 },
  { label: 'XENOBIO_ENGINE', labelMobile: 'XENOBIO', targetPct: 88, color: '#00FF41', failAt: null },
];

const CREATURE_VIDEOS = [
  '/mutant-tank.webm',
  '/video_cell.webm',
  '/specimen_a.webm',
  '/specimen_b.webm',
];

// ─── Chaos Layer ──────────────────────────────────────────────────────────────
function ChaosLayer({ active }: { active: boolean }) {
  const [scramble, setScramble] = useState('');
  const [flashes, setFlashes] = useState<Array<{ id: number; src: string; x: number; y: number; w: number; h: number; opacity: number; tint: string }>>([]);
  const [pulseColor, setPulseColor] = useState('transparent');

  useEffect(() => {
    if (!active) return;
    const cols = Math.floor(window.innerWidth / 14);
    const rows = Math.floor(window.innerHeight / 20);
    const total = cols * rows;
    const iv = setInterval(() => {
      setScramble(Array.from({ length: total }, () =>
        Math.random() > 0.7 ? LUNA_CHARS[Math.floor(Math.random() * LUNA_CHARS.length)] : ' '
      ).join(''));
    }, 60);
    return () => clearInterval(iv);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    let id = 0;
    const iv = setInterval(() => {
      const src = CREATURE_VIDEOS[Math.floor(Math.random() * CREATURE_VIDEOS.length)];
      const flash = {
        id: id++, src,
        x: Math.random() * 80, y: Math.random() * 80,
        w: 150 + Math.random() * 250, h: 120 + Math.random() * 200,
        opacity: 0.3 + Math.random() * 0.5,
        tint: Math.random() > 0.5 ? 'rgba(0,255,65,0.3)' : 'rgba(220,40,40,0.3)',
      };
      setFlashes(prev => [...prev.slice(-5), flash]);
      setTimeout(() => setFlashes(prev => prev.filter(f => f.id !== flash.id)), 200 + Math.random() * 300);
    }, 180);
    return () => clearInterval(iv);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const colors = ['rgba(0,255,65,0.08)', 'rgba(220,40,40,0.08)', 'transparent', 'transparent'];
    const iv = setInterval(() => setPulseColor(colors[Math.floor(Math.random() * colors.length)]), 120);
    return () => { clearInterval(iv); setPulseColor('transparent'); };
  }, [active]);

  if (!active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: pulseColor, transition: 'background-color 0.08s', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, fontFamily: "'LunaObscura', var(--font-jetbrains-mono), monospace", fontSize: 13, lineHeight: '20px', letterSpacing: '0.05em', color: 'rgba(0,255,65,0.15)', wordBreak: 'break-all', overflow: 'hidden', pointerEvents: 'none', zIndex: 2, whiteSpace: 'pre-wrap' }}>
        {scramble}
      </div>
      {flashes.map(f => (
        <div key={f.id} style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, width: f.w, height: f.h, overflow: 'hidden', opacity: f.opacity, pointerEvents: 'none', zIndex: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
          <video src={f.src} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: f.tint, mixBlendMode: 'overlay' }} />
        </div>
      ))}
    </div>
  );
}

// ─── Bio Bars ─────────────────────────────────────────────────────────────────
function BioBars({ active, isMobile }: { active: boolean; isMobile: boolean }) {
  const [values, setValues] = useState(BIO_BARS.map(() => 0));
  const [statuses, setStatuses] = useState(BIO_BARS.map(() => 'loading' as 'loading' | 'fail' | 'done'));

  useEffect(() => {
    if (!active) return;
    const intervals = BIO_BARS.map((bar, i) => {
      let current = 0; let failed = false;
      return setInterval(() => {
        const step = Math.random() > 0.15 ? Math.random() * 4 + 0.5 : -Math.random() * 2;
        current = Math.max(0, Math.min(bar.targetPct, current + step));
        if (bar.failAt && !failed && current >= bar.failAt && current < bar.failAt + 5) {
          failed = true;
          setStatuses(prev => { const n = [...prev]; n[i] = 'fail'; return n; });
          setTimeout(() => { setStatuses(prev => { const n = [...prev]; n[i] = 'loading'; return n; }); failed = false; }, 400);
        }
        setValues(prev => { const n = [...prev]; n[i] = current; return n; });
        if (current >= bar.targetPct) setStatuses(prev => { const n = [...prev]; n[i] = 'done'; return n; });
      }, 40 + Math.random() * 30);
    });
    return () => intervals.forEach(clearInterval);
  }, [active]);

  if (!active) return null;

  const barLength = isMobile ? 12 : 20;

  return (
    <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: isMobile ? 5 : 8 }}>
      {BIO_BARS.map((bar, i) => {
        const pct = values[i];
        const status = statuses[i];
        const color = status === 'fail' ? '#FF3B3B' : status === 'done' ? bar.color : 'rgba(200,200,200,0.7)';
        const filled = Math.round(pct / 100 * barLength);
        const barStr = '█'.repeat(filled) + '░'.repeat(barLength - filled);
        const lbl = isMobile ? bar.labelMobile : bar.label;
        return (
          <div key={bar.label} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: isMobile ? '0.5rem' : 'clamp(0.55rem, 1.2vw, 0.68rem)', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', width: isMobile ? 56 : 130, flexShrink: 0 }}>{lbl}</span>
            <span style={{ color, fontFamily: 'monospace', letterSpacing: 0 }}>{barStr}</span>
            <span style={{ color, width: 30, textAlign: 'right', flexShrink: 0 }}>{status === 'fail' ? 'ERR' : `${Math.round(pct)}%`}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Static Noise ─────────────────────────────────────────────────────────────
function StaticNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let raf: number; let lastTime = 0;
    function resize() { if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
    function draw(ts: number) {
      raf = requestAnimationFrame(draw);
      if (ts - lastTime < 125) return; lastTime = ts;
      if (!canvas || !ctx) return;
      const d = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() > 0.94 ? 255 : 0; d.data[i] = v; d.data[i + 1] = v; d.data[i + 2] = v; d.data[i + 3] = v > 0 ? 55 : 0; }
      ctx.putImageData(d, 0, 0);
    }
    resize(); window.addEventListener('resize', resize); raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06, zIndex: 1 }} />;
}

// ─── Terminal Line ─────────────────────────────────────────────────────────────
function TerminalLine({ text, color, startTyping, onComplete }: { text: string; color: string; startTyping: boolean; onComplete: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!startTyping || done) return;
    let i = 0; setDisplayed('');
    const iv = setInterval(() => {
      i++; setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); onComplete(); }
    }, CHAR_SPEED);
    return () => clearInterval(iv);
  }, [startTyping]);
  if (!startTyping && !done) return null;
  return (
    <div style={{ color, fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: 'clamp(0.5rem, 1.8vw, 0.75rem)', lineHeight: 1.6, letterSpacing: '0.04em', whiteSpace: 'pre', minHeight: '1.6em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {displayed}
      {!done && <span style={{ display: 'inline-block', width: '0.5em', height: '1em', backgroundColor: COLORS.textBone, marginLeft: 1, animation: 'cursorblink 0.8s step-end infinite', verticalAlign: 'text-bottom' }} />}
    </div>
  );
}

// ─── BootSequence ─────────────────────────────────────────────────────────────
export function BootSequence() {
  const { hasBooted, markBooted } = useBootContext();
  const { lang } = useLanguage();
  const BOOT_LINES = lang === 'es' ? BOOT_LINES_ES : BOOT_LINES_EN;

  const [visible, setVisible] = useState(!hasBooted);
  const [exiting, setExiting] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [phase, setPhase] = useState<'chaos' | 'collapse' | 'ko' | 'terminal'>('chaos');
  const [currentLine, setCurrentLine] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [showBars, setShowBars] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (hasBooted) return;
    const t1 = setTimeout(() => setPhase('collapse'), CHAOS_DURATION);
    const t2 = setTimeout(() => setPhase('ko'), CHAOS_DURATION + COLLAPSE_DURATION);
    const t3 = setTimeout(() => { setPhase('terminal'); setCurrentLine(0); }, TERMINAL_START);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [hasBooted]);

  const handleLineComplete = useCallback((idx: number) => {
    if (idx === BOOT_LINES.length - 1) {
      setShowBars(true);
      setTimeout(() => setShowButton(true), isMobile ? 600 : 1200);
    } else {
      setCurrentLine(prev => prev + 1);
    }
  }, [BOOT_LINES.length, isMobile]);

  const handleEnter = useCallback(async () => {
    if (exiting) return;
    setExiting(true);
    await initAudio();
    playSound(AUDIO_IDS.glitchBurst);
    playSound(AUDIO_IDS.bgDrone);
    setFlashActive(true);
    setTimeout(() => { setFlashActive(false); setVisible(false); }, 180);
  }, [exiting]);

  if (hasBooted) return null;

  const isTerminal = phase === 'terminal';
  const isKO = phase === 'ko';
  const isChaos = phase === 'chaos';

  return (
    <>
      <style>{`
        @font-face { font-family:'LunaObscura'; src:url('/hs_lunaobscura/HS_LunaObscura.woff2') format('woff2'), url('/hs_lunaobscura/HS_LunaObscura.otf') format('opentype'); }
        @keyframes cursorblink { 0%, 100% { opacity: 0.85 } 50%{opacity:0} }
        @keyframes ko-pulse { 0%, 100% { text-shadow:0 0 40px rgba(255,255,255,0.3)} 50%{text-shadow:0 0 80px rgba(255,255,255,0.7),0 0 120px rgba(0,255,65,0.3)} }
      `}</style>

      <AnimatePresence>
        {flashActive && (
          <motion.div key="flash" aria-hidden="true"
            initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#fff', pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence onExitComplete={markBooted}>
        {visible && (
          <motion.div key="boot"
            initial={{ opacity: 1, scaleY: 1 }}
            exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.35, ease: [0.85, 0, 0.15, 1] } }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              backgroundColor: COLORS.bgAbyss,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', transformOrigin: 'center center',
            }}
          >
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(240,240,240,0.25) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.08, pointerEvents: 'none' }} />
            <StaticNoise />

            <AnimatePresence>
              {isChaos && (
                <motion.div key="chaos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
                  <ChaosLayer active={isChaos} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(isKO || isTerminal) && (
                <motion.div key="ko"
                  initial={{ opacity: 0, scale: 1.3 }}
                  animate={{ opacity: isKO ? 0.9 : 0.025, scale: 1 }}
                  transition={{ duration: isKO ? 0.5 : 0.8, ease: [0.4, 0, 0.2, 1] }}
                  aria-hidden="true"
                  style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'var(--font-headline), sans-serif', fontWeight: 900,
                    fontSize: isKO ? (isMobile ? 'clamp(80px,22vw,160px)' : 'clamp(140px,24vw,320px)') : (isMobile ? 'clamp(60px,18vw,120px)' : 'clamp(80px,18vw,260px)'),
                    color: COLORS.textBone, letterSpacing: '-0.04em',
                    pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap', zIndex: 4,
                    animation: isKO ? 'ko-pulse 1s ease-in-out' : 'none', textAlign: 'center',
                  }}
                >
                  [K_O]
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terminal — scrollable en mobile para que el botón siempre sea alcanzable */}
            <AnimatePresence>
              {isTerminal && (
                <motion.div key="terminal"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                  style={{
                    position: 'relative', zIndex: 5,
                    width: '100%', maxWidth: 640,
                    padding: isMobile ? '0 20px' : '0 40px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center',
                    // Mobile: scroll vertical para que el botón sea siempre visible
                    maxHeight: isMobile ? '90vh' : 'none',
                    overflowY: isMobile ? 'auto' : 'visible',
                  }}
                >
                  <div style={{ width: '100%' }}>
                    {BOOT_LINES.map((line, i) => (
                      <TerminalLine key={i} text={line.text} color={line.color}
                        startTyping={currentLine > i}
                        onComplete={() => handleLineComplete(i)}
                      />
                    ))}
                  </div>

                  <div style={{ width: '100%' }}>
                    <BioBars active={showBars} isMobile={isMobile} />
                  </div>

                  {/* Botón — en mobile siempre visible con margin grande */}
                  <AnimatePresence>
                    {showButton && !exiting && (
                      <motion.div key="btn"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                        style={{
                          marginTop: isMobile ? '2rem' : '2.5rem',
                          textAlign: 'center',
                          // En mobile sticky para que nunca quede fuera
                          position: isMobile ? 'sticky' : 'relative',
                          bottom: isMobile ? 16 : 'auto',
                          width: '100%',
                          paddingBottom: isMobile ? 8 : 0,
                          backgroundColor: isMobile ? COLORS.bgAbyss : 'transparent',
                        }}
                      >
                        <button
                          onClick={handleEnter}
                          style={{
                            background: 'transparent', border: 'none', outline: 'none',
                            color: COLORS.textBone,
                            fontFamily: 'var(--font-jetbrains-mono), monospace',
                            fontSize: isMobile ? 'clamp(0.9rem, 4vw, 1.1rem)' : 'clamp(0.7rem, 1.6vw, 0.85rem)',
                            letterSpacing: '0.25em', cursor: 'pointer',
                            textTransform: 'uppercase',
                            padding: isMobile ? '1em 2em' : '0.5em 0',
                            transition: 'color 150ms ease',
                            // En mobile borde visible para que sea obvio que es clickeable
                            border: isMobile ? `1px solid ${COLORS.textBone}` : 'none',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#DC2828'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = COLORS.textBone; }}
                        >
                          [{lang === 'es' ? ' ENTRAR AL LAB ' : ' ENTER LAB '}]
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}