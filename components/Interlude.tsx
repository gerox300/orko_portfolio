'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COLORS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

const LINES = [
    { text: "I'm Gerónimo Astorga,", delay: 0 },
    { text: "an [ANTHROPOLOGIST] and [DESIGNER]", delay: 0.08 },
    { text: "based in Buenos Aires.", delay: 0.16 },
    { text: "", delay: 0 },
    { text: "Most design talks at people.", delay: 0.24 },
    { text: "I'm interested in the kind that comes from [LISTENING],", delay: 0.32 },
    { text: "that moves through [DIALOGUE],", delay: 0.40 },
    { text: "and holds its shape inside the [WORLDS]", delay: 0.48 },
    { text: "it was made for.", delay: 0.54 },
    { text: "", delay: 0 },
    { text: "Designing from the [HUMAN] condition,", delay: 0.62 },
    { text: "towards a [SYMBIOTIC] future.", delay: 0.70 },
];

const FILLED_PILLS = new Set(['ANTHROPOLOGIST', 'DESIGNER']);
const OUTLINED_PILLS = new Set(['LISTENING', 'DIALOGUE', 'WORLDS']);
const PILL_GREEN = '#00FF41';

// ─── FilledPill ───────────────────────────────────────────────────────────────
// FIX: texto con mix-blend-mode:difference → verde sobre negro, negro sobre verde
// El relleno sweepea detrás del texto. Texto SIEMPRE visible.
function FilledPill({ word }: { word: string }) {
    return (
        <span style={{
            display: 'inline-block',
            position: 'relative',
            margin: '0 5px',
            padding: '3px 11px',
            fontSize: '0.85em',
            fontWeight: 700,
            letterSpacing: '0.08em',
            lineHeight: 1.6,
            verticalAlign: 'middle',
        }}>
            {/* z:1 — borde SVG */}
            <svg aria-hidden="true" style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                overflow: 'visible', pointerEvents: 'none', zIndex: 2,
            }} preserveAspectRatio="none">
                <rect x="0.5" y="0.5" width="99%" height="96%"
                    fill="none" stroke={PILL_GREEN} strokeWidth="1"
                    style={{
                        strokeDasharray: 600,
                        strokeDashoffset: 600,
                        animation: 'border-draw 0.4s ease-out forwards',
                    }}
                />
            </svg>
            {/* z:1 — relleno, detrás del texto */}
            <span style={{
                position: 'absolute', inset: 0,
                background: PILL_GREEN,
                transformOrigin: 'left center',
                transform: 'scaleX(0)',
                zIndex: 1,
                animation: 'fill-sweep 0.35s ease-out 0.42s forwards',
            }} />
            {/* z:3 — texto con difference: siempre contrasta con el fondo */}
            <span style={{
                position: 'relative',
                zIndex: 3,
                color: PILL_GREEN,
                mixBlendMode: 'difference',
            }}>{word}</span>
        </span>
    );
}

// ─── OutlinedPill ─────────────────────────────────────────────────────────────
// Solo borde, 1.2s. Texto verde siempre visible.
function OutlinedPill({ word }: { word: string }) {
    return (
        <span style={{
            display: 'inline-block', position: 'relative',
            margin: '0 5px', padding: '3px 11px',
            fontSize: '0.85em', fontWeight: 700,
            letterSpacing: '0.08em', lineHeight: 1.6,
            color: PILL_GREEN, verticalAlign: 'middle',
        }}>
            <svg aria-hidden="true" style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                overflow: 'visible', pointerEvents: 'none', zIndex: 2,
            }} preserveAspectRatio="none">
                <rect x="0.5" y="0.5" width="99%" height="96%"
                    fill="none" stroke={PILL_GREEN} strokeWidth="1"
                    style={{
                        strokeDasharray: 600,
                        strokeDashoffset: 600,
                        animation: 'border-draw 1.2s ease-out forwards',
                    }}
                />
            </svg>
            <span style={{ position: 'relative', zIndex: 3 }}>{word}</span>
        </span>
    );
}

