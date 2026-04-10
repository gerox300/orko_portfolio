'use client';

/**
 * TextureOverlay
 * Capa de ruido orgánico animado y scanlines sutiles.
 * Z-index: 99 (El Ticker y otros elementos de fondo deben tener un z-index menor).
 */

export function TextureOverlay() {
  return (
    <>
      <style>{`
        @keyframes noise-anim {
          0% { transform: translate(0,0) }
          10% { transform: translate(-1%,-1%) }
          20% { transform: translate(1%,1%) }
          30% { transform: translate(-1%,1%) }
          40% { transform: translate(1%,-1%) }
          50% { transform: translate(-1%,0) }
          60% { transform: translate(1%,0) }
          70% { transform: translate(0,1%) }
          80% { transform: translate(0,-1%) }
          90% { transform: translate(1%,1%) }
          100% { transform: translate(0,0) }
        }
      `}</style>

      {/* Layer 1: Grano Animado (Tinte verde clínico muy sutil) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: '-10%', // Margen para que la animación no corte los bordes
          zIndex: 99,
          pointerEvents: 'none',
          // Ruido con una matriz de color verde, pero casi transparente
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0   0 0 0 0 0.8   0 0 0 0 0.3   0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.03, // Opacidad ultra baja para no tapar los elementos
          mixBlendMode: 'screen', // Se funde con el fondo de manera orgánica
          animation: 'noise-anim 0.2s steps(2) infinite',
        }}
      />

      {/* Layer 2: Scanlines (Líneas clásicas limpias) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
        }}
      />

      {/* Layer 3: Viñeta (Foco central, oscurece apenitas los bordes) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at center, transparent 60%, rgba(0, 10, 5, 0.15) 100%)',
        }}
      />
    </>
  );
}