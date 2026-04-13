'use client';

import { useState, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  LayoutGroup,
} from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { COLORS, springConfig } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

import { WorkRow } from '@/components/works/WorkRow';
import { FloatingCard } from '@/components/works/FloatingCard';
import { GlitchText } from '@/components/GlitchText';
import type { CardProject } from '@/components/works/FloatingCard';

const PROJECTS_BASE = [
  {
    key: 'sama',
    client: 'SAMA',
    fullName: 'SAMA',
    type: 'VISUAL IDENTITY',
    sector: 'CREATIVE COLLECTIVE',
    year: '2025',
    copy: 'Visual identity and branding for SAMA, a multidisciplinary creative collective. Born from a deeply personal story, the identity balances raw emotion with a modern, "cool" aesthetic designed for the live performance and art scene.',
  },
  {
    key: 'cantus_avi',
    client: 'CANTUS AVI',
    fullName: 'CANTUS AVI',
    type: 'VISUAL IDENTITY REDESIGN',
    sector: 'CHORAL / MUSIC',
    year: '2025',
    copy: 'Visual transformation for a youthful academic choir. We transitioned their choral heritage into a professional, high-impact brand system designed for commercial integration. The result is a jovial yet sophisticated identity that bridges the gap between academic excellence and the professional event market.',
  },
  {
    key: 'frihcun',
    client: 'FRIHCUN',
    fullName: 'FRIHCUN',
    type: 'Sophisticated Trade Interface',
    sector: 'Global Industrial Trade',
    year: '2025',
    copy: 'System architecture and industrial visual identity. Engineering-led design for high-performance environments.',
  },
  {
    key: 'acau',
    client: 'ACAU',
    fullName: 'ACAU',
    type: 'High-Status Industrial Presence',
    sector: 'Industrial Lighting',
    year: '2025',
    copy: 'High-Contrast Industrial UI. Designed for the harsh environments of mining and agro-tech.',
  },
  {
    key: 'legendary',
    client: 'LEGENDARY NAMES',
    fullName: 'LEGENDARY NAMES',
    type: 'Mystical Branding & Platform',
    sector: 'Domain Assets & Naming',
    year: '2025',
    copy: 'The Infinite Possibility Engine. A generative visual system where typography mutates to represent endless naming assets.',
  },
  {
    key: 'carola',
    client: 'CAROLA ZECH',
    fullName: 'CAROLA ZECH',
    type: 'DIGITAL ARCHIVING',
    sector: 'ART',
    year: '2025',
    copy: 'Structural Heritage Navigation. Digitizing 30 years of sculptural mastery into a non-linear archive.',
  },
  {
    key: 'rodrigo',
    client: 'RODRIGO AGÜERO Z',
    fullName: 'RODRIGO AGÜERO Z',
    type: 'PHOTOGRAPHY PORTFOLIO',
    sector: 'PHOTOGRAPHY',
    year: '2025',
    copy: 'Portfolio website for Argentine photographer Rodrigo Agüero. The project focused on building distinct ways to present very different bodies of work, treating the website itself as another format through which his photography could be shown and framed. It was a highly collaborative process, shaped through ongoing conversations about how the images should coexist, and how the homepage canvas could bring together backstage material and finished work.',
  },
  {
    key: 'xii',
    client: 'XII',
    fullName: 'XII IMMIGRATIONS & INCORPORATIONS',
    type: 'Strategic Landing & AI',
    sector: 'Immigrations & Incorporations',
    year: '2025',
    copy: 'Biometric Lead Qualification. Integrated AI-driven logic to score applicant profiles in real-time.',
  },
  {
    key: 'happener',
    client: 'HAPPENER',
    fullName: 'HAPPENER',
    type: 'Branding & Web Design',
    sector: 'Event Design',
    year: '2025',
    copy: 'Autonomous Event Infrastructure. Engineered a robust, operator-independent ecosystem for the Dubai event market.',
  },
  {
    key: 'rejus',
    client: 'REJUS',
    fullName: 'REJUS',
    type: 'Fresh Institutional Identity',
    sector: 'Legal Network / Social Action',
    year: '2025',
    copy: 'Justice Network Visualization. Injecting modern visual semantics into judicial structures.',
  },

] as const;

