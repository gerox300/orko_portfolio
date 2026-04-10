'use client';

import { COLORS } from '@/lib/constants';

interface NodeProps {
  title: string; data: string;
  lensX: string; lensY: string; // Centro del lente y origen de la línea
  cardX: string; cardY: string; // Punto de anclaje de la card y fin de la línea
}

function AnalysisNode({ title, data, lensX, lensY, cardX, cardY }: NodeProps) {
  return (
    <>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line
          x1={`calc(${lensX} + 35px)`}
          y1={`calc(${lensY} + 35px)`}
          x2={cardX}
          y2={`calc(${cardY} + 20px)`}
          stroke="rgba(240,240,240,0.2)"
          strokeWidth="1"
        />
      </svg>

      {/* Lente Cuadrado con Blur */}
      <div style={{
        position: 'absolute', top: lensY, left: lensX,
        transform: 'translate(-50%, -50%) translateZ(0)', width: 70, height: 70,
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(240,240,240,0.15)',
        willChange: 'transform, filter'
      }} />

      {/* Card Técnica de Análisis */}
      <div style={{
        position: 'absolute', top: cardY, left: cardX,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(5,5,5,0.4)', transform: 'translateZ(0)',
        border: '1px solid rgba(240,240,240,0.15)', padding: 12, minWidth: 150,
        willChange: 'transform, filter'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.accentInfrared, animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '0.45rem', color: COLORS.accentInfrared }}>[ REC ]</span>
        </div>
        <div style={{ fontSize: '0.55rem', color: COLORS.textBone, opacity: 0.9, textTransform: 'uppercase' }}>{title}</div>
        <div style={{ fontSize: '0.65rem', color: COLORS.systemGreen }}>{data}</div>
      </div>
    </>
  );
}

export function DataNodes() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>

      {/* Nodo 1: NEURAL_ACTIVITY */}
      <AnalysisNode
        title="NEURAL_ACTIVITY"
        data="SCANNING"
        lensX="76vw"
        lensY="32vh"
        cardX="86vw"
        cardY="22vh"
      />

      {/* Nodo 2: CELL_DENSITY (Lente bajado ~30-40px para acortar flecha y despegar de arriba) */}
      <AnalysisNode
        title="CELL_DENSITY"
        data="OVERLOAD"
        lensX="79vw"
        lensY="52vh" // <-- BAJADO de 48vh a 52vh
        cardX="82vw"
        cardY="75vh"
      />
    </div>
  );
}