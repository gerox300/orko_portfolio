'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '@/lib/constants';

function GlitchCharacter({ char, index }: { char: string; index: number }) {
  const [isFuzzy, setIsFuzzy] = useState(false);
  return (
    <motion.span
      onMouseEnter={() => setIsFuzzy(true)}
      onMouseLeave={() => setIsFuzzy(false)}
      animate={isFuzzy ? {
        x: [-1, 2, -1, 1, 0],
        y: [1, -1, 1, -1, 0],
        opacity: [1, 0.8, 1, 0.9, 1]
      } : { x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: 0.1,
        repeat: isFuzzy ? Infinity : 0,
        repeatType: "mirror",
        delay: index * 0.005
      }}
      style={{
        display: 'inline-block',
        cursor: 'none',
        textShadow: isFuzzy
          ? `1.5px 0 0 ${COLORS.accentInfrared}, -1.5px 0 0 #00FF41`
          : 'none',
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

export function GlitchText({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi} style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          marginRight: wi !== words.length - 1 ? '0.25em' : 0
        }}>
          {word.split('').map((char, ci) => (
            <GlitchCharacter key={`char-${wi}-${ci}`} char={char} index={ci} />
          ))}
        </span>
      ))}
    </>
  );
}
