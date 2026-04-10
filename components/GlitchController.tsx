'use client';

/**
 * GlitchController
 * Mounts useGlitchEngine + useTypeCorruption.
 * Renders nothing — purely a hook mount point so both ambient
 * effects persist for the full page lifetime.
 *
 * Placed in page.tsx fixed overlay group alongside EchoSystem.
 */

import { useGlitchEngine } from '@/lib/useGlitchEngine';
import { useTypeCorruption } from '@/lib/useTypeCorruption';

export function GlitchController() {
  useGlitchEngine();
  useTypeCorruption();
  return null;
}
