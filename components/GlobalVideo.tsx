'use client';

/**
 * GlobalVideo — Fixed background, mutant-tank.
 * Exits with Hero: grows + drifts right + blur + fade.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function GlobalVideo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const brumaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        const bruma = brumaRef.current;
        if (!el || !bruma) return;

        const ctx = gsap.context(() => {
            gsap.set(el, { opacity: 1, scale: 1, x: 0 });
            gsap.set(bruma, { opacity: 1 });

            // Video sale después
            gsap.to(el, {
                scale: 1.4,
                x: '25vw',
                opacity: 0,
                ease: 'power1.in',
                scrollTrigger: {
                    trigger: '#hero',
                    start: '10% top',
                    end: '70% top',
                    scrub: 1,
                    onUpdate: (self) => {
                        if (el) {
                            el.style.filter = `blur(${self.progress * 20}px)`;
                        }
                    },
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                right: '-5vw',
                top: '-5%',
                width: '75vw',
                height: '110vh',
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                willChange: 'transform, opacity',
            }}
        >
            <video
                src="/mutant-tank.webm"
                autoPlay muted loop playsInline
                style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'contain', transform: 'scale(1.2)', mixBlendMode: 'screen',
                    // Máscara desplazada a la derecha: el centro está en 70% X
                    // El fade izquierdo empieza muy cerca del centro → borde izquierdo queda transparente
                    WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at 70% 50%, black 20%, transparent 60%)',
                    maskImage: 'radial-gradient(ellipse 55% 50% at 70% 50%, black 20%, transparent 60%)',
                    filter: 'brightness(1.1) contrast(1.1)',
                }}
            />

            {/* Bruma — animada independiente */}
            <div ref={brumaRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

                {/* Bruma radial central — desplazada igual que la máscara */}
                <div style={{
                    position: 'absolute',
                    inset: '-30%',
                    background: 'radial-gradient(ellipse 45% 45% at 65% 50%, rgba(0,255,65,0.6) 0%, rgba(0,40,15,0.25) 35%, rgba(5,5,5,0.95) 60%, #050505 75%)',
                    mixBlendMode: 'screen',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                }} />

                {/* Green texture */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url("/texture_green.png")',
                    backgroundSize: 'cover',
                    opacity: 0.1,
                    pointerEvents: 'none',
                }} />

                {/* Bruma verde — borde superior */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,255,65,0.18) 0%, rgba(0,255,65,0.06) 12%, transparent 28%)',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                }} />

                {/* Bruma verde — borde inferior */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,255,65,0.18) 0%, rgba(0,255,65,0.06) 12%, transparent 28%)',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                }} />

                {/* Bruma verde — borde derecho */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to left, rgba(0,255,65,0.18) 0%, rgba(0,255,65,0.06) 12%, transparent 30%)',
                    mixBlendMode: 'screen',
                    pointerEvents: 'none',
                }} />

                {/* Right edge fade */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to left, #050505 1%, transparent 18%)',
                    pointerEvents: 'none',
                }} />

                {/* Left edge fade — cubre el borde izquierdo donde la máscara puede fallar */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, #050505 0%, transparent 35%)',
                    pointerEvents: 'none',
                }} />

                {/* Top + bottom vignette */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, #050505 0%, transparent 12%, transparent 88%, #050505 100%)',
                    pointerEvents: 'none',
                }} />

            </div>
        </div>
    );
}