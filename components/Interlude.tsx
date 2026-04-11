'use client';

/**
 * Interlude — texto typewriter + SpecimenCard
 * El ticker horizontal va en TickerSection.tsx (componente separado)
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COLORS } from '@/lib/constants';
import { useLanguage } from '@/components/providers/LanguageProvider';

gsap.registerPlugin(ScrollTrigger);

const LINES_EN = [
    { text: "I'm Gerónimo Astorga,", delay: 0 },
    { text: "an [ANTHROPOLOGIST] and [DESIGNER]", delay: 0.08 },
    { text: "based in Buenos Aires.", delay: 0.16 },
    { text: "", delay: 0 },
    { text: "Most design talks at people.", delay: 0.24 },
    { text: "I'm interested in the kind that comes from [LISTENING],", delay: 0.32 },
    { text: "that moves through [DIALOGUE],", delay: 0.40 },
    { text: "and holds its shape inside the [WORLDS]", delay: 0.48 },
    { text: "it was made for.", delay: 0.54 },
];

const LINES_ES = [
    { text: "Soy Gerónimo Astorga,", delay: 0 },
    { text: "antropólogo y [DISEÑADOR]", delay: 0.08 },
    { text: "con base en Buenos Aires.", delay: 0.16 },
    { text: "", delay: 0 },
    { text: "La mayoría del diseño le habla a la gente.", delay: 0.24 },
    { text: "A mí me interesa el que nace de [ESCUCHAR],", delay: 0.32 },
    { text: "el que avanza a través del [DIÁLOGO],", delay: 0.40 },
    { text: "y mantiene su forma dentro de los [MUNDOS]", delay: 0.48 },
    { text: "para los que fue hecho.", delay: 0.54 },
];

const FILLED_PILLS = new Set(['ANTHROPOLOGIST', 'DESIGNER', 'ANTROPÓLOGO', 'DISEÑADOR', 'ANTROPOLOGO', 'DISENADOR']);
const OUTLINED_PILLS = new Set(['LISTENING', 'DIALOGUE', 'WORLDS', 'ESCUCHAR', 'DIÁLOGO', 'DIALOGO', 'MUNDOS']);
const PILL_GREEN = '#00FF41';

// ─── FilledPill ───────────────────────────────────────────────────────────────
function FilledPill({ word }: { word: string }) {
    return (
        <span style={{
            display: 'inline-block', position: 'relative',
            margin: '0 5px', padding: '3px 11px',
            fontSize: '0.85em', fontWeight: 700,
            letterSpacing: '0.08em', lineHeight: 1.6,
            verticalAlign: 'middle',
        }}>
            <svg aria-hidden="true" style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                overflow: 'visible', pointerEvents: 'none', zIndex: 2,
            }} preserveAspectRatio="none">
                <rect x="0.5" y="0.5" width="99%" height="96%"
                    fill="none" stroke={PILL_GREEN} strokeWidth="1"
                    style={{
                        strokeDasharray: 600, strokeDashoffset: 600,
                        animation: 'border-draw 0.4s ease-out forwards',
                    }}
                />
            </svg>
            <span style={{
                position: 'absolute', inset: 0,
                background: PILL_GREEN,
                transformOrigin: 'left center',
                transform: 'scaleX(0)',
                zIndex: 1,
                animation: 'fill-sweep 0.35s ease-out 0.42s forwards',
            }} />
            <span style={{
                position: 'relative', zIndex: 3,
                color: PILL_GREEN,
                mixBlendMode: 'difference',
            }}>{word}</span>
        </span>
    );
}

// ─── OutlinedPill ─────────────────────────────────────────────────────────────
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
                        strokeDasharray: 600, strokeDashoffset: 600,
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
interface TypewriterLine {
    text: string;
    delay: number;
}

function useTypewriter(lines: TypewriterLine[], active: boolean) {
    const [revealed, setRevealed] = useState<string[]>(lines.map(() => ''));
    const [cursorVisible, setCursorVisible] = useState(false);
    useEffect(() => {
        setRevealed(lines.map(() => '')); // Reset state when lines change
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
    }, [active, lines]);
    return { revealed, cursorVisible };
}
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ─── Interlude ────────────────────────────────────────────────────────────────
export function Interlude() {
    const { lang } = useLanguage();
    const LINES = lang === 'es' ? LINES_ES : LINES_EN;
    const sectionRef = useRef<HTMLElement>(null);
    const cardWrapRef = useRef<HTMLDivElement>(null);
    const [textActive, setTextActive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { revealed, cursorVisible } = useTypewriter(LINES, textActive);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        const cardWrap = cardWrapRef.current;
        if (!section || !cardWrap) return;

        const ctx = gsap.context(() => {

            // Typewriter — arranca cuando la sección entra en vista
            ScrollTrigger.create({
                trigger: section,
                start: 'top 70%',
                onEnter: () => setTextActive(true),
                once: true,
            });

            // Card — scaleY 0→1 desde el centro
            gsap.set(cardWrap, { scaleY: 0, transformOrigin: '50% 50%' });
            ScrollTrigger.create({
                trigger: section,
                start: '5% center',
                onEnter: () => {
                    gsap.to(cardWrap, { scaleY: 1, duration: 0.65, ease: 'power3.out' });
                },
                once: true,
            });

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
                    position: 'relative',
                    width: '100%',
                    minHeight: isMobile ? 'auto' : '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    padding: isMobile
                        ? 'clamp(64px, 10vh, 96px) clamp(20px, 4vw, 40px) clamp(48px, 8vh, 80px)'
                        : 'clamp(40px, 12vh, 160px) clamp(20px, 5vw, 60px)',
                    overflow: 'hidden',
                }}
            >
                <div style={{
                    maxWidth: 1100, width: '100%',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr',
                    gap: isMobile ? 'clamp(32px, 5vh, 48px)' : 'clamp(40px, 6vw, 80px)',
                    position: 'relative',
                    zIndex: 1,
                    alignItems: 'center',
                }}>
                    {/* Columna izquierda — SpecimenCard (hidden on mobile to keep focus on text) */}
                    {!isMobile && (
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
                            <div ref={cardWrapRef} style={{ transformOrigin: '50% 50%', width: '100%', maxWidth: 240 }}>
                                <SpecimenCard />
                            </div>
                        </div>
                    )}

                    {/* Columna derecha (única en mobile) — texto typewriter */}
                    <motion.div
                        key={lang}
                        className="interlude-copy"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        onViewportEnter={() => setTextActive(true)}
                        viewport={{ once: true, margin: "-10%" }}
                        style={{ flex: '1 1 50%', minWidth: 0, width: '100%' }}
                    >
                        {LINES.map((line, i) => (
                            <div key={i} style={{
                                position: 'relative',
                                fontFamily: 'var(--font-jetbrains-mono), monospace',
                                fontSize: isMobile
                                    ? (lang === 'es' ? 'clamp(0.9rem, 4.5vw, 1.15rem)' : 'clamp(0.85rem, 4.2vw, 1.05rem)')
                                    : (lang === 'es' ? 'clamp(1.1rem, 2.4vw, 1.4rem)' : 'clamp(0.95rem, 2.2vw, 1.25rem)'),
                                lineHeight: isMobile ? 1.9 : 2.1,
                                letterSpacing: '0.02em',
                                color: COLORS.textBone,
                            }}>
                                {/* Invisible ghost keeps layout stable — no shifts during typewriter */}
                                <div style={{ visibility: 'hidden', pointerEvents: 'none' }}>
                                    {line.text ? renderLine(line.text) : <span dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />}
                                </div>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
                                    {line.text ? renderLine(revealed[i] || '') : null}
                                </div>
                            </div>
                        ))}
                        <span style={{
                            display: 'inline-block',
                            width: '0.6em', height: '1.2em',
                            backgroundColor: COLORS.accentInfrared,
                            marginLeft: 4,
                            animation: 'blink-cursor 1s step-end infinite',
                            opacity: cursorVisible ? 1 : 0,
                            visibility: cursorVisible ? 'visible' : 'hidden',
                        }} />
                    </motion.div>
                </div>
            </section>
        </>
    );
}

