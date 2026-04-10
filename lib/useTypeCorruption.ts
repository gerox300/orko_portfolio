/**
 * useTypeCorruption
 * Randomly corrupts 1–2 characters in [data-corruptible] elements for 120ms,
 * then restores the original text. Fires every 25–40 seconds.
 *
 * Technique:
 *   - Picks a random [data-corruptible] element
 *   - Selects 1–2 non-space character positions
 *   - Replaces them with random scramble characters
 *   - Restores original after GLITCH.corruptionDuration ms
 *
 * Mount via GlitchController — runs once per session.
 * Browser-only: returns early if window is undefined.
 */

import { useEffect } from 'react';
import { GLITCH } from './constants';

const CORRUPT_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*[]{}|<>';

export function useTypeCorruption(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    function fireCorruption() {
      const elements = document.querySelectorAll('[data-corruptible]');
      if (!elements.length) {
        schedule();
        return;
      }

      const el = elements[Math.floor(Math.random() * elements.length)] as HTMLElement;
      const originalText = el.textContent ?? '';
      if (!originalText.trim()) {
        schedule();
        return;
      }

      // Collect non-space indices
      const nonSpaceIndices: number[] = [];
      for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] !== ' ') nonSpaceIndices.push(i);
      }
      if (nonSpaceIndices.length === 0) {
        schedule();
        return;
      }

      // Pick 1–2 positions to corrupt (max 8% of chars, min 1)
      const corruptCount = Math.max(1, Math.min(2, Math.floor(nonSpaceIndices.length * 0.08)));
      const targets = new Set<number>();
      while (targets.size < corruptCount) {
        targets.add(nonSpaceIndices[Math.floor(Math.random() * nonSpaceIndices.length)]);
      }

      // Apply corruption
      const chars = originalText.split('');
      targets.forEach((idx) => {
        chars[idx] = CORRUPT_CHARS[Math.floor(Math.random() * CORRUPT_CHARS.length)];
      });
      el.textContent = chars.join('');

      // Restore after corruption window
      setTimeout(() => {
        if (el.isConnected) el.textContent = originalText;
      }, GLITCH.corruptionDuration);

      schedule();
    }

    function schedule() {
      const delay =
        GLITCH.corruptionMinInterval +
        Math.random() * (GLITCH.corruptionMaxInterval - GLITCH.corruptionMinInterval);
      timeoutId = setTimeout(fireCorruption, delay);
    }

    // Staggered start so glitch + corruption don't fire simultaneously
    timeoutId = setTimeout(fireCorruption, GLITCH.corruptionMinInterval * 0.6 + Math.random() * 8000);

    return () => clearTimeout(timeoutId);
  }, []);
}
