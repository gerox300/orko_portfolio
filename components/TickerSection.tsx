'use client';

/**
 * TickerSection
 * 3 filas enormes en LunaObscura, scrubbed con scroll.
 * Filas 1 y 3 tienen card de espécimen integrada inline.
 * Fila 2 sin card — la más grande, dominante.
 * Texto: blanco/gris con palabras en rojo.
 * Videos: objectFit cover, sin mixBlendMode screen.
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Scramble hook ────────────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_→⊕⤴⤵';

function useScramble(word: string) {
    const [display, setDisplay] = useState(word);
    const interval = useRef<ReturnType<typeof setInterval> | null>(null);

    function start() {
        let it = 0;
        interval.current = setInterval(() => {
            setDisplay(
                word.split('').map((ch, idx) => {
                    if (idx < it) return word[idx];
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join('')
            );
            it += 0.5;
            if (it >= word.length) {
                setDisplay(word);
                clearInterval(interval.current!);
            }
        }, 35);
    }

    function stop() {
        clearInterval(interval.current!);
        setDisplay(word);
    }

    return { display, start, stop };
}

// ─── Palabra con scramble on-scroll ──────────────────────────────────────────
function ScrambleWord({ word, color }: { word: string; color: string }) {
    const { display, start } = useScramble(word);
    const ref = useRef<HTMLSpanElement>(null);
    const triggered = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const st = ScrollTrigger.create({
            trigger: el,
            start: 'left 80%',
            horizontal: false,
            onEnter: () => {
                if (!triggered.current) { triggered.current = true; start(); }
            },
        });
        // También triggerear periódicamente mientras está en escena
        const interval = setInterval(() => { start(); }, 4000);
        return () => { st.kill(); clearInterval(interval); };
    }, []);

    return (
        <span ref={ref} style={{ color, fontFamily: 'inherit' }}>{display}</span>
    );
}

// ─── Definición de filas ──────────────────────────────────────────────────────
// Cada segmento de texto puede ser string o { word, color } o { type: 'card' }
type Segment = string | { word: string; color: string } | { type: 'card' } | { type: 'logo-iso' } | { type: 'logo-tipo' };

interface RowDef {
    fontSize: string;
    baseColor: string;
    direction: -1 | 1;
    scrub: number;
    segments: Segment[];
    card: { src: string; label: string; stage: string; status: string } | null;
    /** 0–1, at which scroll progress the card should be centered on screen. Default 0.5. */
    cardScrollOffset?: number;
}

const RED = 'rgba(220,40,40,0.9)';
const W1 = 'rgba(255,255,255,0.13)';
const W2 = 'rgba(160,160,160,0.10)';
const W3 = 'rgba(200,200,200,0.11)';

const MAX_TRAVEL = 900; // máximo de píxeles de recorrido horizontal — controla la velocidad real

