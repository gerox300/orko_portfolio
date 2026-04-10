'use client';

/**
 * orko_ Providers
 * Client Component. Wraps the entire app with all context providers.
 * Order matters: Boot → Language → Audio → Cursor → Lenis.
 */

import { type ReactNode } from 'react';
import { BootProvider } from '@/contexts/BootContext';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { AudioProvider } from '@/components/providers/AudioProvider';
import { CursorProvider } from '@/components/providers/CursorProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <BootProvider>
      <LanguageProvider>
        <AudioProvider>
          <CursorProvider>
            <LenisProvider>
              {children}
            </LenisProvider>
          </CursorProvider>
        </AudioProvider>
      </LanguageProvider>
    </BootProvider>
  );
}
