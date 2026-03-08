"use client";

import { useState, useEffect, useRef } from "react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ScratchReveal from "@/components/ScratchReveal";
import EventDetails from "@/components/EventDetails";
import RSVPSection from "@/components/RSVPSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MusicPlayer from "@/components/MusicPlayer";

function WeddingApp() {
  const { locale, isRTL } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const page3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL]);

  // Reset scroll on page 3 when entering
  useEffect(() => {
    if (currentPage === 2 && page3Ref.current) {
      page3Ref.current.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Background layers — cross-fade on page change */}
      {/* Page 0 & 2: Dark solid */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          currentPage !== 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[#0A0806]" />
      </div>
      {/* Page 1: Scratch — cream bg */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          currentPage === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[#FDFAF5]" />
      </div>

      {/* Fixed UI controls */}
      <LanguageSwitcher />
      <MusicPlayer />

      {/* Page content with transitions */}
      <AnimatePresence mode="wait">
        {currentPage === 0 && (
          <motion.div
            key="page-invitation"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative z-10 h-screen"
          >
            <HeroSection onNavigateNext={() => setCurrentPage(1)} />
          </motion.div>
        )}

        {currentPage === 1 && (
          <motion.div
            key="page-scratch"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative z-10 h-screen"
          >
            <ScratchReveal
              onNavigateBack={() => setCurrentPage(0)}
              onNavigateNext={() => setCurrentPage(2)}
            />
          </motion.div>
        )}

        {currentPage === 2 && (
          <motion.div
            key="page-details"
            ref={page3Ref}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative z-10 h-screen overflow-y-auto"
          >
            {/* Back arrow */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setCurrentPage(1)}
              className="fixed top-4 left-4 z-40 w-10 h-10 flex items-center justify-center rounded-full border border-border bg-bg-dark/60 backdrop-blur-md text-accent hover:border-accent transition-colors duration-300"
              aria-label="Back"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </motion.button>

            <main>
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
          </motion.div>
        )}
      </AnimatePresence>
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
