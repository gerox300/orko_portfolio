'use client';

import { MotionValue, motion } from 'framer-motion';
import { COLORS } from '@/lib/constants';

export interface CardProject {
  key: string;
  client: string;
  fullName?: string;
  type: string;
  sector: string;
  year: string;
  copy: string;
  scrollVideo?: string;
  identitySlides?: string[];
}

interface FloatingCardProps {
  project: CardProject | null;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  isVisible: boolean;
}

const sharedLayoutTransition = {
  type: 'spring' as const,
  bounce: 0.03,
  visualDuration: 0.8,
};

export function FloatingCard({
  project,
  springX,
  springY,
  isVisible,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={false}
      aria-hidden="true"
      style={{
        x: springX,
        y: springY,
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.985,
        filter: isVisible ? 'blur(0px)' : 'blur(2px)',
      }}
      transition={{
        opacity: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
        filter: { duration: 0.16, ease: 'easeOut' },
      }}
    >
      <div
        style={{
          width: 480,
          transform: 'translateY(-50%)',
          transformOrigin: 'left center',
        }}
      >
        <motion.div
          animate={{
            x: isVisible ? 32 : 76,
          }}
          transition={{
            x: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
          }}
          style={{
            transformOrigin: 'left center',
          }}
        >
          <motion.div
            layoutId={project ? `project-modal-${project.key}` : 'empty-card'}
            transition={{ layout: sharedLayoutTransition }}
            style={{
              backgroundColor: COLORS.bgAbyss,
              border: `1px solid ${COLORS.lineAsh}`,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <motion.div
              layoutId={project ? `project-video-${project.key}` : 'empty-video'}
              transition={{ layout: sharedLayoutTransition }}
              style={{
                aspectRatio: '16 / 9',
                backgroundColor: COLORS.lineAsh,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {project ? (
                project.scrollVideo ? (
                  <video
                    key={project.scrollVideo}
                    src={project.scrollVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      backgroundColor: '#050505',
                    }}
                  />
                ) : project.identitySlides?.[0] ? (
                  <img
                    src={project.identitySlides[0]}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'grid',
                      placeItems: 'center',
                      background: 'rgba(255,255,255,0.015)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains-mono), monospace',
                        fontSize: '0.45rem',
                        letterSpacing: '0.12em',
                        color: COLORS.textBone,
                        opacity: 0.25,
                        textTransform: 'uppercase',
                      }}
                    >
                      no media for {project.key}
                    </span>
                  </div>
                )
              ) : null}
            </motion.div>

            <motion.div
              layoutId={project ? `project-content-${project.key}` : 'empty-content'}
              transition={{ layout: sharedLayoutTransition }}
              style={{ padding: '24px' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-headline), sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '-0.01em',
                  textTransform: 'uppercase',
                  color: COLORS.textBone,
                  margin: 0,
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}
              >
                {project?.client ?? ''}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.75rem',
                  lineHeight: 1.65,
                  color: COLORS.textBone,
                  opacity: 0.6,
                  margin: 0,
                }}
              >
                {project?.copy ? `${project.copy.split('. ')[0]}.` : ''}
              </p>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 14,
                  borderTop: `1px solid ${COLORS.lineAsh}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
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
                    fontSize: '0.55rem',
                    letterSpacing: '0.16em',
                    color: COLORS.accentInfrared,
                    opacity: 0.9,
                    textTransform: 'uppercase',
                  }}
                >
                  {project?.sector ?? ''}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}