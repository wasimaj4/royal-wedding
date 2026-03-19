"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 1.6, delay, ease: "easeOut" },
  }),
};

const slideUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, delay, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

const namesReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.8, delay, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

const parentReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, delay, ease: "easeOut" },
  }),
};

interface HeroSectionProps {
  onNavigateNext: () => void;
}

export default function HeroSection({ onNavigateNext }: HeroSectionProps) {
  const { t, isRTL } = useLanguage();

  return (
    <section className="h-screen flex flex-col items-center justify-center relative px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        className="text-center relative z-10 max-w-xl w-full"
      >
        {/* "You are invited" */}
        <motion.p
          custom={0.4}
          variants={slideUp}
          className={`text-[11px] sm:text-xs tracking-[0.4em] uppercase mb-6 sm:mb-8 ${
            isRTL
              ? "font-arabic text-text-muted"
              : "font-body text-text-muted"
          }`}
        >
          {t.youAreInvited}
        </motion.p>

        {/* ═══ Couple Names — Royal Calligraphy ═══ */}
        <motion.div custom={0.85} variants={namesReveal} className="py-2 sm:py-4">
          {/* Glow wrapper — soft gold aura fades in after names reveal */}
          <motion.div
            initial={{ filter: "drop-shadow(0 0 0px rgba(176,141,87,0))" }}
            animate={{ filter: "drop-shadow(0 0 22px rgba(176,141,87,0.12))" }}
            transition={{ delay: 2.2, duration: 2.2, ease: "easeOut" }}
          >
            <h1 className="flex items-center justify-center gap-3 sm:gap-5 md:gap-7">
              <span
                className={`${
                  isRTL ? "font-arabic-decorative" : "font-script"
                } text-gold-gradient text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.15]`}
              >
                {t.groomName}
              </span>

              {/* Elegant thin-stroke heart */}
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0 opacity-55"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="#C4A86C"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span
                className={`${
                  isRTL ? "font-arabic-decorative" : "font-script"
                } text-gold-gradient text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.15]`}
              >
                {t.brideName}
              </span>
            </h1>
          </motion.div>

          {/* Parent names — aligned under each name */}
          <motion.div
            custom={1.3}
            variants={parentReveal}
            className="flex items-start justify-center gap-10 sm:gap-16 md:gap-24 mt-3 sm:mt-4"
          >
            <p
              className={`text-[11px] sm:text-xs md:text-sm leading-relaxed ${
                isRTL ? "font-arabic" : "font-serif italic"
              } text-text-secondary`}
            >
              {t.groomParent}
            </p>
            <p
              className={`text-[11px] sm:text-xs md:text-sm leading-relaxed ${
                isRTL ? "font-arabic" : "font-serif italic"
              } text-text-secondary`}
            >
              {t.brideParent}
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative line */}
        <motion.div custom={1.5} variants={fadeIn} className="my-6 sm:my-8">
          <div className="accent-line" />
        </motion.div>

        {/* Invitation text */}
        <motion.p
          custom={1.8}
          variants={slideUp}
          className={`text-sm sm:text-base leading-[1.9] whitespace-pre-line max-w-sm mx-auto ${
            isRTL
              ? "font-arabic text-text-secondary"
              : "font-body text-text-secondary"
          }`}
        >
          {t.invitationText}
        </motion.p>

        {/* Date & Location */}
        <motion.div
          custom={2.2}
          variants={slideUp}
          className="mt-5 sm:mt-6 space-y-1.5"
        >
          <p
            className={`text-base sm:text-lg font-semibold tracking-wide ${
              isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary"
            }`}
          >
            {t.eventDate}
          </p>
          <p
            className={`text-xs tracking-[0.25em] uppercase ${
              isRTL ? "font-arabic text-accent" : "font-body text-accent"
            }`}
          >
            {t.eventLocation}
          </p>
        </motion.div>

        {/* Quranic Verse — compact card */}
        <motion.div custom={2.8} variants={slideUp} className="mt-8 sm:mt-10">
          <div className="verse-card max-w-sm mx-auto px-6 py-6 sm:px-8 sm:py-7 text-center">
            <blockquote
              className={`text-xs sm:text-sm leading-[1.8] ${
                isRTL
                  ? "font-arabic text-text-primary"
                  : "font-body italic text-text-primary"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t.quranVerse}
            </blockquote>
            <div className="mt-3 sm:mt-4">
              <div className="accent-line mb-2 sm:mb-3" />
              <p
                className={`text-[10px] sm:text-xs tracking-wider ${
                  isRTL
                    ? "font-arabic text-accent-dark"
                    : "font-body text-accent-dark"
                }`}
              >
                {t.quranReference}
              </p>
            </div>
          </div>
        </motion.div>

        {/* "CONFIRM YOUR ATTENDANCE" + Down Arrow */}
        <motion.div custom={3.5} variants={slideUp} className="mt-8 sm:mt-10">
          <p
            className={`text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-4 ${
              isRTL
                ? "font-arabic text-text-muted"
                : "font-body text-text-muted"
            }`}
          >
            {t.rsvpTitle}
          </p>

          <motion.button
            onClick={onNavigateNext}
            className="mx-auto flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-accent/40 text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            aria-label="Go to RSVP"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}

