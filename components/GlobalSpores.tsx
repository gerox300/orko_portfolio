'use client';

/**
 * GlobalSpores
 * Fixed canvas covering entire viewport.
 * 
 * Zone behavior:
 *   HERO:       60 spores, normal wander, green on mouse
 *   INTERLUDE:  50 spores (reduced!), mild agitation, some red
 *   BIO:        15 spores, rise from bottom edge (like they're seeping in)
 *   AMBIENT:    10 spores, barely visible, very slow
 */

import { useEffect, useRef } from 'react';

const FLEE_RADIUS = 160;
const FLEE_FORCE = 6.0;
const SPRING_K = 0.005;
const FRICTION = 0.88;

const BONE = { r: 240, g: 240, b: 240 };
const TOXIC_GREEN = { r: 0, g: 255, b: 65 };
const INFRARED = { r: 255, g: 42, b: 0 };

interface Spore {
    x: number; y: number;
    homeX: number; homeY: number;
    wanderAngle: number; wanderSpeed: number;
    vx: number; vy: number;
    radius: number;
    baseOpacity: number;
    fleeIntensity: number;
    scrollPanic: number;
    risingFromBottom: boolean;
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function createSpore(w: number, h: number, fromBottom = false): Spore {
    return {
        x: Math.random() * w,
        y: fromBottom ? h + Math.random() * 50 : Math.random() * h,
        homeX: Math.random() * w,
        homeY: fromBottom ? h * 0.3 + Math.random() * h * 0.5 : Math.random() * h, // rise to mid-screen
        wanderAngle: Math.random() * Math.PI * 2,
        wanderSpeed: 0.1 + Math.random() * 0.2,
        vx: 0, vy: fromBottom ? -(0.2 + Math.random() * 0.3) : 0, // initial upward velocity
        radius: 1.2 + Math.random() * 2,
        baseOpacity: 0.2 + Math.random() * 0.4,
        fleeIntensity: 0,
        scrollPanic: 0,
        risingFromBottom: fromBottom,
    };
}

function getScrollZone(): { zone: string } {
    const hero = document.getElementById('hero');
    const interlude = document.getElementById('interlude');
    const ticker = document.getElementById('ticker');
    const bio = document.getElementById('bio');
    const services = document.getElementById('services-wrapper');
    const works = document.getElementById('works');
    const footer = document.getElementById('footer');
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        if (scrollY < heroBottom - vh * 0.3) return { zone: 'hero' };
    }
    if (interlude) {
        const intTop = interlude.offsetTop;
        const intBottom = intTop + interlude.offsetHeight;
        if (scrollY + vh > intTop && scrollY < intBottom) return { zone: 'interlude' };
    }
    if (ticker) {
        const tckTop = ticker.offsetTop;
        const tckBottom = tckTop + ticker.offsetHeight;
        if (scrollY + vh > tckTop && scrollY < tckBottom) return { zone: 'ticker' };
    }
    if (bio) {
        const bioTop = bio.offsetTop;
        const bioBottom = bioTop + bio.offsetHeight;
        if (scrollY + vh > bioTop && scrollY < bioBottom) return { zone: 'bio' };
    }
    if (services) {
        const srvTop = services.offsetTop;
        const srvBottom = srvTop + services.offsetHeight;
        if (scrollY + vh > srvTop && scrollY < srvBottom) return { zone: 'services' };
    }
    if (works) {
        const wkTop = works.offsetTop;
        const wkBottom = wkTop + works.offsetHeight;
        if (scrollY + vh > wkTop && scrollY < wkBottom) return { zone: 'works' };
    }
    if (footer) {
        const ftTop = footer.offsetTop;
        const ftBottom = ftTop + footer.offsetHeight;
        if (scrollY + vh > ftTop && scrollY < ftBottom) return { zone: 'footer' };
    }
    return { zone: 'ambient' };
}

