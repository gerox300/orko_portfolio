/**
 * AudioEngine
 * Howler.js singleton. All sounds are loaded lazily after the first user
 * interaction ([ ENTER LAB ] click) to comply with browser autoplay policy.
 *
 * Audio files live in /public/audio/ — placeholder paths used until
 * real assets are provided (Phase 7).
 */

import { AUDIO_IDS, type AudioId } from './constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SoundConfig {
  src: string[];
  volume: number;
  loop: boolean;
  html5?: boolean;
}

// Dynamic import type — Howl is browser-only
type HowlInstance = {
  play(): number;
  stop(id?: number): void;
  volume(vol?: number): number | void;
  fade(from: number, to: number, duration: number): void;
  loop(loop?: boolean): boolean | void;
  mute(muted: boolean): void;
  playing(id?: number): boolean;
};

// ─── Sound Registry ───────────────────────────────────────────────────────────

const SOUND_CONFIG: Record<AudioId, SoundConfig> = {
  [AUDIO_IDS.bgDrone]: {
    src: ['/audio/bg-drone.mp3'],
    volume: 0.08,
    loop: true,
    html5: true, // Stream the ambient drone
  },
  [AUDIO_IDS.hoverBeep]: {
    src: ['/audio/hover-beep.mp3'],
    volume: 0.35,
    loop: false,
  },
  [AUDIO_IDS.scrollSwoosh]: {
    src: ['/audio/scroll-swoosh.mp3'],
    volume: 0.18,
    loop: false,
  },
  [AUDIO_IDS.glitchBurst]: {
    src: ['/audio/glitch-burst.mp3'],
    volume: 0.5,
    loop: false,
  },
  [AUDIO_IDS.heartbeatThud]: {
    src: ['/audio/heartbeat-thud.mp3'],
    volume: 0.3,
    loop: false,
  },
};

// ─── Singleton State ──────────────────────────────────────────────────────────

let sounds: Partial<Record<AudioId, HowlInstance>> = {};
let initialized = false;
let globalMuted = false;

// ─── Init (called on first user interaction) ──────────────────────────────────

export async function initAudio(): Promise<void> {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  // Dynamic import — Howler is browser-only, must not run during SSR
  const { Howl } = await import('howler');

  for (const [id, config] of Object.entries(SOUND_CONFIG) as [AudioId, SoundConfig][]) {
    sounds[id] = new Howl({
      src: config.src,
      volume: config.volume,
      loop: config.loop,
      html5: config.html5 ?? false,
      preload: !config.html5, // Don't preload streamed audio
    }) as unknown as HowlInstance;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function playSound(id: AudioId): void {
  if (!initialized || globalMuted) return;
  sounds[id]?.play();
}

export function stopSound(id: AudioId): void {
  if (!initialized) return;
  sounds[id]?.stop();
}

export function setSoundVolume(id: AudioId, volume: number): void {
  if (!initialized) return;
  sounds[id]?.volume(Math.max(0, Math.min(1, volume)));
}

export function fadeSound(id: AudioId, from: number, to: number, duration: number): void {
  if (!initialized) return;
  sounds[id]?.fade(from, to, duration);
}

export function muteAll(): void {
  globalMuted = true;
  for (const sound of Object.values(sounds)) {
    sound?.mute(true);
  }
}

export function unmuteAll(): void {
  globalMuted = false;
  for (const sound of Object.values(sounds)) {
    sound?.mute(false);
  }
}

export function isInitialized(): boolean {
  return initialized;
}
