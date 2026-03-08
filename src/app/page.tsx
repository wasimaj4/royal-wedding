"use client";

import { useEffect } from "react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import HeroSection from "@/components/HeroSection";
import QuranicVerse from "@/components/QuranicVerse";
import EventDetails from "@/components/EventDetails";
import RSVPSection from "@/components/RSVPSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MusicPlayer from "@/components/MusicPlayer";

function WeddingApp() {
  const { locale, isRTL } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL]);

  return (
    <div className="min-h-screen wedding-bg">
      <LanguageSwitcher />
      <MusicPlayer />

      <main>
        <HeroSection />
        <QuranicVerse />
        <EventDetails />
        <RSVPSection />

        {/* Footer */}
        <footer className="text-center py-12 px-6">
          <div className="section-divider mb-8" />
          <p className={`text-xs tracking-[0.2em] uppercase ${isRTL ? "font-arabic text-text-muted" : "font-body text-text-muted"}`}>
            {isRTL ? "وسيم و ريان \u2014 ٢٠٢٦" : "Wasim & Rayan \u2014 2026"}
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <WeddingApp />
    </LanguageProvider>
  );
}
