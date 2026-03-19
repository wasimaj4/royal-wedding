"use client";

import { useState, useEffect, useRef } from "react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import EventDetails from "@/components/EventDetails";
import RSVPSection from "@/components/RSVPSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MusicPlayer from "@/components/MusicPlayer";
import EnvelopeOpen from "@/components/EnvelopeOpen";
import DressCode from "@/components/DressCode";
import FoodDrinks from "@/components/FoodDrinks";
import FAQ from "@/components/FAQ";

function WeddingApp() {
  const { locale, isRTL } = useLanguage();
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const page2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL]);

  useEffect(() => {
    if (currentPage === 1 && page2Ref.current) {
      page2Ref.current.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#FDFAF5]" />
      </div>

      {/* Envelope opening — shown once before the invitation */}
      <AnimatePresence mode="wait">
        {!envelopeOpened && (
          <EnvelopeOpen onOpen={() => setEnvelopeOpened(true)} />
        )}
      </AnimatePresence>

      {/* Main wedding content — revealed after envelope opens */}
      {envelopeOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >

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
                key="page-details"
                ref={page2Ref}
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
                  onClick={() => setCurrentPage(0)}
                  className="fixed top-4 left-4 z-40 w-10 h-10 flex items-center justify-center rounded-full border border-border bg-white/60 backdrop-blur-md text-accent hover:border-accent transition-colors duration-300"
                  aria-label="Back"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </motion.button>

                <main className="max-w-2xl mx-auto">
                  <EventDetails />
                  <div className="section-divider" />
                  <DressCode />
                  <div className="section-divider" />
                  <FoodDrinks />
                  <div className="section-divider" />
                  <FAQ />
                  <div className="section-divider" />
                  <RSVPSection />

                  {/* Footer */}
                  <footer className="text-center py-16 sm:py-20 px-6">
                    <p className={`text-[11px] tracking-[0.25em] uppercase ${isRTL ? "font-arabic text-text-muted" : "font-body text-text-muted"}`}>
                      {isRTL ? "وسيم و ريان \u2014 ٢٠٢٦" : "Wasim & Rayan \u2014 2026"}
                    </p>
                  </footer>
                </main>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
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
