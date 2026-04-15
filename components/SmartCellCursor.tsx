'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useBootContext } from '@/contexts/BootContext';
import { COLORS } from '@/lib/constants';

export function SmartCellCursor() {
  const { hasBooted } = useBootContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Posición cruda del mouse (para la mira táctica precisa)
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Físicas del rastro (trail) de líquido
  const springX1 = useSpring(rawX, { stiffness: 800, damping: 35 });
  const springY1 = useSpring(rawY, { stiffness: 800, damping: 35 });

  const springX2 = useSpring(rawX, { stiffness: 250, damping: 25 });
  const springY2 = useSpring(rawY, { stiffness: 250, damping: 25 });

  const springX3 = useSpring(rawX, { stiffness: 100, damping: 20 });
  const springY3 = useSpring(rawY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    setMounted(true);
    // Hide cursor entirely on touch/coarse-pointer devices (phones, tablets)
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setIsVisible(true);
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);

    const onPointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovering(true);
      }
    };

    const onPointerOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onPointerOver);
    document.addEventListener('mouseout', onPointerOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onPointerOver);
      document.removeEventListener('mouseout', onPointerOut);
    };
  }, [rawX, rawY]);

  // Evita el error de hidratación: no renderiza nada en el servidor
  // On touch devices the cursor is never visible — skip entirely
  if (!mounted || isTouch) return null;

  return (
    <>
      {/* EL FILTRO MÁGICO SVG (Oculto) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <filter id="gooey-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
            result="gooey"
          />
          <feBlend in="SourceGraphic" in2="gooey" />
        </filter>
      </svg>

      {/* ─── CAPA 1: EL SLIME (Fondo) ─── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          filter: isHovering ? 'none' : 'url(#gooey-filter)',
          // Modo SCREEN para evitar que el rojo se vuelva celeste sobre blanco
          mixBlendMode: isHovering ? 'normal' : 'screen',
          transition: 'opacity 0.3s ease, mix-blend-mode 0.3s ease, filter 0.3s ease',
        }}
      >
        {/* Gota Cola */}
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0,
            x: springX3, y: springY3,
            translateX: '-50%', translateY: '-50%',
            width: 12, height: 12,
            backgroundColor: COLORS.accentInfrared,
            borderRadius: '50%',
            opacity: isHovering ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Gota Media */}
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0,
            x: springX2, y: springY2,
            translateX: '-50%', translateY: '-50%',
            width: 18, height: 18,
            backgroundColor: COLORS.accentInfrared,
            borderRadius: '50%',
            opacity: isHovering ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Gota Líder (Se convierte en el anillo de hover) */}
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0,
            x: springX1, y: springY1,
            translateX: '-50%', translateY: '-50%',
            width: isHovering ? 48 : 24,
            height: isHovering ? 48 : 24,
            backgroundColor: isHovering ? 'transparent' : COLORS.accentInfrared,
            border: isHovering ? `1px solid ${COLORS.textBone}` : 'none',
            borderRadius: '50%',
            transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border 0.2s ease',
          }}
        />
      </div>

      {/* ─── CAPA 2: LA MIRA TÁCTICA (Frente) ─── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          x: rawX, y: rawY,
          translateX: '-50%', translateY: '-50%',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: isVisible ? (isHovering ? 0 : 1) : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 12,
          height: 12,
        }}
      >
        {/* Cruz de precisión (+) siempre nítida */}
        <div style={{ position: 'absolute', width: 1, height: 6, backgroundColor: COLORS.textBone }} />
        <div style={{ position: 'absolute', width: 6, height: 1, backgroundColor: COLORS.textBone }} />
      </motion.div>
    </>
  );
}