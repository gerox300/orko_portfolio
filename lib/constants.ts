/**
 * orko_ Design Tokens
 * Single source of truth for all design constants.
 * Mirror of the @theme block in globals.css — keep in sync.
 */

// ─── PALETTE ─────────────────────────────────────────────────────────────────

export const COLORS = {
  bgAbyss: '#050505',
  lineAsh: '#1A1A1A',
  textBone: '#F0F0F0',
  accentInfrared: '#FF2A00',
  systemGreen: '#00FF41',
} as const;

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────

export const FONTS = {
  headline: 'Unbounded',
  data: 'JetBrains Mono',
} as const;

// ─── MOTION TOKENS ───────────────────────────────────────────────────────────

/** Section reveals, organic deceleration */
export const heroEase = [0.16, 1, 0.3, 1] as const;

/** CRT snap, abrupt state changes */
export const snapEase = [0.85, 0, 0.15, 1] as const;

/** Service card hovers, aggressive fills */
export const aggro = [0.7, 0, 0.3, 1] as const;

/** Hover borders, scramble character ticks */
export const microDuration = 150; // ms

/** Section transitions, card reveals */
export const macroDuration = 800; // ms

/** Global smooth scroll intensity (Lenis lerp) */
export const scrollSmooth = 1.2;

/** Framer Motion spring defaults */
export const springConfig = {
  stiffness: 150,
  damping: 15,
} as const;

/** GSAP-compatible easing strings */
export const GSAP_EASE = {
  hero: 'cubic-bezier(0.16, 1, 0.3, 1)',
  snap: 'cubic-bezier(0.85, 0, 0.15, 1)',
  aggro: 'cubic-bezier(0.7, 0, 0.3, 1)',
} as const;

// ─── SPACING ─────────────────────────────────────────────────────────────────

export const SPACING = {
  gutterDesktop: '40px',
  gutterMobile: '20px',
  maxContentWidth: '1440px',
  sectionPaddingDesktop: '10vh 40px',
  sectionPaddingMobile: '5vh 20px',
  gridColumns: 12,
} as const;

// ─── SECTION TRANSITION PARAMS ───────────────────────────────────────────────

export const SECTION_TRANSITION = {
  enterStart: { y: 40, opacity: 0 },
  enterEnd: { y: 0, opacity: 1 },
  exitEnd: { scale: 0.96, opacity: 0, filter: 'blur(4px)' },
  stagger: 0.08,
  enterTriggerStart: 'top 80%',
  enterTriggerEnd: 'bottom 20%',
  scrub: 0.5,
} as const;

// ─── GLITCH ENGINE ───────────────────────────────────────────────────────────

export const GLITCH = {
  minInterval: 12000, // ms — min time between global micro-glitch events
  maxInterval: 20000, // ms — max time
  corruptionMinInterval: 25000, // ms — min time between type corruption
  corruptionMaxInterval: 40000, // ms — max time
  corruptionDuration: 120, // ms — how long corrupt char stays
  positionJitterDistance: 2, // px
  positionJitterDuration: 80, // ms
  opacityFlickerValue: 0.3,
  opacityFlickerDuration: 60, // ms
  colorBleedDuration: 100, // ms
  scanlineTearDuration: 16, // ms (1 frame)
} as const;

// ─── ECHO SYSTEM ─────────────────────────────────────────────────────────────

export const ECHO = {
  triggerEvery: '100vh',
  pulseDuration: 1200, // ms
  peakOpacity: 0.05,
} as const;

// ─── AUDIO IDs ────────────────────────────────────────────────────────────────

export const AUDIO_IDS = {
  bgDrone: 'bg_drone',
  hoverBeep: 'hover_beep',
  scrollSwoosh: 'scroll_swoosh',
  glitchBurst: 'glitch_burst',
  heartbeatThud: 'heartbeat_thud',
} as const;

export type AudioId = typeof AUDIO_IDS[keyof typeof AUDIO_IDS];
