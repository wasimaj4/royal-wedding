"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import EventDetails from "@/components/EventDetails";
import RSVPSection from "@/components/RSVPSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MusicPlayer from "@/components/MusicPlayer";
import EnvelopeOpen from "@/components/EnvelopeOpen";
import FAQ from "@/components/FAQ";
import ProgramTimeline from "@/components/ProgramTimeline";
import DressCode from "@/components/DressCode";
import ContactSection from "@/components/ContactSection";

/* Watches whether a target element is visible inside a scroll container */
function ScrollSpy({ containerId, targetId, onVisible, onHidden }: {
  containerId: string; targetId: string; onVisible: () => void; onHidden: () => void;
}) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    const target = document.getElementById(targetId);
    if (!container || !target) return;

    const observer = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? onVisible() : onHidden(); },
      { root: container, rootMargin: "0px", threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [containerId, targetId, onVisible, onHidden]);
  return null;
}

function WeddingApp() {
  const { locale, isRTL } = useLanguage();
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const page2Ref = useRef<HTMLDivElement>(null);
  const [showFloatingRsvp, setShowFloatingRsvp] = useState(true);
  const hideRsvpBtn = useCallback(() => setShowFloatingRsvp(false), []);
  const showRsvpBtn = useCallback(() => setShowFloatingRsvp(true), []);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* Pre-create audio so it's ready when envelope opens */
  useEffect(() => {
    const audio = new Audio("/audio/bridal-chorus-clean.mp3");
    audio.loop = true;
    audio.volume = 0.02;
    audio.playbackRate = 0.70;
    audio.preload = "auto";
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; audioRef.current = null; };
  }, []);

  const handleEnvelopeOpen = () => {
    setEnvelopeOpened(true);
  };

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
        {/* Soft radial warmth — top center */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(196,162,101,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Envelope opening — shown once before the invitation */}
      <AnimatePresence mode="wait">
        {!envelopeOpened && (
          <EnvelopeOpen onOpen={handleEnvelopeOpen} audioRef={audioRef} />
        )}
      </AnimatePresence>

      {/* Fixed UI controls — only mount after envelope opens */}
      {envelopeOpened && (
        <>
          <LanguageSwitcher />
          <MusicPlayer audioRef={audioRef} />

          {/* Floating RSVP button — visible on all pages, hides when RSVP section in view */}
          <AnimatePresence>
            {showFloatingRsvp && (
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 1.2 }}
                onClick={() => {
                  if (currentPage === 0) {
                    setCurrentPage(1);
                    setTimeout(() => {
                      const el = document.getElementById("rsvp");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 1200);
                  } else {
                    const el = document.getElementById("rsvp");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`fixed bottom-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#C4A265] to-[#B08D57] text-white shadow-[0_4px_24px_rgba(176,141,87,0.35)] hover:shadow-[0_6px_32px_rgba(176,141,87,0.5)] hover:scale-105 transition-all duration-300 ${
                  isRTL ? "right-6" : "left-6"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <span className={`text-xs font-bold tracking-wider uppercase ${
                  isRTL ? "font-arabic-label" : "font-body"
                }`}>
                  {isRTL ? "تأكيد الحضور" : "RSVP"}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Main wedding content — pre-rendered hidden, revealed after envelope opens */}
      <motion.div
        initial={false}
        animate={{ opacity: envelopeOpened ? 1 : 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        style={{ pointerEvents: envelopeOpened ? "auto" : "none", position: envelopeOpened ? undefined : "fixed", visibility: envelopeOpened ? undefined : "hidden" }}
      >

          {/* Page content with transitions */}
          <AnimatePresence mode="wait">
            {currentPage === 0 && (
              <motion.div
                key="page-invitation"
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -48 }}
                transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
                className="relative z-10 h-screen"
              >
                <HeroSection onNavigateNext={() => setCurrentPage(1)} />
              </motion.div>
            )}

            {currentPage === 1 && (
              <motion.div
                key="page-details"
                ref={page2Ref}
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -48 }}
                transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
                className="relative z-10 h-screen overflow-y-auto"
                id="page-details"
              >
                {/* Back arrow */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setCurrentPage(0)}
                  className="fixed top-4 left-4 z-40 w-10 h-10 flex items-center justify-center rounded-full border border-border bg-white/70 backdrop-blur-md text-accent hover:border-accent hover:shadow-[0_2px_16px_rgba(176,141,87,0.18)] transition-all duration-500"
                  aria-label="Back"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </motion.button>

                <ScrollSpy containerId="page-details" targetId="rsvp" onVisible={hideRsvpBtn} onHidden={showRsvpBtn} />
                <main className="max-w-2xl mx-auto">
                  <EventDetails />
                  <div className="section-divider" />
                  <ProgramTimeline />
                  {!isRTL && (
                    <>
                      <div className="section-divider" />
                      <DressCode />
                    </>
                  )}
                  <div className="section-divider" />
                  <FAQ />
                  <div className="section-divider" />
                  <RSVPSection />
                  <div className="section-divider" />
                  <ContactSection />

                  {/* Footer */}
                  <footer className="text-center py-16 sm:py-20 px-6">
                    <p className={`text-[11px] tracking-[0.25em] uppercase ${isRTL ? "font-arabic-label text-text-muted" : "font-body text-text-muted"}`}>
                      {isRTL ? "وسيم و ريّان \u2014 ٢٠٢٦" : "Wasim & Rayan \u2014 2026"}
                    </p>
                  </footer>
                </main>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