type ProjectKey = (typeof PROJECTS_BASE)[number]['key'];
type ViewerMode = 'scroll' | 'identity' | 'system';

interface ProjectMedia {
  views: ViewerMode[];
  videoAspectRatio?: string;
  scrollVideo?: string;
  identitySlides?: string[];
  systemSlides?: string[];
}

const PROJECT_MEDIA: Partial<Record<ProjectKey, ProjectMedia>> = {
  cantus_avi: {
    views: ['scroll', 'identity'],
    scrollVideo: '/projects/cantus_avi/scroll.webm',
    videoAspectRatio: '16 / 10',
    identitySlides: [
      '/projects/cantus_avi/identity-01.webp',
      '/projects/cantus_avi/identity-02.webp',
      '/projects/cantus_avi/identity-03.webp',
      '/projects/cantus_avi/identity-04.webp',
    ],
  },
  sama: {
    views: ['scroll', 'identity'],
    scrollVideo: '/projects/sama/scroll.webm',
    videoAspectRatio: '16 / 10',
    identitySlides: [
      '/projects/sama/identity-01.webp',
      '/projects/sama/identity-02.webp',
      '/projects/sama/identity-03.webp',
      '/projects/sama/identity-04.webp',
    ],
  },
  frihcun: {
    views: ['scroll', 'identity'],
    scrollVideo: '/projects/frihcun/scroll.webm',
    videoAspectRatio: '16 / 10',
    identitySlides: [
      '/projects/frihcun/identity-01.webp',
      '/projects/frihcun/identity-02.webp',
      '/projects/frihcun/identity-03.webp',
      '/projects/frihcun/identity-04.webp',
    ],
  },
  acau: {
    views: ['scroll', 'identity'],
    scrollVideo: '/projects/acau/scroll.webm',
    videoAspectRatio: '16 / 10',
    identitySlides: [
      '/projects/acau/identity-01.webp',
      '/projects/acau/identity-02.webp',
      '/projects/acau/identity-03.webp',
      '/projects/acau/identity-04.webp',
      '/projects/acau/identity-05.webp',
      '/projects/acau/identity-06.webp',
      '/projects/acau/identity-07.webp',
    ],
  },
  legendary: {
    views: ['scroll', 'identity'],
    scrollVideo: '/projects/legendary/scroll.webm',
    videoAspectRatio: '16 / 10',
    identitySlides: [
      '/projects/legendary/identity-01.webp',
      '/projects/legendary/identity-02.webp',
      '/projects/legendary/identity-03.webp',
      '/projects/legendary/identity-04.webp',
      '/projects/legendary/identity-05.webp',
      '/projects/legendary/identity-06.webp',
    ],
  },
  carola: {
    views: ['scroll', 'identity'],
    scrollVideo: '/projects/carola/scroll.webm',
    videoAspectRatio: '16 / 10',
    identitySlides: [
      '/projects/carola/identity-01.webp',
      '/projects/carola/identity-02.webp',
      '/projects/carola/identity-03.webp',
      '/projects/carola/identity-04.webp',
      '/projects/carola/identity-05.webp',
    ],
  },
  rodrigo: {
    views: ['scroll', 'identity'],
    scrollVideo: '/projects/rodrigo/scroll.webm',
    videoAspectRatio: '16 / 10',
    identitySlides: [
      '/projects/rodrigo/identity-01.webp',
      '/projects/rodrigo/identity-02.webp',
      '/projects/rodrigo/identity-03.webp',
      '/projects/rodrigo/identity-04.webp',
    ],
  },
  xii: {
    views: ['scroll'],
    scrollVideo: '/projects/xii/scroll.webm',
    videoAspectRatio: '16 / 10',
  },
  happener: {
    views: ['scroll', 'identity'],
    scrollVideo: '/projects/happener/scroll.webm',
    videoAspectRatio: '16 / 10',
    identitySlides: [
      '/projects/happener/identity-01.webp',
      '/projects/happener/identity-02.webp',
      '/projects/happener/identity-03.webp',
      '/projects/happener/identity-04.webp',
      '/projects/happener/identity-05.webp',
      '/projects/happener/identity-06.webp',
    ],
  },
  rejus: {
    views: ['scroll', 'identity'],
    scrollVideo: '/projects/rejus/scroll.webm',
    videoAspectRatio: '16 / 10',
    identitySlides: [
      '/projects/rejus/identity-01.webp',
      '/projects/rejus/identity-02.webp',
    ],
  },

};

