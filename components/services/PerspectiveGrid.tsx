'use client';

/**
 * PerspectiveGrid
 * Atmospheric perspective-warped grid behind the service cards.
 * Purely decorative — pointer-events: none.
 *
 * Technique:
 *   Outer div sets CSS perspective: 600px
 *   Inner div with rotateX(50deg) creates the receding grid illusion
 *   Grid lines via CSS background-image (two linear-gradients)
 *   Gradient fade at the bottom via mask-image for seamless blending
 */

import { COLORS } from '@/lib/constants';

export function PerspectiveGrid() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        perspective: '600px',
        perspectiveOrigin: '50% 100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-20% -40%',
          transform: 'rotateX(52deg)',
          transformOrigin: '50% 100%',
          backgroundImage: [
            `linear-gradient(${COLORS.lineAsh} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${COLORS.lineAsh} 1px, transparent 1px)`,
          ].join(', '),
          backgroundSize: '64px 64px',
          opacity: 0.5,
          maskImage:
            'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 70%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