// ─── SpecimenCard ─────────────────────────────────────────────────────────────
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
                for (let b = 0; b < 5; b++) {
                    const y = Math.random() * canvas!.height, h = Math.random() * 8 + 2, sx = (Math.random() - .5) * 20;
                    ctx2!.drawImage(video!, sx, y, canvas!.width, h, 0, y, canvas!.width, h);
                    ctx2!.fillStyle = Math.random() > .5 ? `rgba(255,0,0,${Math.random() * .4})` : `rgba(0,255,65,${Math.random() * .3})`;
                    ctx2!.fillRect(0, y, canvas!.width, h);
                }
                frames++;
                if (frames < 18) glitchFrameRef.current = requestAnimationFrame(draw);
                else { ctx2!.clearRect(0, 0, canvas!.width, canvas!.height); canvas!.style.opacity = '0'; glitching = false; }
            }
            draw();
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
                @font-face { font-family:'LunaObscura';
                    src: url('/hs_lunaobscura/HS_LunaObscura.woff2') format('woff2'),
                         url('/hs_lunaobscura/HS_LunaObscura.otf') format('opentype'); }
                @keyframes rec-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
                .specimen-card-float { animation: card-float 4s ease-in-out infinite; }
            `}</style>

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
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                }}
            >
                {/* Header */}
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

                {/* Video cuadrado */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: '#030505' }}>
                    <video ref={videoRef} src="/video_cell.webm" autoPlay muted loop playsInline
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .9, mixBlendMode: 'screen' }} />
                    <canvas ref={glitchCanvasRef} width={240} height={240}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none', zIndex: 3 }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.1) 2px,rgba(0,0,0,.1) 4px)', pointerEvents: 'none', zIndex: 2 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 85% 85% at 50% 50%,transparent 40%,rgba(6,8,10,.7) 100%)', pointerEvents: 'none', zIndex: 2 }} />
                </div>

                {/* Footer */}
                <div style={{ padding: '8px 12px', borderTop: `1px solid ${hovered ? 'rgba(255,40,40,.25)' : 'rgba(255,255,255,.08)'}`, backgroundColor: 'rgba(6,8,10,.97)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={luna(12, hovered ? 'rgba(255,80,80,.95)' : 'rgba(255,255,255,.85)', .18)}>MUTATION 07</span>
                    <span style={luna(8, '#FF3B3B', .12)}>CRITICAL</span>
                </div>
            </div>
        </>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function RecDot({ hovered }: { hovered: boolean }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <div style={{
                width: 5, height: 5, borderRadius: '50%', backgroundColor: '#FF3B3B',
                boxShadow: hovered ? '0 0 8px #FF3B3B' : '0 0 4px #FF3B3B',
                animation: 'rec-blink 1.2s step-end infinite'
            }} />
            <span style={luna(7, 'rgba(255,255,255,.4)', .1)}>REC</span>
        </div>
    );
}

function DataRow({ label, value, accent, warn }: { label: string; value: string; accent?: boolean; warn?: boolean }) {
    const vc = warn ? '#FF5555' : accent ? '#00FF41' : 'rgba(255,255,255,.7)';
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={luna(8, 'rgba(255,255,255,.5)', .08)}>{label}</span>
            <span style={{ ...luna(9, vc, .06), fontWeight: 700 }}>{value}</span>
        </div>
    );
}

function luna(size: number, color: string, spacing: number): React.CSSProperties {
    return {
        fontFamily: "'LunaObscura',var(--font-jetbrains-mono),monospace",
        fontSize: size, letterSpacing: `${spacing}em`, color,
        textTransform: 'uppercase' as const,
        lineHeight: 1.3, whiteSpace: 'nowrap' as const,
    };
}