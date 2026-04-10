'use client';

/**
 * SectionDivider
 * Atmospheric breathing space between sections.
 * Renders a configurable-height void with:
 *   - A thin horizontal line that draws itself left-to-right on scroll
 *   - Optional: a faint section label that types in
 * 
 * Usage:
 *   <SectionDivider height="30vh" />
 *   <SectionDivider height="15vh" label="[ ENTERING_BIO ]" />
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COLORS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface Props {
    height?: string;
    label?: string;
    showLine?: boolean;
}

export function SectionDivider({ height = '20vh', label, showLine = true }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const line = lineRef.current;
        if (!container || !line) return;

        const ctx = gsap.context(() => {
            // Line draws left → right as you scroll through the divider
            gsap.fromTo(line,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 80%',
                        end: 'bottom 60%',
                        scrub: 0.4,
                    },
                }
            );
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            style={{
                height,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            {/* Horizontal line — draws itself on scroll */}
            {showLine && (
                <div
                    ref={lineRef}
                    style={{
                        width: '60%',
                        height: '1px',
                        backgroundColor: COLORS.lineAsh,
                        transformOrigin: 'left center',
                        transform: 'scaleX(0)',
                        opacity: 0.4,
                    }}
                />
            )}

            {/* Optional section label */}
            {label && (
                <div
                    style={{
                        position: 'absolute',
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.5rem',
                        letterSpacing: '0.25em',
                        color: COLORS.textBone,
                        opacity: 0.08,
                        textTransform: 'uppercase',
                    }}
                >
                    {label}
                </div>
            )}
        </div>
    );
}