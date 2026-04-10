/**
 * useScrollTransitions
 * 
 * Adds GSAP ScrollTrigger-driven enter animations to any section.
 * Each section fades + translates up on enter.
 * 
 * Usage in any section component:
 *   const sectionRef = useRef<HTMLElement>(null);
 *   useScrollTransitions(sectionRef);
 *   return <section ref={sectionRef}>...</section>
 */

import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TransitionOptions {
    /** How far up (in px) the section starts before animating to 0. Default: 40 */
    yOffset?: number;
    /** Animation duration in seconds. Default: 0.9 */
    duration?: number;
    /** When the animation triggers. Default: 'top 85%' */
    start?: string;
    /** Whether to also add an exit fade as section scrolls away. Default: false */
    exitFade?: boolean;
}

export function useScrollTransitions(
    ref: RefObject<HTMLElement | null>,
    options: TransitionOptions = {}
) {
    const {
        yOffset = 40,
        duration = 0.9,
        start = 'top 85%',
        exitFade = true,
    } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            // ── ENTER: fade up on scroll into view ──
            gsap.fromTo(el,
                { opacity: 0, y: yOffset },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start,
                        toggleActions: 'play none none none',
                    },
                }
            );

            // ── EXIT: subtle fade as section scrolls away ──
            if (exitFade) {
                ScrollTrigger.create({
                    trigger: el,
                    start: 'bottom 50%',
                    end: 'bottom top',
                    scrub: 0.6,
                    onUpdate: (self) => {
                        gsap.set(el, { opacity: 1 - self.progress * 0.35 });
                    },
                });
            }
        }, el);

        return () => ctx.revert();
    }, [ref, yOffset, duration, start, exitFade]);
}