const HEADER_COLS_DESKTOP = '48px 1fr 200px 150px 72px';
const HEADER_COLS_MOBILE = '48px 1fr 56px';

const FLOATING_CARD_WIDTH = 480;
const FLOATING_CARD_HALF_HEIGHT = 200;
const FLOATING_CARD_OFFSET_X = 32;

const SAFE_TOP = 44;
const SAFE_RIGHT = 24;
const SAFE_BOTTOM = 44;

const sharedLayoutTransition = {
  type: 'spring' as const,
  bounce: 0.03,
  visualDuration: 0.8,
};

export function Works() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const openingModalRef = useRef(false);
  const openRaf1Ref = useRef<number | null>(null);
  const openRaf2Ref = useRef<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [previewProject, setPreviewProject] = useState<CardProject | null>(null);
  const [activeModalProject, setActiveModalProject] = useState<CardProject | null>(null);
  const [hasPointerPosition, setHasPointerPosition] = useState(false);
  const [viewerMode, setViewerMode] = useState<ViewerMode>('scroll');
  const [identityIndex, setIdentityIndex] = useState(0);
  const [systemIndex, setSystemIndex] = useState(0);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, {
    stiffness: springConfig.stiffness,
    damping: springConfig.damping,
  });
  const springY = useSpring(rawY, {
    stiffness: springConfig.stiffness,
    damping: springConfig.damping,
  });

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 768);
    }

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeModalProject ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModalProject]);

  useEffect(() => {
    return () => {
      if (openRaf1Ref.current) cancelAnimationFrame(openRaf1Ref.current);
      if (openRaf2Ref.current) cancelAnimationFrame(openRaf2Ref.current);
    };
  }, []);

  function getProjectMedia(projectKey: string): ProjectMedia {
    return (
      PROJECT_MEDIA[projectKey as ProjectKey] ?? {
        views: ['identity'],
        identitySlides: [],
      }
    );
  }

  function getClampedPreviewPosition(clientX: number, clientY: number) {
    let x = clientX;
    let y = clientY;

    if (y + FLOATING_CARD_HALF_HEIGHT > window.innerHeight - SAFE_BOTTOM) {
      y = window.innerHeight - FLOATING_CARD_HALF_HEIGHT - SAFE_BOTTOM;
    }

    if (y - FLOATING_CARD_HALF_HEIGHT < SAFE_TOP) {
      y = FLOATING_CARD_HALF_HEIGHT + SAFE_TOP;
    }

    if (x + FLOATING_CARD_OFFSET_X + FLOATING_CARD_WIDTH > window.innerWidth - SAFE_RIGHT) {
      x = window.innerWidth - FLOATING_CARD_WIDTH - FLOATING_CARD_OFFSET_X - SAFE_RIGHT;
    }

    return { x, y };
  }

  function updateFloatingPosition(
    clientX: number,
    clientY: number,
    options?: { immediate?: boolean }
  ) {
    if (typeof window === 'undefined') return;

    const { x, y } = getClampedPreviewPosition(clientX, clientY);

    rawX.set(x);
    rawY.set(y);

    if (options?.immediate) {
      springX.jump(x);
      springY.jump(y);
    } else {
      springX.set(x);
      springY.set(y);
    }

    if (!hasPointerPosition) {
      setHasPointerPosition(true);
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (activeModalProject) return;
    updateFloatingPosition(e.clientX, e.clientY);
  }

  function openProject(project: CardProject, index: number) {
    const media = getProjectMedia(project.key);
    const firstMode = media.views[0] ?? 'identity';

    openingModalRef.current = true;
    setHoveredIndex(index);
    setPreviewProject(project);
    setViewerMode(firstMode);
    setIdentityIndex(0);
    setSystemIndex(0);

    if (openRaf1Ref.current) cancelAnimationFrame(openRaf1Ref.current);
    if (openRaf2Ref.current) cancelAnimationFrame(openRaf2Ref.current);

    openRaf1Ref.current = requestAnimationFrame(() => {
      openRaf2Ref.current = requestAnimationFrame(() => {
        setActiveModalProject(project);
        openingModalRef.current = false;
      });
    });
  }

  function closeModal() {
    openingModalRef.current = false;
    setActiveModalProject(null);
    setPreviewProject(null);
    setHoveredIndex(null);
    setIdentityIndex(0);
    setSystemIndex(0);
  }

  function changeSlide(
    slidesLength: number,
    direction: 'prev' | 'next',
    kind: 'identity' | 'system'
  ) {
    if (slidesLength <= 1) return;

    if (kind === 'identity') {
      setIdentityIndex((prev) =>
        direction === 'next'
          ? (prev + 1) % slidesLength
          : (prev - 1 + slidesLength) % slidesLength
      );
      return;
    }

    setSystemIndex((prev) =>
      direction === 'next'
        ? (prev + 1) % slidesLength
        : (prev - 1 + slidesLength) % slidesLength
    );
  }
  function getTranslatedOrFallback(key: string, fallback = '') {
    const value = t(key as Parameters<typeof t>[0]);
    return value === key ? fallback : value;
  }


  const projects = PROJECTS_BASE.map((p) => {
    const rawMedia = getProjectMedia(p.key);
    const translatedCopy = getTranslatedOrFallback(`works.${p.key}.copy`, p.copy);
    const translatedType = getTranslatedOrFallback(`works.${p.key}.type`, p.type);
    const translatedSector = getTranslatedOrFallback(`works.${p.key}.sector`, p.sector);

    return {
      ...p,
      copy: translatedCopy || p.copy,
      type: translatedType || p.type,
      sector: translatedSector || p.sector,
      scrollVideo: rawMedia.scrollVideo,
      identitySlides: rawMedia.identitySlides,
    };
  });

  const activeProject = previewProject;
  const activeMedia = activeModalProject ? getProjectMedia(activeModalProject.key) : null;
  const availableTabs = activeMedia?.views ?? ['identity'];

  function renderSlideViewer(
    slides: string[],
    activeIndex: number,
    kind: 'identity' | 'system'
  ) {
    const hasSlides = slides.length > 0;
    const safeIndex = hasSlides ? Math.min(activeIndex, slides.length - 1) : 0;
    const activeSlide = hasSlides ? slides[safeIndex] : null;

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateRows: '1fr auto',
          minHeight: 0,
        }}
      >
        <div
          style={{
            minHeight: 0,
            position: 'relative',
            overflow: 'hidden',
            display: 'grid',
            placeItems: 'center',
            padding: 'clamp(20px, 2.2vw, 28px)',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeSlide ? (
              <motion.img
                key={activeSlide}
                src={activeSlide}
                alt=""
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : (
              <motion.div
                key={`${kind}-placeholder`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  width: '100%',
                  height: '100%',
                  border: `1px solid rgba(240,240,240,0.1)`,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(255,255,255,0.015)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    color: COLORS.textBone,
                    opacity: 0.35,
                    textTransform: 'uppercase',
                  }}
                >
                  add {kind} assets in /public/projects/{activeModalProject?.key}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '12px 18px',
            borderTop: `1px solid rgba(240,240,240,0.08)`,
            background: 'rgba(8,8,8,0.96)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '0.56rem',
              letterSpacing: '0.16em',
              color: COLORS.textBone,
              opacity: 0.45,
              textTransform: 'uppercase',
            }}
          >
            {hasSlides ? `${String(safeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}` : '00 / 00'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => changeSlide(slides.length, 'prev', kind)}
              disabled={slides.length <= 1}
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.58rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: slides.length <= 1 ? COLORS.textBone : COLORS.accentInfrared,
                opacity: slides.length <= 1 ? 0.24 : 0.92,
                background: 'transparent',
                border: `1px solid ${slides.length <= 1 ? 'rgba(240,240,240,0.08)' : 'rgba(255,84,69,0.35)'}`,
                padding: '8px 10px',
                cursor: slides.length <= 1 ? 'default' : 'pointer',
              }}
            >
              Prev
            </button>
            <button
              onClick={() => changeSlide(slides.length, 'next', kind)}
              disabled={slides.length <= 1}
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.58rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: slides.length <= 1 ? COLORS.textBone : COLORS.accentInfrared,
                opacity: slides.length <= 1 ? 0.24 : 0.92,
                background: 'transparent',
                border: `1px solid ${slides.length <= 1 ? 'rgba(240,240,240,0.08)' : 'rgba(255,84,69,0.35)'}`,
                padding: '8px 10px',
                cursor: slides.length <= 1 ? 'default' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderViewerStage(project: CardProject) {
    const media = getProjectMedia(project.key);

    if (viewerMode === 'scroll') {
      const ratio = media.videoAspectRatio || '16 / 9';

      return (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            padding: 'clamp(22px, 2.4vw, 30px)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 30% 20%, rgba(255,84,69,0.08), transparent 35%), radial-gradient(circle at 70% 80%, rgba(255,84,69,0.05), transparent 30%)',
            }}
          />

          <div
            style={{
              width: 'min(88%, 1100px)',
              maxHeight: '86%',
              aspectRatio: ratio,
              border: `1px solid rgba(240,240,240,0.12)`,
              background: 'rgba(10,10,10,0.92)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
              display: 'grid',
              gridTemplateRows: '40px 1fr',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                borderBottom: `1px solid rgba(240,240,240,0.1)`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 14px',
                background: 'rgba(8,8,8,0.96)',
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,84,69,0.8)' }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(240,240,240,0.22)' }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(240,240,240,0.14)' }} />
              <span
                style={{
                  marginLeft: 10,
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.62rem',
                  letterSpacing: '0.14em',
                  color: COLORS.textBone,
                  opacity: 0.45,
                }}
              >
                {project.client}.live
              </span>
            </div>

            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#050505',
              }}
            >
              {media.scrollVideo ? (
                <video
                  src={media.scrollVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    background: '#050505',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: '0.65rem',
                      letterSpacing: '0.18em',
                      color: COLORS.textBone,
                      opacity: 0.35,
                      textTransform: 'uppercase',
                    }}
                  >
                    add scroll.mp4 in /public/projects/{project.key}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (viewerMode === 'identity') {
      return renderSlideViewer(media.identitySlides ?? [], identityIndex, 'identity');
    }

    return renderSlideViewer(media.systemSlides ?? [], systemIndex, 'system');
  }

  return (
    <LayoutGroup id="works-shared-layout">
      <>
        <section
          id="works"
          ref={sectionRef}
          aria-label="Works — Case Files"
          onMouseMove={isMobile ? undefined : handleMouseMove}
          onMouseLeave={() => {
            if (!activeModalProject && !openingModalRef.current) {
              setHoveredIndex(null);
              setPreviewProject(null);
            }
          }}
          style={{
            position: 'relative',
            minHeight: '100vh',
            backgroundColor: 'transparent',
            padding: 'clamp(64px, 10vh, 100px) 0',
          }}
        >
          <div
            style={{
              padding: '0 clamp(20px, 4vw, 40px)',
              marginBottom: 'clamp(40px, 7vh, 64px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: 'calc(0.55rem + 3px)',
                letterSpacing: '0.2em',
                color: COLORS.textBone,
                textTransform: 'uppercase',
                marginBottom: 'clamp(14px, 2vh, 20px)',
              }}
            >
              {t('works.sectionLabel') || 'DEPLOYED SYSTEMS'}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-headline), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.4rem, 4vw, 3rem)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: COLORS.textBone,
                margin: 0,
                lineHeight: 1.05,
              }}
            >
              <GlitchText text={t('works.sectionTitle') || 'CASE FILES'} />
            </motion.h2>
          </div>

          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? HEADER_COLS_MOBILE : HEADER_COLS_DESKTOP,
                gap: '0 clamp(12px, 2vw, 24px)',
                padding: '0 clamp(20px, 4vw, 40px)',
                paddingBottom: 'clamp(8px, 1.2vh, 12px)',
                borderBottom: `1px solid ${COLORS.lineAsh}`,
                marginBottom: 0,
              }}
            >
              <span />
              <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: COLORS.textBone, opacity: 0.45, textTransform: 'uppercase' }}>{t('works.col.client')}</span>
              {!isMobile && <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: COLORS.textBone, opacity: 0.45, textTransform: 'uppercase' }}>{t('works.col.type')}</span>}
              {!isMobile && <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: COLORS.textBone, opacity: 0.45, textTransform: 'uppercase' }}>{t('works.col.sector')}</span>}
              <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: COLORS.textBone, opacity: 0.45, textTransform: 'uppercase', textAlign: 'right' }}>{t('works.col.year')}</span>
            </div>

            {/* Mobile-only tap hint */}
            {isMobile && (
              <div style={{
                padding: 'clamp(8px, 1.5vw, 12px) clamp(20px, 4vw, 40px)',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                color: COLORS.accentInfrared,
                opacity: 0.65,
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span>▾</span>
                <span>TAP ROW TO EXPAND</span>
              </div>
            )}

            {projects.map((project, i) => (
              <WorkRow
                key={project.key}
                project={project}
                index={i}
                number={String(i + 1).padStart(2, '0')}
                isDimmed={hoveredIndex !== null && hoveredIndex !== i}
                isMobile={isMobile}
                onMouseEnter={(e) => {
                  const shouldJump = !previewProject;
                  updateFloatingPosition(e.clientX, e.clientY, {
                    immediate: shouldJump,
                  });
                  setHoveredIndex(i);
                  setPreviewProject(project);
                }}
                onMouseLeave={() => {
                  if (!activeModalProject && !openingModalRef.current) {
                    setHoveredIndex(null);
                    setPreviewProject(null);
                  }
                }}
                onClick={() => openProject(project, i)}
                onOpenProject={() => openProject(project, i)}
              />
            ))}
          </div>

          {!isMobile && (
            <FloatingCard
              project={activeProject}
              springX={springX}
              springY={springY}
              isVisible={Boolean(activeProject) && hasPointerPosition}
            />
          )}
        </section>

        <AnimatePresence mode="popLayout" initial={false}>
          {activeModalProject && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
                padding: 'clamp(16px, 2vw, 24px)',
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.34, delay: 0.1 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(5, 5, 5, 0.9)',
                  backdropFilter: 'blur(10px)',
                }}
                onClick={closeModal}
              />

              <motion.div
                layoutId={`project-modal-${activeModalProject.key}`}
                transition={{ layout: sharedLayoutTransition }}
                style={{
                  position: 'relative',
                  zIndex: 101,
                  width: 'min(1440px, 96vw)',
                  height: 'min(900px, 92vh)',
                  backgroundColor: COLORS.bgAbyss,
                  border: `1px solid ${COLORS.lineAsh}`,
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateRows: 'auto 1fr',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.9)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    padding: '18px 22px',
                    borderBottom: `1px solid rgba(240,240,240,0.08)`,
                    background: 'rgba(8,8,8,0.96)',
                  }}
                >
                  <div
                    style={{
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-headline), sans-serif',
                          fontWeight: 700,
                          fontSize: 'clamp(1rem, 1.2vw, 1.3rem)',
                          letterSpacing: '-0.02em',
                          textTransform: 'uppercase',
                          color: COLORS.textBone,
                        }}
                      >
                        {activeModalProject.fullName || activeModalProject.client}
                      </span>

                      <span
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          fontSize: '0.58rem',
                          letterSpacing: '0.18em',
                          color: COLORS.accentInfrared,
                          opacity: 0.85,
                          textTransform: 'uppercase',
                          border: `1px solid rgba(255,84,69,0.35)`,
                          padding: '4px 8px',
                        }}
                      >
                        {activeModalProject.type}
                      </span>

                      <span
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          fontSize: '0.58rem',
                          letterSpacing: '0.18em',
                          color: COLORS.textBone,
                          opacity: 0.55,
                          textTransform: 'uppercase',
                          border: `1px solid rgba(240,240,240,0.12)`,
                          padding: '4px 8px',
                        }}
                      >
                        {activeModalProject.year}
                      </span>
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.56rem',
                        letterSpacing: '0.18em',
                        color: COLORS.textBone,
                        opacity: 0.4,
                        textTransform: 'uppercase',
                      }}
                    >
                      project viewer / case file / expanded system
                    </span>
                  </div>

                  <motion.button
                    onClick={closeModal}
                    whileHover={{
                      scale: 1.08,
                      rotate: 90,
                      backgroundColor: 'rgba(255, 84, 69, 0.14)',
                      borderColor: 'rgba(255, 84, 69, 0.55)',
                      color: COLORS.accentInfrared,
                      boxShadow:
                        '0 0 0 1px rgba(255, 84, 69, 0.16), 0 0 24px rgba(255, 84, 69, 0.16)',
                    }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                    style={{
                      flexShrink: 0,
                      background: 'rgba(5,5,5,0.5)',
                      border: `1px solid rgba(240,240,240,0.2)`,
                      color: COLORS.textBone,
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    ×
                  </motion.button>
                </div>

                <div
                  style={{
                    minHeight: 0,
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.65fr) minmax(320px, 0.78fr)',
                  }}
                >
                  <div
                    style={{
                      minWidth: 0,
                      minHeight: 0,
                      display: 'grid',
                      gridTemplateRows: 'minmax(0, 1fr) auto',
                      borderRight: `1px solid rgba(240,240,240,0.08)`,
                    }}
                  >
                    <motion.div
                      layoutId={`project-video-${activeModalProject.key}`}
                      transition={{ layout: sharedLayoutTransition }}
                      style={{
                        minHeight: 0,
                        backgroundColor: COLORS.lineAsh,
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: [
                            `linear-gradient(rgba(240,240,240,0.05) 1px, transparent 1px)`,
                            `linear-gradient(90deg, rgba(240,240,240,0.05) 1px, transparent 1px)`,
                          ].join(', '),
                          backgroundSize: '32px 32px',
                          opacity: 0.75,
                        }}
                      />

                      <div
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        {renderViewerStage(activeModalProject)}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        flexWrap: 'wrap',
                        borderTop: `1px solid rgba(240,240,240,0.08)`,
                        background: 'rgba(8,8,8,0.96)',
                      }}
                    >
                      {availableTabs.map((tab) => {
                        const isActive = viewerMode === tab;

                        return (
                          <button
                            key={tab}
                            onClick={() => setViewerMode(tab)}
                            style={{
                              fontFamily: 'var(--font-jetbrains-mono), monospace',
                              fontSize: '0.6rem',
                              letterSpacing: '0.16em',
                              textTransform: 'uppercase',
                              color: isActive ? COLORS.accentInfrared : COLORS.textBone,
                              opacity: isActive ? 1 : 0.48,
                              background: isActive ? 'rgba(255,84,69,0.08)' : 'transparent',
                              border: `1px solid ${isActive ? 'rgba(255,84,69,0.35)' : 'rgba(240,240,240,0.12)'}`,
                              padding: '9px 12px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {tab === 'scroll'
                              ? (activeModalProject?.key === 'cantus_avi' || activeModalProject?.key === 'sama'
                                ? (t('hud.langCurrent') === 'LANG: [ES]' ? 'PROPÓSITO' : 'PROPOSAL')
                                : 'PAGE SCROLL')
                              : tab === 'identity'
                                ? 'IDENTITY'
                                : 'SYSTEM'}
                          </button>
                        );
                      })}
                    </motion.div>
                  </div>

                  <motion.div
                    layoutId={`project-content-${activeModalProject.key}`}
                    transition={{ layout: sharedLayoutTransition }}
                    style={{
                      minWidth: 0,
                      minHeight: 0,
                      padding: 'clamp(24px, 2.4vw, 34px)',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 22,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          fontSize: '0.58rem',
                          letterSpacing: '0.18em',
                          color: COLORS.accentInfrared,
                          opacity: 0.82,
                          textTransform: 'uppercase',
                          marginBottom: 12,
                        }}
                      >
                        {getTranslatedOrFallback('works.panel.projectLabel', 'Project')}
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--font-headline), sans-serif',
                          fontSize: 'clamp(1.15rem, 1.55vw, 1.7rem)',
                          textTransform: 'uppercase',
                          color: COLORS.textBone,
                          margin: 0,
                          lineHeight: 1.08,
                          marginBottom: 18,
                          maxWidth: '20ch',
                        }}
                      >
                        {activeModalProject.fullName || activeModalProject.client}
                      </h3>

                      <p
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          fontSize: '0.84rem',
                          color: COLORS.textBone,
                          opacity: 0.72,
                          lineHeight: 1.72,
                          margin: 0,
                        }}
                      >
                        {activeModalProject.copy}
                      </p>
                    </div>

                    <div
                      style={{
                        height: 1,
                        background: 'rgba(240,240,240,0.08)',
                      }}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.36, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        display: 'grid',
                        gap: 18,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-jetbrains-mono), monospace',
                            fontSize: '0.58rem',
                            letterSpacing: '0.18em',
                            color: COLORS.textBone,
                            opacity: 0.42,
                            textTransform: 'uppercase',
                            marginBottom: 8,
                          }}
                        >
                          {getTranslatedOrFallback('works.panel.sectorLabel', 'Sector')}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: COLORS.accentInfrared,
                              opacity: 0.9,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: 'var(--font-jetbrains-mono), monospace',
                              fontSize: '0.82rem',
                              color: COLORS.accentInfrared,
                              textTransform: 'uppercase',
                            }}
                          >
                            {activeModalProject.sector}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-jetbrains-mono), monospace',
                            fontSize: '0.58rem',
                            letterSpacing: '0.18em',
                            color: COLORS.textBone,
                            opacity: 0.42,
                            textTransform: 'uppercase',
                            marginBottom: 8,
                          }}
                        >
                          {getTranslatedOrFallback('works.panel.approachTitle', 'Approach')}
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gap: 8,
                          }}
                        >
                          {[
                            getTranslatedOrFallback(`works.${activeModalProject.key}.approachItem1`),
                            getTranslatedOrFallback(`works.${activeModalProject.key}.approachItem2`),
                            getTranslatedOrFallback(`works.${activeModalProject.key}.approachItem3`),
                          ]
                            .filter(Boolean)
                            .map((item, index) => (
                              <span
                                key={index}
                                style={{
                                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                                  fontSize: '0.76rem',
                                  color: COLORS.textBone,
                                  opacity: 0.7,
                                }}
                              >
                                {item}
                              </span>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    </LayoutGroup>
  );
}