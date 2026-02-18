"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Locale, Translations, getTranslation } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

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