function renderLine(text: string) {
    return text.split(/(\[[^\]]+\])/g).map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
            const word = part.slice(1, -1);
            if (FILLED_PILLS.has(word)) return <FilledPill key={i} word={word} />;
            if (OUTLINED_PILLS.has(word)) return <OutlinedPill key={i} word={word} />;
        }
        return <span key={i}>{part}</span>;
    });
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function useTypewriter(lines: typeof LINES, active: boolean) {
    const [revealed, setRevealed] = useState<string[]>(lines.map(() => ''));
    const [cursorVisible, setCursorVisible] = useState(false);
    useEffect(() => {
        if (!active) return;
        let cancelled = false;
        async function run() {
            for (let i = 0; i < lines.length; i++) {
                const { text, delay } = lines[i];
                await sleep(delay * 800);
                if (cancelled) return;
                if (!text) { setRevealed(p => { const n = [...p]; n[i] = ''; return n; }); continue; }
                for (let c = 0; c <= text.length; c++) {
                    if (cancelled) return;
                    setRevealed(p => { const n = [...p]; n[i] = text.slice(0, c); return n; });
                    await sleep(18);
                }
            }
            if (!cancelled) setCursorVisible(true);
        }
        run();
        return () => { cancelled = true; };
    }, [active]);
    return { revealed, cursorVisible };
}
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── Interlude ────────────────────────────────────────────────────────────────
export function Interlude() {
    const sectionRef = useRef<HTMLElement>(null);
    // cardWrapRef: GSAP anima scaleY aquí (sin float CSS)
    const cardWrapRef = useRef<HTMLDivElement>(null);
    const tickerRow1Ref = useRef<HTMLDivElement>(null);
    const tickerRow2Ref = useRef<HTMLDivElement>(null);
    const [textActive, setTextActive] = useState(false);
    const { revealed, cursorVisible } = useTypewriter(LINES, textActive);

    useEffect(() => {
        const section = sectionRef.current;
        const cardWrap = cardWrapRef.current;
        if (!section || !cardWrap) return;

        const ctx = gsap.context(() => {

            // Typewriter
            ScrollTrigger.create({
                trigger: section,
                start: 'top 70%',
                onEnter: () => setTextActive(true),
                once: true,
            });

            // ── Card: scaleY 0→1 desde el centro, una sola vez ──
            // cardWrap es el wrapper externo. NO tiene CSS float.
            // El div interno .specimen-card-float tiene el float CSS.
            gsap.set(cardWrap, { scaleY: 0, transformOrigin: '50% 50%' });
            ScrollTrigger.create({
                trigger: section,
                start: '5% center',
                onEnter: () => {
                    gsap.to(cardWrap, {
                        scaleY: 1,
                        duration: 0.65,
                        ease: 'power3.out',
                    });
                },
                once: true,
            });



            // ── Ticker horizontal scrubbed ──
            // Fila 1: se mueve de derecha a izquierda con scroll
            // Fila 2: dirección opuesta
            const row1 = tickerRow1Ref.current;
            const row2 = tickerRow2Ref.current;
            if (row1 && row2) {
                gsap.fromTo(row1,
                    { x: '0%' },
                    {
                        x: '-50%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: '40% bottom',
                            end: 'bottom top',
                            scrub: 1,
                        },
                    }
                );
                gsap.fromTo(row2,
                    { x: '-50%' },
                    {
                        x: '0%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: '40% bottom',
                            end: 'bottom top',
                            scrub: 1,
                        },
                    }
                );
            }

        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <style>{`
                @keyframes border-draw { to { stroke-dashoffset: 0; } }
                @keyframes fill-sweep  { from { transform: scaleX(0); } to { transform: scaleX(1); } }
                @keyframes blink-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
                @keyframes card-float  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
            `}</style>

            <section
                id="interlude"
                ref={sectionRef}
                aria-label="Personal statement"
                style={{
                    minHeight: '130vh',
                    width: '100%',
                    position: 'relative',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: 'clamp(80px, 15vh, 160px)',
                    paddingBottom: 'clamp(80px, 15vh, 160px)',
                    paddingLeft: 'clamp(20px, 4vw, 40px)',
                    paddingRight: 'clamp(20px, 4vw, 40px)',
                    zIndex: 3,
                }}
            >
                {/* Grid — card izquierda, texto derecha */}
                <div style={{
                    maxWidth: 1100, width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.4fr',
                    gap: 'clamp(40px, 6vw, 80px)',
                    alignItems: 'start',
                }}>
                    {/* Columna izquierda — card */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 40 }}>
                        {/*
                            cardWrapRef: GSAP hace scaleY 0→1 aquí.
                            .specimen-card-float adentro: CSS float independiente.
                            Los dos transforms no se pisan.
                        */}
                        <div ref={cardWrapRef} style={{ transformOrigin: '50% 50%', width: '100%', maxWidth: 240 }}>
                            <SpecimenCard />
                        </div>
                    </div>

                {/* Columna derecha — texto */}
                    <div style={{ paddingLeft: 'clamp(0px, 3vw, 48px)', position: 'relative' }}>
                        {LINES.map((line, i) => (
                            <div key={i} style={{
                                fontFamily: 'var(--font-jetbrains-mono), monospace',
                                fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
                                lineHeight: 2,
                                letterSpacing: '0.02em',
                                color: COLORS.textBone,
                                minHeight: line.text ? 'auto' : '1.5em',
                            }}>
                                {line.text ? renderLine(revealed[i] || '') : null}
                            </div>
                        ))}
                        {cursorVisible && (
                            <div style={{
                                display: 'inline-block',
                                width: '0.6em', height: '1.2em',
                                backgroundColor: COLORS.accentInfrared,
                                marginLeft: 4,
                                animation: 'blink-cursor 1s step-end infinite',
                            }} />
                        )}

                        {/* Palabras gigantes de fondo para llenar el espacio */}
                        <div style={{
                            position: 'absolute',
                            top: '80%',
                            left: '-15%',
                            fontSize: 'clamp(6rem, 25vw, 22rem)',
                            fontFamily: "'LunaObscura', monospace",
                            color: PILL_GREEN,
                            opacity: 0.03,
                            lineHeight: 0.7,
                            letterSpacing: '-0.05em',
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                            zIndex: -1,
                        }}>
                            ANTHROPOS
                        </div>
                    </div>
                </div>

                {/* ── Ticker horizontal ── */}
                <div style={{
                    position: 'absolute',
                    bottom: '15vh',
                    left: 0,
                    width: '100%',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                }}>
                    {/* Fila 1 — va izquierda con scroll */}
                    <div ref={tickerRow1Ref} style={{
                        display: 'flex',
                        whiteSpace: 'nowrap',
                        willChange: 'transform',
                    }}>
                        <span style={{
                            fontFamily: "'LunaObscura', monospace",
                            fontSize: 'clamp(48px, 8vw, 96px)',
                            letterSpacing: '0.04em',
                            color: 'rgba(255,255,255,0.07)',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            paddingRight: '4vw',
                        }}>FIELDWORK ⊕ MUTATION → SITUATED ⊕ ORGANISM → DESIGN ⊕ ANTHROPOLOGY → INTERFACE ⊕ CULTURE → FORM ⊕ FIELDWORK ⊕ MUTATION → SITUATED ⊕ ORGANISM → DESIGN ⊕ ANTHROPOLOGY → INTERFACE ⊕ CULTURE → FORM</span>
                    </div>
                    {/* Fila 2 — va derecha con scroll (opuesta) */}
                    <div ref={tickerRow2Ref} style={{
                        display: 'flex',
                        whiteSpace: 'nowrap',
                        willChange: 'transform',
                    }}>
                        <span style={{
                            fontFamily: "'LunaObscura', monospace",
                            fontSize: 'clamp(48px, 8vw, 96px)',
                            letterSpacing: '0.04em',
                            color: 'rgba(0,255,65,0.06)',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            paddingRight: '4vw',
                        }}>DIALOGUE ⤵ LISTENING → IDENTITY ⊕ FIELDWORK ⤴ WORLDS → BRAND ⊕ DIALOGUE ⤵ LISTENING → IDENTITY ⊕ FIELDWORK ⤴ WORLDS → BRAND ⊕ DIALOGUE ⤵ LISTENING → IDENTITY</span>
                    </div>
                </div>
            </section>
        </>
    );
}

