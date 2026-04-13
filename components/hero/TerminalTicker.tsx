'use client';

import { useState, useRef, useEffect } from 'react';
import { scramble } from '@/lib/textScramble';
import { COLORS } from '@/lib/constants';
import { useLanguage } from '@/components/providers/LanguageProvider';

const STRINGS_EN = [
  '> WE DESIGN UNIQUE VISUAL IDENTITIES_',
  '> WE DIRECT GLOBAL ART NARRATIVES_',
  '> WE RESEARCH STRATEGIC BRAND DIRECTIONS_',
  '> WE BUILD COMPREHENSIVE BRANDBOOKS_',
  '> WE DEVELOP INTERACTIVE EXPERIENCES_',
  '> WE CRAFT HIGH-END LOGOTYPES_',
  '> WE DEFINE SYSTEMIC BRAND STRATEGIES_',
  '> WE ANALYZE VISUAL SEMANTICS_',
];

const STRINGS_ES = [
  '> DISENAMOS IDENTIDADES VISUALES UNICAS_',
  '> DIRIGIMOS NARRATIVAS DE ARTE GLOBALES_',
  '> INVESTIGAMOS DIRECCIONES ESTRATEGICAS_',
  '> CONSTRUIMOS BRANDBOOKS EXHAUSTIVOS_',
  '> DESARROLLAMOS EXPERIENCIAS INTERACTIVAS_',
  '> CREAMOS LOGOTIPOS DE ALTO NIVEL_',
  '> DEFINIMOS ESTRATEGIAS DE MARCA_',
  '> ANALIZAMOS SEMANTICAS VISUALES_',
];

const HOLD_DURATION = 3500;

function SocialLink({ label, href }: { label: string, href: string }) {
  const [display, setDisplay] = useState(`[ ${label} ]`);
  const [isHover, setIsHover] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => {
        setIsHover(true);
        cancelRef.current?.();
        cancelRef.current = scramble(`[ ${label} ]`, 300, setDisplay);
      }}
      onMouseLeave={() => setIsHover(false)}
      style={{
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: '0.75rem',
        color: COLORS.textBone,
        textDecoration: 'none',
        position: 'relative',
        opacity: isHover ? 1 : 0.6,
        transition: 'opacity 0.2s',
        cursor: 'none',
        zIndex: 10 // Aseguramos que el botón esté por encima de todo
      }}
    >
      {display}
      <span style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        height: '1px',
        backgroundColor: COLORS.accentInfrared,
        width: isHover ? '100%' : '0%',
        transition: 'width 200ms ease'
      }} />
    </a>
  );
}

export function TerminalTicker() {
  const { lang } = useLanguage();
  const STRINGS = lang === 'es' ? STRINGS_ES : STRINGS_EN;
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(STRINGS[0]);
  const [isLogoHover, setIsLogoHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setIndex(0);
    setDisplay(STRINGS[0]);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextIndex = (index + 1) % STRINGS.length;
      cancelRef.current?.();
      cancelRef.current = scramble(STRINGS[nextIndex], 600, setDisplay, () => {
        setIndex(nextIndex);
      });
    }, HOLD_DURATION);
    return () => {
      clearTimeout(timer);
      cancelRef.current?.();
    };
  }, [index, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogoAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("%c [SYSTEM] Glitch Triggered via Isologo ", "background: #ff0000; color: #fff");

    const event = new CustomEvent('trigger-glitch', {
      detail: { duration: 400, intensity: 2.0 }
    });
    window.dispatchEvent(event);
  };

  return (
    <div style={{
      width: '100%',
      padding: '16px clamp(20px, 4vw, 40px)',
      // Hacemos la línea un poco más sutil para que la bruma la coma visualmente
      borderTop: `1px solid rgba(240, 240, 240, 0.08)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      // Bajamos el Z-index general pero lo mantenemos sobre el video (que es 0)
      zIndex: 10,
      // ELIMINADOS: backgroundColor y backdropFilter para transparencia total
      pointerEvents: 'none' // El contenedor no bloquea clicks...
    }}>
      <style>{`
        @keyframes flicker-tech {
          0%, 100% { opacity: 1; filter: brightness(1); }
          30% { opacity: 0.6; filter: brightness(1.6); }
          35% { opacity: 1; }
          70% { opacity: 0.8; filter: contrast(1.4); }
        }
      `}</style>

      {/* TEXTO IZQUIERDO */}
      <div style={{
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: isMobile ? '0.62rem' : '0.85rem',
        color: COLORS.accentInfrared,
        opacity: 0.9,
        pointerEvents: 'auto',
        zIndex: 10,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: 0,
        flex: 1,
        letterSpacing: isMobile ? '0.04em' : '0.06em',
      }}>
        {'> '}{display.startsWith('>') ? display.substring(2).trimStart() : display}
      </div>

      {/* SOCIALS Y LOGO */}
      <div style={{ display: 'flex', gap: isMobile ? 16 : 28, alignItems: 'center', pointerEvents: 'auto', zIndex: 10, flexShrink: 0 }}>
        {!isMobile && <SocialLink label="INSTAGRAM" href="https://www.instagram.com/geronimo.astorga/" />}
        {!isMobile && <SocialLink label="LINKEDIN" href="https://www.linkedin.com/in/geroastorga/" />}

        <div
          onMouseDown={handleLogoAction}
          onMouseEnter={() => setIsLogoHover(true)}
          onMouseLeave={() => setIsLogoHover(false)}
          style={{
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'none',
            position: 'relative',
            zIndex: 20 // Máxima prioridad para el isologo
          }}
        >
          <img
            src="/logo_isologo.png"
            alt="[K_O]"
            style={{
              height: '100%',
              width: 'auto',
              opacity: isLogoHover ? 1 : 0.4,
              filter: isLogoHover ? `drop-shadow(0 0 10px ${COLORS.accentInfrared})` : 'none',
              transition: 'opacity 0.2s, filter 0.2s',
              animation: isLogoHover ? 'flicker-tech 0.2s infinite step-end' : 'none',
              transform: isLogoHover ? 'scale(1.15)' : 'scale(1)'
            }}
          />
        </div>
      </div>
    </div>
  );
}