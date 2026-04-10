'use client';

/**
 * AudioProvider
 * Wraps the AudioEngine singleton and exposes it via context.
 * The engine stays locked (no sounds play) until `unlock()` is called
 * on the first user interaction — the [ ENTER LAB ] click in BootSequence.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  initAudio,
  playSound,
  stopSound,
  setSoundVolume,
  muteAll,
  unmuteAll,
  isInitialized,
} from '@/lib/audioEngine';
import type { AudioId } from '@/lib/constants';

interface AudioContextValue {
  /** Call after first user click to unlock AudioContext */
  unlock: () => Promise<void>;
  play: (id: AudioId) => void;
  stop: (id: AudioId) => void;
  setVolume: (id: AudioId, vol: number) => void;
  mute: () => void;
  unmute: () => void;
  isUnlocked: boolean;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlock = useCallback(async () => {
    if (isInitialized()) return;
    await initAudio();
    setIsUnlocked(true);
  }, []);

  const play = useCallback((id: AudioId) => {
    playSound(id);
  }, []);

  const stop = useCallback((id: AudioId) => {
    stopSound(id);
  }, []);

  const setVolume = useCallback((id: AudioId, vol: number) => {
    setSoundVolume(id, vol);
  }, []);

  const mute = useCallback(() => {
    muteAll();
  }, []);

  const unmute = useCallback(() => {
    unmuteAll();
  }, []);

  return (
    <AudioContext.Provider
      value={{ unlock, play, stop, setVolume, mute, unmute, isUnlocked }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used inside <AudioProvider>');
  }
  return ctx;
}
