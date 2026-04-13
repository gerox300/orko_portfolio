'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBootContext } from '@/contexts/BootContext';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { scramble } from '@/lib/textScramble';
import { COLORS } from '@/lib/constants';

const HOVER_SCRAMBLE_DURATION = 500;

// ─── BUE Clock ────────────────────────────────────────────────────────────
function BueClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      const bue = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).format(now);
      setTime(bue);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.color = '#FFFFFF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.5';
        e.currentTarget.style.color = COLORS.textBone;
      }}
      style={{
        color: COLORS.textBone, opacity: 0.5, fontSize: '0.75rem',
        letterSpacing: '0.12em', fontVariantNumeric: 'tabular-nums',
        minWidth: '6.5em', textAlign: 'right',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        transition: 'opacity 150ms ease, color 150ms ease', cursor: 'none',
      }}
    >
      BUE {time}
    </span>
  );
}

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes flicker-tech {
          0%, 100% { opacity: 1; filter: brightness(1); }
          30% { opacity: 0.6; filter: brightness(1.6); }
          35% { opacity: 1; }
          70% { opacity: 0.8; filter: contrast(1.4); }
        }
      `}</style>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="orko_ — return to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          background: 'transparent', border: 'none', padding: 0, cursor: 'none',
          position: 'relative', display: 'flex', alignItems: 'center',
        }}
      >
        <img
          src="/logo_logotipo.png"
          alt="orko_"
          style={{
            height: '22px', width: 'auto',
            opacity: isHovered ? 1 : 0.9,
            filter: isHovered ? `drop-shadow(0 0 10px ${COLORS.accentInfrared})` : 'none',
            transition: 'opacity 0.2s, filter 0.2s',
            animation: isHovered ? 'flicker-tech 0.2s infinite step-end' : 'none',
            transform: isHovered ? 'scale(1.15)' : 'scale(1)',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'block';
          }}
        />
        <span style={{ display: 'none', fontFamily: 'var(--font-headline), sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.04em', color: COLORS.textBone, textTransform: 'uppercase' }}>
          orko_
        </span>
      </button>
    </>
  );
}

// ─── NavLink ──────────────────────────────────────────────────────────────
function NavLink({
  labelKey,
  targetId,
  onClick,
  large,
}: {
  labelKey: Parameters<ReturnType<typeof useLanguage>['t']>[0];
  targetId: string;
  onClick?: () => void;
  large?: boolean;
}) {
  const { t } = useLanguage();
  const label = t(labelKey).replace(/[\[\]]/g, '').trim();
  const [display, setDisplay] = useState(`[ ${label} ]`);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const newLabel = t(labelKey).replace(/[\[\]]/g, '').trim();
    setDisplay(`[ ${newLabel} ]`);
  }, [labelKey, t]);

  const handleEnter = () => {
    const currentLabel = t(labelKey).replace(/[\[\]]/g, '').trim();
    cancelRef.current?.();
    cancelRef.current = scramble(`[ ${currentLabel} ]`, 300, setDisplay);
  };

  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: 'transparent', border: 'none', cursor: 'none',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: large ? '1.1rem' : '0.75rem',
        letterSpacing: '0.18em', color: COLORS.textBone,
        textTransform: 'uppercase', position: 'relative',
        padding: large ? '0.6em 0' : '0.2em 0',
        opacity: 0.7,
      }}
      onMouseEnter={(e) => {
        handleEnter();
        e.currentTarget.style.opacity = '1';
        const line = e.currentTarget.querySelector('.strike') as HTMLElement;
        if (line) line.style.width = '100%';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.7';
        const line = e.currentTarget.querySelector('.strike') as HTMLElement;
        if (line) line.style.width = '0%';
      }}
    >
      {display}
      <span
        className="strike"
        style={{
          position: 'absolute', left: 0, top: '50%', height: '1px',
          backgroundColor: COLORS.accentInfrared, width: '0%',
          transition: 'width 200ms ease', pointerEvents: 'none',
        }}
      />
    </button>
  );
}

// ─── LangToggle ───────────────────────────────────────────────────────────
function LangToggle({ large }: { large?: boolean }) {
  const { lang, isScrambling, triggerLangToggle } = useLanguage();
  const [display, setDisplay] = useState(lang.toUpperCase());
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isScrambling) {
      const nextLang = lang === 'en' ? 'ES' : 'EN';
      cancelRef.current?.();
      cancelRef.current = scramble(nextLang, 360, setDisplay, () => setDisplay(nextLang));
    } else {
      setDisplay(lang.toUpperCase());
      cancelRef.current?.();
    }
    return () => cancelRef.current?.();
  }, [isScrambling, lang]);

  return (
    <button
      onClick={triggerLangToggle}
      aria-label="Switch language"
      style={{
        background: 'transparent', border: 'none',
        padding: large ? '0.6em 0' : '0.2em 0', cursor: 'none',
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: large ? '1.1rem' : '0.75rem',
        letterSpacing: '0.18em', color: COLORS.textBone,
        opacity: 0.5, transition: 'opacity 150ms ease, color 150ms ease',
        minWidth: large ? 'auto' : '7em', textAlign: large ? 'left' : 'right',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = COLORS.accentInfrared; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = COLORS.textBone; }}
    >
      LANG: [{display}]
    </button>
  );
}

// ─── Hamburger button ─────────────────────────────────────────────────────
function HamburgerBtn({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={open ? 'Close menu' : 'Open menu'}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: '8px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', gap: 5,
        width: 40, height: 40,
      }}
    >
      <span style={{
        display: 'block', width: 22, height: 1,
        backgroundColor: COLORS.textBone,
        transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
        transition: 'transform 250ms ease, opacity 250ms ease',
      }} />
      <span style={{
        display: 'block', width: 22, height: 1,
        backgroundColor: COLORS.textBone,
        opacity: open ? 0 : 1,
        transition: 'transform 250ms ease, opacity 250ms ease',
      }} />
      <span style={{
        display: 'block', width: 22, height: 1,
        backgroundColor: COLORS.textBone,
        transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
        transition: 'transform 250ms ease, opacity 250ms ease',
      }} />
    </button>
  );
}

// ─── Mobile Menu Overlay ──────────────────────────────────────────────────
function MobileMenuOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="mobile-menu"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 39,
        backgroundColor: 'rgba(5,5,5,0.97)',
        backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 'clamp(24px, 6vh, 40px)',
        padding: '80px 40px 40px',
      }}
    >
      {/* Logo */}
      <img
        src="/logo_logotipo.png"
        alt="orko_"
        style={{ height: 40, width: 'auto', opacity: 0.9, marginBottom: 8 }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <NavLink labelKey="hud.work" targetId="works" onClick={onClose} large />
        <NavLink labelKey="hud.lab" targetId="services" onClick={onClose} large />
        <NavLink labelKey="hud.intel" targetId="bio" onClick={onClose} large />
      </nav>

      {/* Divider */}
      <div style={{ width: 48, height: 1, backgroundColor: COLORS.lineAsh, opacity: 0.5 }} />

      {/* Language toggle */}
      <LangToggle large />
    </motion.div>
  );
}

// ─── HUD ──────────────────────────────────────────────────────────────────
export function HUD() {
  const { hasBooted } = useBootContext();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  return (
    <AnimatePresence>
      {hasBooted && (
        <>
          <motion.header
            key="hud"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
              padding: '0 clamp(20px, 4vw, 40px)', height: 80,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              pointerEvents: 'auto',
              backgroundColor: 'rgba(5, 5, 5, 0.4)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
              borderBottom: `1px solid ${COLORS.lineAsh}22`,
            }}
          >
            <Logo />

            {isMobile ? (
              /* Mobile: clock (hidden) + hamburger */
              <HamburgerBtn open={menuOpen} onToggle={() => setMenuOpen(v => !v)} />
            ) : (
              /* Desktop: full nav */
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 4vw, 40px)' }}>
                <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                  <NavLink labelKey="hud.work" targetId="works" />
                  <NavLink labelKey="hud.lab" targetId="services" />
                  <NavLink labelKey="hud.intel" targetId="bio" />
                </nav>
                <LangToggle />
                <BueClock />
              </div>
            )}
          </motion.header>

          {/* Mobile overlay menu */}
          <AnimatePresence>
            {isMobile && menuOpen && (
              <MobileMenuOverlay onClose={() => setMenuOpen(false)} />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
