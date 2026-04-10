'use client';

/**
 * CursorProvider
 * Tracks global mouse position and exposes it via context.
 * SmartCellCursor reads this to follow the mouse.
 * Phase 1: context shell only — SmartCellCursor renders in Phase 2.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorContextValue {
  position: CursorPosition;
  isVisible: boolean;
  cursorLabel: string | null;
  setCursorLabel: (label: string | null) => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<CursorPosition>({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <CursorContext.Provider
      value={{ position, isVisible, cursorLabel, setCursorLabel }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    throw new Error('useCursor must be used inside <CursorProvider>');
  }
  return ctx;
}
