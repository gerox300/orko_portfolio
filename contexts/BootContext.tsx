'use client';

/**
 * BootContext
 * Tracks whether the user has passed through the BootSequence.
 * HUD, SmartCellCursor, and other post-boot elements gate on `hasBooted`.
 *
 * sessionStorage persistence: prevents re-showing the boot sequence on
 * Next.js HMR reloads. Clears when the browser tab is closed.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

const SESSION_KEY = 'orko_booted';

interface BootContextValue {
  hasBooted: boolean;
  markBooted: () => void;
}

const BootContext = createContext<BootContextValue | null>(null);

export function BootProvider({ children }: { children: ReactNode }) {
  const [hasBooted, setHasBooted] = useState<boolean>(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setHasBooted(true);
    }
  }, []);

  const markBooted = useCallback(() => {
    setHasBooted(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, '1');
    }
  }, []);


  return (
    <BootContext.Provider value={{ hasBooted, markBooted }}>
      {children}
    </BootContext.Provider>
  );
}

export function useBootContext(): BootContextValue {
  const ctx = useContext(BootContext);
  if (!ctx) {
    throw new Error('useBootContext must be used inside <BootProvider>');
  }
  return ctx;
}
