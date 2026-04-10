/**
 * textScramble
 * Scrambles a target string by revealing characters progressively
 * while randomizing unrevealed positions.
 *
 * Usage:
 *   const cancel = scramble('HELLO', 500, (text) => setDisplay(text), () => console.log('done'));
 *   // Returns cancel function to abort early
 */

const SCRAMBLE_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*[]{}|<>';

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/**
 * Animates text scramble: chars are gradually revealed from left to right
 * while unrevealed chars cycle through random characters.
 *
 * @param target     - The final string to resolve to
 * @param duration   - Total animation duration in ms
 * @param onUpdate   - Called with each intermediate string
 * @param onComplete - Called once when animation finishes with the target
 * @returns A cancel function to abort the animation early
 */
export function scramble(
  target: string,
  duration: number,
  onUpdate: (text: string) => void,
  onComplete?: () => void,
): () => void {
  let raf: number;
  let startTime: number | null = null;
  let cancelled = false;

  function tick(timestamp: number) {
    if (cancelled) return;
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const revealedCount = Math.floor(progress * target.length);

    let output = '';
    for (let i = 0; i < target.length; i++) {
      if (i < revealedCount) {
        output += target[i];
      } else if (target[i] === ' ') {
        // Spaces stay as spaces — never scramble whitespace
        output += ' ';
      } else {
        output += randomChar();
      }
    }

    onUpdate(output);

    if (progress < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  }

  raf = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
}

/**
 * Scrambles text to pure random characters (no target resolution).
 * Useful for "scramble out" phase before language switch.
 *
 * @param source   - The current string to scramble away
 * @param duration - How long to hold random chars
 * @param onUpdate - Called each frame with scrambled string
 * @returns A cancel function
 */
export function scrambleRandom(
  source: string,
  duration: number,
  onUpdate: (text: string) => void,
  onComplete?: () => void,
): () => void {
  let raf: number;
  let startTime: number | null = null;
  let cancelled = false;

  function tick(timestamp: number) {
    if (cancelled) return;
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;

    let output = '';
    for (let i = 0; i < source.length; i++) {
      output += source[i] === ' ' ? ' ' : randomChar();
    }

    onUpdate(output);

    if (elapsed < duration) {
      raf = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  }

  raf = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
}
