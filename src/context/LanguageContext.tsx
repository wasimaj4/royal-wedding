"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Locale, Translations, getTranslation } from "@/lib/i18n";

const LOCALE_STORAGE_KEY = "wedding-locale";

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLocale(): Locale {
  if (typeof window !== "undefined") {
    // 1. Saved preference takes priority
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;

    // 2. Browser language detection — use primary language only
    try {
      const langs = navigator.languages ?? [navigator.language];
      if (langs[0]?.startsWith("ar")) return "ar";
    } catch {
      // ignore — SSR or restricted environment
    }
  }
  // 3. Fallback
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  // Persist to localStorage whenever locale changes
  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const t = getTranslation(locale);
  const isRTL = locale === "ar";

  return (
    <LanguageContext.Provider value={{ locale, t, toggleLocale, setLocale, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