const ROWS: RowDef[] = [
    {
        fontSize: 'clamp(100px, 13vw, 155px)',
        baseColor: W1,
        direction: -1,
        scrub: 10,
        cardScrollOffset: 0.43,
        card: { src: '/specimen_a.webm', label: 'SPECIMEN_01', stage: 'III', status: 'ACTIVE' },
        segments: [
            'FIELDWORK ',
            { type: 'logo-iso' },
            ' ',
            { word: 'MUTATION', color: RED },
            { type: 'card' },
            ' → DESIGN ⊕ ANTHROPOLOGY → ',
            { word: 'MUTATION', color: RED },
            ' ',
            { type: 'logo-iso' },
            ' ORGANISM \u00a0',
        ],
    },
    {
        fontSize: 'clamp(140px, 18vw, 210px)',
        baseColor: W2,
        direction: 1,
        scrub: 12,
        card: null,
        segments: [
            'DIALOGUE ⤵ ',
            { word: 'LISTENING', color: RED },
            ' → IDENTITY ',
            { type: 'logo-tipo' },
            ' WORLDS → BRAND ',
            { type: 'logo-tipo' },
            ' ',
            { word: 'LISTENING', color: RED },
            ' → NARRATIVE \u00a0',
        ],
    },
    {
        fontSize: 'clamp(110px, 14vw, 170px)',
        baseColor: W3,
        direction: -1,
        scrub: 10,
        cardScrollOffset: 0.58,
        card: { src: '/specimen_b.webm', label: 'SPECIMEN_02', stage: 'VII', status: 'CRITICAL' },
        segments: [
            'BIOLOGY ⊕ INTERFACE → ',
            { word: 'METAMORPHOSIS', color: RED },
            ' ⤵ ',
            { type: 'card' },
            ' PROTOCOL → ',
            { word: 'METAMORPHOSIS', color: RED },
            ' ⊕ ARCHIVE \u00a0',
        ],
    },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export function TickerSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Mobile: no GSAP scrub — rows are positioned statically
        if (window.innerWidth < 768) return;

        // Wait for fonts to be fully loaded before measuring widths
        // (LunaObscura loads async; RAF alone isn't enough — font swap changes element widths)
        const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
        let cancelled = false;

        fontPromise.then(() => {
            if (cancelled) return;
            const ctx = gsap.context(() => {
                ROWS.forEach((row, i) => {
                    const el = rowRefs.current[i];
                    if (!el) return;

                    const halfWidth = el.scrollWidth / 2; // one copy's width
                    const travel = Math.min(halfWidth, MAX_TRAVEL); // cap speed
                    const vw = window.innerWidth;

                    // Find the first card in this row to center on it
                    const cardEl = el.querySelector('[data-ticker-card]') as HTMLElement | null;

                    let startX: number;
                    let endX: number;

                    if (cardEl) {
                        // Measure card's center position within the row
                        const rowRect = el.getBoundingClientRect();
                        const cardRect = cardEl.getBoundingClientRect();
                        const cardCenterInRow = (cardRect.left + cardRect.width / 2) - rowRect.left;

                        // Center card on screen at the target scroll progress.
                        const targetP = row.cardScrollOffset ?? 0.5;
                        const midX = -(cardCenterInRow - vw / 2);
                        startX = midX + travel * targetP;
                        endX = startX - travel;
                    } else {
                        // No card — default behavior
                        startX = row.direction === -1 ? 0 : -travel;
                        endX = row.direction === -1 ? -travel : 0;
                    }

                    gsap.fromTo(el,
                        { x: startX },
                        {
                            x: endX,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 80%',
                                end: 'bottom 20%',
                                // Reduced scrub on mobile-ish screens for responsiveness
                                scrub: row.scrub,
                            },
                        }
                    );
                });
            }, section);

            ctxRef.current = ctx;
        });

        const ctxRef = { current: null as gsap.Context | null };
        return () => {
            cancelled = true;
            ctxRef.current?.revert();
        };
    }, [isMobile]);

    return (
        <>
            <style>{`
                @font-face {
                    font-family: 'LunaObscura';
                    src: url('/hs_lunaobscura/HS_LunaObscura.woff2') format('woff2'),
                         url('/hs_lunaobscura/HS_LunaObscura.otf') format('opentype');
                }
                @keyframes rec-blink-tk { 0%,100%{opacity:1} 50%{opacity:0.2} }
                @keyframes ticker-scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes ticker-scroll-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
            `}</style>

            <section
                ref={sectionRef}
                id="ticker"
                aria-hidden="true"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: isMobile ? '30vh' : '65vh',
                    marginTop: isMobile ? 24 : 80,
                    marginBottom: isMobile ? 24 : 60,
                    backgroundColor: '#050505',
                    overflow: 'hidden',
                    isolation: 'isolate',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 0,
                }}
            >
                {/* Fade lateral */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
                    background: 'linear-gradient(to right, #050505 0%, transparent 6%, transparent 94%, #050505 100%)',
                }} />
                {/* Fade top/bottom */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '12vh', background: 'linear-gradient(to bottom,#050505,transparent)', zIndex: 9, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '12vh', background: 'linear-gradient(to top,#050505,transparent)', zIndex: 9, pointerEvents: 'none' }} />

                {ROWS.map((row, i) => (
                    <div
                        key={i}
                        ref={el => { rowRefs.current[i] = el; }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                            willChange: 'transform',
                            lineHeight: 1,
                            margin: 0, padding: 0,
                            // Mobile: CSS auto-scroll always left, avoids jump glitch
                            ...(isMobile ? {
                                animation: `ticker-scroll-left ${22 + i * 5}s linear infinite`,
                            } : {}),
                        }}
                    >
                        <RowContent row={row} />
                        {/* Duplicado para loop continuo */}
                        <RowContent row={row} />
                    </div>
                ))}
            </section>
        </>
    );
}

