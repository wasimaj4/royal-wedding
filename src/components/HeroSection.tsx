"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 1.5, delay, ease: "easeOut" },
  }),
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, delay, ease: "easeOut" },
  }),
};

export default function HeroSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6">

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="text-center relative z-10 max-w-2xl"
      >
        {/* "You are invited" */}
        <motion.p
          custom={0.3}
          variants={slideUp}
          className={`text-sm sm:text-base tracking-[0.35em] uppercase mb-10 ${
            isRTL
              ? "font-arabic text-accent-dark"
              : "font-serif text-text-secondary"
          }`}
        >
          {t.youAreInvited}
        </motion.p>

        {/* Couple Names */}
        <motion.div custom={0.8} variants={fadeIn}>
          {isRTL ? (
            <h1 className="font-arabic-decorative text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-text-primary leading-[1.3] tracking-wide">
              {t.groomName}
              <span className="block text-3xl sm:text-4xl md:text-5xl text-accent my-3 font-arabic">
                {t.and}
              </span>
              {t.brideName}
            </h1>
          ) : (
            <h1 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-text-primary leading-[1.1]">
              {t.groomName}
              <span className="block text-3xl sm:text-4xl md:text-5xl text-accent my-4 font-serif italic font-light">
                {t.and}
              </span>
              {t.brideName}
            </h1>
          )}
        </motion.div>

        {/* Decorative line */}
        <motion.div custom={1.3} variants={fadeIn} className="my-10">
          <div className="accent-line" />
        </motion.div>

        {/* Jasmine flower SVG — Syrian national flower */}
        <motion.div custom={1.5} variants={fadeIn} className="flex justify-center mb-10">
          <JasmineFlower />
        </motion.div>

        {/* Invitation text */}
        <motion.p
          custom={1.8}
          variants={slideUp}
          className={`text-base sm:text-lg leading-relaxed whitespace-pre-line max-w-md mx-auto ${
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
          className="mt-10 space-y-2"
        >
          <p
            className={`text-lg sm:text-xl font-semibold tracking-wide ${
              isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary"
            }`}
          >
            {t.eventDate}
          </p>
          <p
            className={`text-sm tracking-[0.25em] uppercase ${
              isRTL ? "font-arabic text-accent" : "font-body text-accent"
            }`}
          >
            {t.eventLocation}
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          custom={3}
          variants={fadeIn}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-accent/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Syrian Jasmine Flower (الياسمين الدمشقي) ──────────── */
function JasmineFlower() {
  return (
    <svg width="50" height="50" viewBox="0 0 100 100" className="text-accent opacity-40">
      {/* Five petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="25"
          rx="10"
          ry="20"
          fill="currentColor"
          opacity="0.6"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Center */}
      <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8" />
      <circle cx="50" cy="50" r="4" fill="#0A0806" />
    </svg>
  );
}