export function GlobalSpores() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const sporesRef = useRef<Spore[]>([]);
    const rafRef = useRef<number>(0);
    const currentOpacityMult = useRef(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        function resize() {
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight;
            if (sporesRef.current.length === 0) {
                sporesRef.current = Array.from({ length: 60 }, () => createSpore(canvas!.width, canvas!.height));
            }
        }

        function draw() {
            rafRef.current = requestAnimationFrame(draw);
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

            const mouse = mouseRef.current;
            const sRef = sporesRef.current;
            const { zone } = getScrollZone();

            let targetCount = 60;
            let panicLevel = 0;
            let maxSpores = 150;
            let globalOpacityMult = 1;
            let spawnFromBottom = false;

            switch (zone) {
                case 'hero':
                    targetCount = 60;
                    panicLevel = 0;
                    break;
                case 'interlude':
                    targetCount = 50;      // 80% less than before (was 250)
                    panicLevel = 0.4;      // mild agitation, not full panic
                    maxSpores = 80;
                    break;
                case 'ticker':
                    targetCount = 20;
                    panicLevel = -0.8;     // we'll use negative panic to signify tranquility
                    globalOpacityMult = 0.4;
                    maxSpores = 30;
                    break;
                case 'bio':
                case 'services':
                    targetCount = 80;
                    panicLevel = 0;
                    globalOpacityMult = 1.0;
                    spawnFromBottom = true; // new spores rise from bottom edge
                    maxSpores = 120;
                    break;
                case 'works':
                case 'footer':
                    targetCount = 10;
                    panicLevel = 0;
                    globalOpacityMult = 0.0; // Dissolve gracefully into darkness
                    break;
                case 'ambient':
                default:
                    targetCount = 10;
                    panicLevel = 0;
                    globalOpacityMult = 0.25;
                    break;
            }

            // Lerp global opacity
            currentOpacityMult.current += (globalOpacityMult - currentOpacityMult.current) * 0.03;
            const appliedGlobalOpacity = currentOpacityMult.current;

            // Spawn / cull
            if (sRef.length < targetCount && Math.random() < 0.08) {
                sRef.push(createSpore(canvas!.width, canvas!.height, spawnFromBottom));
            }
            if (sRef.length > targetCount && Math.random() < 0.06) {
                sRef.pop();
            }

            for (let i = sRef.length - 1; i >= 0; i--) {
                const s = sRef[i];
                s.scrollPanic = lerp(s.scrollPanic, panicLevel, 0.04);

                // Wander
                const isTranquil = s.scrollPanic < 0;
                const activePanic = Math.max(0, s.scrollPanic);
                const wanderMult = isTranquil ? 0.2 : (1 + activePanic * 2);
                s.wanderAngle += 0.03 * wanderMult;
                s.homeX += Math.cos(s.wanderAngle) * s.wanderSpeed * wanderMult;
                s.homeY += Math.sin(s.wanderAngle) * s.wanderSpeed * wanderMult;

                // Rising spores have upward drift
                if (s.risingFromBottom) {
                    s.homeY -= 0.15; // slow constant rise
                }

                // Wrap edges
                if (s.homeX < -50) s.homeX = canvas!.width + 50;
                if (s.homeX > canvas!.width + 50) s.homeX = -50;
                if (s.homeY < -100) {
                    // Rising spore reached top — recycle from bottom
                    if (s.risingFromBottom && spawnFromBottom) {
                        s.y = canvas!.height + 20;
                        s.homeY = canvas!.height * 0.3 + Math.random() * canvas!.height * 0.5;
                    } else {
                        s.homeY = canvas!.height + 50;
                    }
                }
                if (s.homeY > canvas!.height + 50) s.homeY = -50;

                // Mouse
                const dx = s.x - mouse.x;
                const dy = s.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < FLEE_RADIUS && dist > 1) {
                    const proximity = (FLEE_RADIUS - dist) / FLEE_RADIUS;
                    s.vx += (dx / dist) * FLEE_FORCE * proximity;
                    s.vy += (dy / dist) * FLEE_FORCE * proximity;
                    s.fleeIntensity = Math.min(1, s.fleeIntensity + 0.12);
                } else {
                    s.fleeIntensity *= 0.96;
                }

                // Panic jitter
                if (activePanic > 0.2) {
                    const jitter = activePanic * 1.0;
                    s.vx += (Math.random() - 0.5) * jitter;
                    s.vy += (Math.random() - 0.5) * jitter;
                }

                // Physics (calmer spring if tranquil)
                const currentSpring = isTranquil ? SPRING_K * 0.3 : SPRING_K;
                s.vx += (s.homeX - s.x) * currentSpring;
                s.vy += (s.homeY - s.y) * currentSpring;
                s.vx *= FRICTION; s.vy *= FRICTION;
                s.x += s.vx; s.y += s.vy;

                // Color
                const intensity = Math.max(s.fleeIntensity, activePanic);
                const targetColor = activePanic > s.fleeIntensity ? INFRARED : TOXIC_GREEN;
                const r = Math.round(lerp(BONE.r, targetColor.r, intensity));
                const g = Math.round(lerp(BONE.g, targetColor.g, intensity));
                const b = Math.round(lerp(BONE.b, targetColor.b, intensity));
                const alpha = (s.baseOpacity + intensity * (1 - s.baseOpacity)) * appliedGlobalOpacity;

                if (alpha > 0.01) {
                    ctx!.beginPath();
                    ctx!.arc(s.x, s.y, s.radius * (1 + activePanic * 0.2), 0, Math.PI * 2);
                    ctx!.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
                    ctx!.fill();
                }
            }
        }

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        });

        rafRef.current = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'fixed', inset: 0,
                width: '100vw', height: '100vh',
                pointerEvents: 'none', zIndex: 2,
            }}
        />
    );
}