// ─── Contenido de una fila (DRY para el duplicado) ────────────────────────────
function RowContent({ row }: { row: RowDef }) {
    return (
        <>
            {row.segments.map((seg, j) => {
                if (typeof seg === 'string') {
                    return (
                        <span key={j} style={{
                            fontFamily: "'LunaObscura', monospace",
                            fontSize: row.fontSize,
                            letterSpacing: '0.04em',
                            color: row.baseColor,
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            userSelect: 'none',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                        }}>{seg}</span>
                    );
                }
                if ('type' in seg && seg.type === 'card' && row.card) {
                    return (
                        <SpecimenCardInline
                            key={j}
                            src={row.card.src}
                            height={row.fontSize}
                            label={row.card.label}
                            stage={row.card.stage}
                            status={row.card.status}
                        />
                    );
                }
                if ('type' in seg && (seg.type === 'logo-iso' || seg.type === 'logo-tipo')) {
                    const src = seg.type === 'logo-iso' ? '/logo_isologo.png' : '/logo_logotipo.png';
                    return (
                        <img
                            key={j}
                            src={src}
                            alt="orko logo"
                            style={{
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                height: row.fontSize,
                                width: 'auto',
                                opacity: 0.55,
                                filter: 'invert(1)',
                                userSelect: 'none',
                                pointerEvents: 'none',
                                margin: '0 12px',
                                flexShrink: 0,
                            }}
                        />
                    );
                }
                if ('word' in seg) {
                    return (
                        <span key={j} style={{
                            fontFamily: "'LunaObscura', monospace",
                            fontSize: row.fontSize,
                            letterSpacing: '0.04em',
                            color: seg.color,
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            userSelect: 'none',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                        }}>{seg.word}</span>
                    );
                }
                return null;
            })}
        </>
    );
}