// ─── SpecimenCard ─────────────────────────────────────────────────────────────
// Este componente NO recibe cardRef. El wrapper externo en Interlude es quien
// recibe el ref de GSAP. Este div interno solo tiene el float CSS.
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_/\\[]';
const HEADER_TEXT = 'SPECIMEN_LAB';

function SpecimenCard() {
    const [hovered, setHovered] = useState(false);
    const [headerText, setHeaderText] = useState(HEADER_TEXT);
    const videoRef = useRef<HTMLVideoElement>(null);
    const glitchCanvasRef = useRef<HTMLCanvasElement>(null);
    const glitchFrameRef = useRef<number>(0);
    const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (hovered) {
            let it = 0;
            scrambleRef.current = setInterval(() => {
                setHeaderText(HEADER_TEXT.split('').map((ch, idx) => {
                    if (ch === '_') return '_';
                    if (idx < it) return HEADER_TEXT[idx];
                    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                }).join(''));
                it += 0.4;
                if (it >= HEADER_TEXT.length) { setHeaderText(HEADER_TEXT); clearInterval(scrambleRef.current!); }
            }, 40);
        } else {
            clearInterval(scrambleRef.current!);
            setHeaderText(HEADER_TEXT);
        }
        return () => clearInterval(scrambleRef.current!);
    }, [hovered]);

    useEffect(() => {
        const v = videoRef.current;
        if (v) v.playbackRate = hovered ? 3.5 : 1;
    }, [hovered]);

    useEffect(() => {
        const video = videoRef.current, canvas = glitchCanvasRef.current;
        if (!video || !canvas) return;
        const ctx2 = canvas.getContext('2d'); if (!ctx2) return;
        let glitching = false;
        function triggerGlitch() {
            if (glitching) return; glitching = true; canvas!.style.opacity = '1';
            let frames = 0;
            function draw() {
                ctx2!.clearRect(0, 0, canvas!.width, canvas!.height);
                for (let b = 0; b < 5; b++) { const y = Math.random() * canvas!.height, h = Math.random() * 8 + 2, sx = (Math.random() - .5) * 20; ctx2!.drawImage(video!, sx, y, canvas!.width, h, 0, y, canvas!.width, h); ctx2!.fillStyle = Math.random() > .5 ? `rgba(255,0,0,${Math.random() * .4})` : `rgba(0,255,65,${Math.random() * .3})`; ctx2!.fillRect(0, y, canvas!.width, h); }
                frames++; if (frames < 18) glitchFrameRef.current = requestAnimationFrame(draw); else { ctx2!.clearRect(0, 0, canvas!.width, canvas!.height); canvas!.style.opacity = '0'; glitching = false; }
            } draw();
        }
        function onTime() { if (video!.duration && video!.currentTime >= video!.duration - .4) triggerGlitch(); }
        video.addEventListener('timeupdate', onTime);
        return () => { video.removeEventListener('timeupdate', onTime); cancelAnimationFrame(glitchFrameRef.current); };
    }, []);

    const bc = hovered ? 'rgba(255,40,40,0.7)' : 'rgba(255,255,255,0.18)';
    const bs = hovered ? '0 0 24px rgba(255,40,40,0.2),0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.4)';

    return (
        <>
            <style>{`
                @font-face{font-family:'LunaObscura';src:url('/hs_lunaobscura/HS_LunaObscura.woff2') format('woff2'),url('/hs_lunaobscura/HS_LunaObscura.otf') format('opentype');}
                @keyframes rec-blink{0%,100%{opacity:1}50%{opacity:.2}}
                .specimen-card-float{animation:card-float 4s ease-in-out infinite;}
            `}</style>

            {/* .specimen-card-float: CSS translateY float, independiente del scaleY de GSAP */}
            <div
                className="specimen-card-float"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: 'relative', width: '100%',
                    backgroundColor: '#06080a',
                    border: `1px solid ${bc}`,
                    boxShadow: bs,
                    overflow: 'hidden',
                    transition: 'border-color 0.3s ease,box-shadow 0.3s ease',
                    cursor: 'default',
                }}
            >
                <div style={{ padding: '9px 12px 8px', borderBottom: `1px solid ${hovered ? 'rgba(255,40,40,.25)' : 'rgba(255,255,255,.08)'}`, backgroundColor: 'rgba(6,8,10,.97)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={luna(10, 'rgba(255,255,255,.85)', .15)}>{headerText}</span>
                        <RecDot hovered={hovered} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <DataRow label="NEURAL_ACTIVITY" value="SCANNING" accent />
                        <DataRow label="CELL_DENSITY" value="OVERLOAD" warn />
                        <DataRow label="MUTATION_STAGE" value="IV" accent />
                    </div>
                </div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#030505' }}>
                    <video ref={videoRef} src="/video_cell.webm" autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .9, mixBlendMode: 'screen' }} />
                    <canvas ref={glitchCanvasRef} width={240} height={240} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none', zIndex: 3 }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.1) 2px,rgba(0,0,0,.1) 4px)', pointerEvents: 'none', zIndex: 2 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 85% 85% at 50% 50%,transparent 40%,rgba(6,8,10,.7) 100%)', pointerEvents: 'none', zIndex: 2 }} />
                </div>
                <div style={{ padding: '8px 12px', borderTop: `1px solid ${hovered ? 'rgba(255,40,40,.25)' : 'rgba(255,255,255,.08)'}`, backgroundColor: 'rgba(6,8,10,.97)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={luna(12, hovered ? 'rgba(255,80,80,.95)' : 'rgba(255,255,255,.85)', .18)}>MUTATION 07</span>
                    <span style={luna(8, '#FF3B3B', .12)}>CRITICAL</span>
                </div>
            </div>
        </>
    );
}
function RecDot({ hovered }: { hovered: boolean }) { return (<div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}><div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#FF3B3B', boxShadow: hovered ? '0 0 8px #FF3B3B' : '0 0 4px #FF3B3B', animation: 'rec-blink 1.2s step-end infinite' }} /><span style={luna(7, 'rgba(255,255,255,.4)', .1)}>REC</span></div>); }
function DataRow({ label, value, accent, warn }: { label: string; value: string; accent?: boolean; warn?: boolean }) { const vc = warn ? '#FF5555' : accent ? '#00FF41' : 'rgba(255,255,255,.7)'; return (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}><span style={luna(8, 'rgba(255,255,255,.5)', .08)}>{label}</span><span style={{ ...luna(9, vc, .06), fontWeight: 700 }}>{value}</span></div>); }
function luna(size: number, color: string, spacing: number): React.CSSProperties { return { fontFamily: "'LunaObscura',var(--font-jetbrains-mono),monospace", fontSize: size, letterSpacing: `${spacing}em`, color, textTransform: 'uppercase' as const, lineHeight: 1.3, whiteSpace: 'nowrap' as const }; }