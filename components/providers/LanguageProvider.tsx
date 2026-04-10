'use client';

/**
 * LanguageProvider
 * Manages EN/ES language state with animated transitions.
 *
 * `triggerLangToggle()` — triggers a global scramble phase:
 *   1. Sets `isScrambling = true` (all visible text should scramble simultaneously)
 *   2. After SCRAMBLE_DURATION, flips lang and resolves to new language text
 *   3. Sets `isScrambling = false`
 *
 * Components that display translated text should read `isScrambling` to
 * animate their scramble-out state. See ScrambleText component.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { translate, type Language, type DictionaryKey } from '@/lib/i18n';

const STORAGE_KEY = 'orko_lang';
const SCRAMBLE_DURATION = 400; // ms — time all text scrambles before lang resolves

interface LanguageContextValue {
  lang: Language;
  /** Whether a global text scramble is in progress (lang switch animation) */
  isScrambling: boolean;
  /** Directly set language (no animation) */
  setLang: (lang: Language) => void;
  /** Animate all text scramble → switch lang → resolve (use for LANG toggle button) */
  triggerLangToggle: () => void;
  /** Returns the translated string for key in current language */
  t: (key: DictionaryKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [isScrambling, setIsScrambling] = useState(false);

  // Restore saved language preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === 'en' || saved === 'es') {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
  }, []);

  const triggerLangToggle = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    // After scramble duration, flip lang
    setTimeout(() => {
      setLangState((prev) => {
        const next = prev === 'en' ? 'es' : 'en';
        localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.lang = next;
        return next;
      });
      setIsScrambling(false);
    }, SCRAMBLE_DURATION);
  }, [isScrambling]);

  const t = useCallback(
    (key: DictionaryKey) => translate(key, lang),
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, isScrambling, setLang, triggerLangToggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