// ─── Card inline con glitch ───────────────────────────────────────────────────
function SpecimenCardInline({
    src, height: heightRaw, label, stage, status,
}: {
    src: string; height: string | number;
    label: string; stage: string; status: string;
}) {
    const heightPx = typeof heightRaw === 'number' ? heightRaw : 130;
    const headerH = Math.max(18, Math.round(heightPx * 0.16));
    const footerH = Math.max(16, Math.round(heightPx * 0.14));
    const fs = Math.max(8, Math.round(heightPx * 0.075));

    const videoRef = useRef<HTMLVideoElement>(null);
    const glitchCanvasRef = useRef<HTMLCanvasElement>(null);
    const glitchFrameRef = useRef<number>(0);

    // Glitch effect — triggers near the end of each video loop
    useEffect(() => {
        const video = videoRef.current;
        const canvas = glitchCanvasRef.current;
        if (!video || !canvas) return;
        const ctx2 = canvas.getContext('2d');
        if (!ctx2) return;

        let glitching = false;

        function triggerGlitch() {
            if (glitching) return;
            glitching = true;
            canvas!.style.opacity = '1';
            let frames = 0;

            function draw() {
                ctx2!.clearRect(0, 0, canvas!.width, canvas!.height);
                for (let b = 0; b < 5; b++) {
                    const y = Math.random() * canvas!.height;
                    const h = Math.random() * 8 + 2;
                    const sx = (Math.random() - 0.5) * 20;
                    ctx2!.drawImage(video!, sx, y, canvas!.width, h, 0, y, canvas!.width, h);
                    ctx2!.fillStyle =
                        Math.random() > 0.5
                            ? `rgba(255,0,0,${Math.random() * 0.4})`
                            : `rgba(0,255,65,${Math.random() * 0.3})`;
                    ctx2!.fillRect(0, y, canvas!.width, h);
                }
                frames++;
                if (frames < 18) {
                    glitchFrameRef.current = requestAnimationFrame(draw);
                } else {
                    ctx2!.clearRect(0, 0, canvas!.width, canvas!.height);
                    canvas!.style.opacity = '0';
                    glitching = false;
                }
            }
            draw();
        }

        function onTime() {
            if (video!.duration && video!.currentTime >= video!.duration - 0.4) {
                triggerGlitch();
            }
        }

        video.addEventListener('timeupdate', onTime);
        return () => {
            video.removeEventListener('timeupdate', onTime);
            cancelAnimationFrame(glitchFrameRef.current);
        };
    }, []);

    const statusColor = status === 'CRITICAL' ? '#FF3B3B'
        : status === 'DORMANT' ? 'rgba(160,160,160,0.6)'
            : 'rgba(200,200,200,0.7)';

    return (
        <span data-ticker-card style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            height: heightRaw,
            aspectRatio: '1 / 1',
            flexShrink: 0,
            position: 'relative',
            backgroundColor: '#06080a',
            border: '1px solid rgba(255,255,255,0.18)',
            overflow: 'hidden',
            boxShadow: '0 4px 32px rgba(0,0,0,0.9)',
            margin: '0 20px',
        }}>
            {/* Header */}
            <span style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: headerH,
                backgroundColor: 'rgba(6,8,10,0.97)',
                borderBottom: '1px solid rgba(255,255,255,0.09)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px', zIndex: 3,
            }}>
                <span style={{
                    fontFamily: "'LunaObscura',monospace",
                    fontSize: fs, letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1,
                }}>{label}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{
                        display: 'inline-block',
                        width: Math.max(4, fs * 0.55), height: Math.max(4, fs * 0.55),
                        borderRadius: '50%', backgroundColor: '#FF3B3B', flexShrink: 0,
                        animation: 'rec-blink-tk 1.2s step-end infinite',
                    }} />
                    <span style={{
                        fontFamily: "'LunaObscura',monospace",
                        fontSize: Math.max(6, fs - 1),
                        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', lineHeight: 1,
                    }}>REC</span>
                </span>
            </span>

            {/* Video */}
            <video
                ref={videoRef}
                src={src}
                autoPlay muted loop playsInline
                suppressHydrationWarning
                style={{
                    position: 'absolute',
                    top: headerH, left: 0,
                    width: '100%',
                    height: `calc(100% - ${headerH + footerH}px)`,
                    objectFit: 'cover',
                    opacity: 1,
                }}
            />

            {/* Glitch canvas */}
            <canvas
                ref={glitchCanvasRef}
                width={240}
                height={240}
                style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    opacity: 0, pointerEvents: 'none', zIndex: 4,
                }}
            />

            {/* Scanlines */}
            <span style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)',
                pointerEvents: 'none', zIndex: 2,
            }} />

            {/* Footer */}
            <span style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: footerH,
                backgroundColor: 'rgba(6,8,10,0.97)',
                borderTop: '1px solid rgba(255,255,255,0.09)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px', zIndex: 3,
            }}>
                <span style={{
                    fontFamily: "'LunaObscura',monospace",
                    fontSize: fs, letterSpacing: '0.12em',
                    color: 'rgba(200,200,200,0.65)',
                    textTransform: 'uppercase', lineHeight: 1,
                }}>STG {stage}</span>
                <span style={{
                    fontFamily: "'LunaObscura',monospace",
                    fontSize: fs, letterSpacing: '0.1em',
                    color: statusColor,
                    textTransform: 'uppercase', lineHeight: 1,
                }}>{status}</span>
            </span>
        </span>
    );
}