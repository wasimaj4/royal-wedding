"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import CandleFlame from "./CandleFlame";
import CountdownTimer from "./CountdownTimer";
import GoldOrnament from "./GoldOrnament";

interface InvitationPageProps {
  onNavigateToRSVP: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, delay, ease: "easeOut" },
  }),
};

export default function InvitationPage({ onNavigateToRSVP }: InvitationPageProps) {
  const { t, isRTL, locale } = useLanguage();

  // Google Maps placeholder links — replace with actual coordinates
  const womensHallMap = "https://maps.google.com/?q=Women's+Wedding+Hall";
  const mensHallMap = "https://maps.google.com/?q=Men's+Wedding+Hall";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="min-h-screen parchment-bg relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Side candles — fixed position */}
      <div className="fixed top-1/2 -translate-y-1/2 left-4 z-20 hidden md:block">
        <CandleFlame size="medium" />
      </div>
      <div className="fixed top-1/2 -translate-y-1/2 right-4 z-20 hidden md:block">
        <CandleFlame size="medium" />
      </div>

      {/* Content container */}
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-20">
        {/* ══════════════════════════════════════════════
            SECTION: Names & Wedding Title
            ══════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          {/* Top ornament */}
          <motion.div custom={0.2} variants={fadeInUp} className="flex justify-center mb-8">
            <GoldOrnament type="top" />
          </motion.div>

          {/* "The Wedding of" */}
          <motion.p
            custom={0.5}
            variants={fadeInUp}
            className={`text-lg sm:text-xl tracking-[0.3em] uppercase text-gold-dark/70 mb-6 ${
              isRTL ? "font-arabic" : "font-serif"
            }`}
          >
            {t.weddingOf}
          </motion.p>

          {/* Names */}
          <motion.div custom={0.8} variants={fadeInUp}>
            {isRTL ? (
              <h1 className="font-arabic-decorative text-5xl sm:text-6xl md:text-7xl text-gold-dark leading-tight text-shadow-gold">
                {t.groomName} <span className="text-gold">{t.and}</span> {t.brideName}
              </h1>
            ) : (
              <h1 className="font-script text-6xl sm:text-7xl md:text-8xl text-gold-dark leading-tight text-shadow-gold">
                {t.groomName} <span className="text-gold text-5xl sm:text-6xl md:text-7xl">{t.and}</span> {t.brideName}
              </h1>
            )}
          </motion.div>

          {/* Divider */}
          <motion.div custom={1.1} variants={fadeInUp}>
            <div className="gold-divider mt-8">
              <div className="ornament-diamond" />
            </div>
          </motion.div>
        </motion.section>

        {/* ══════════════════════════════════════════════
            SECTION: Event Details
            ══════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16"
        >
          <div className="gold-frame gold-frame-inner relative">
            <motion.h2
              custom={0.2}
              variants={fadeInUp}
              className={`text-center text-2xl sm:text-3xl tracking-[0.2em] uppercase text-gold-dark mb-10 ${
                isRTL ? "font-arabic" : "font-serif font-semibold"
              }`}
            >
              {t.eventDetails}
            </motion.h2>

            {/* Date & Time */}
            <motion.div custom={0.4} variants={fadeInUp} className="text-center space-y-4 mb-10">
              <div className="flex flex-col items-center gap-1">
                <span className={`text-sm tracking-[0.3em] uppercase text-gold-dark/60 ${isRTL ? "font-arabic" : "font-serif"}`}>
                  {t.date}
                </span>
                <span className={`text-2xl sm:text-3xl text-gold-dark ${isRTL ? "font-arabic" : "font-serif font-semibold"}`}>
                  {t.dateValue}
                </span>
              </div>

              <div className="gold-divider-simple" style={{ maxWidth: "100px" }} />

              <div className="flex flex-col items-center gap-1">
                <span className={`text-sm tracking-[0.3em] uppercase text-gold-dark/60 ${isRTL ? "font-arabic" : "font-serif"}`}>
                  {t.time}
                </span>
                <span className={`text-2xl sm:text-3xl text-gold-dark ${isRTL ? "font-arabic" : "font-serif font-semibold"}`}>
                  {t.timeValue}
                </span>
              </div>
            </motion.div>

            {/* Halls */}
            <motion.div custom={0.6} variants={fadeInUp} className="space-y-6">
              {/* Women's Hall */}
              <div className="text-center">
                <h3 className={`text-xl text-gold-dark mb-2 ${isRTL ? "font-arabic font-bold" : "font-serif font-semibold"}`}>
                  {t.womensHall}
                </h3>
                <a
                  href={womensHallMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors duration-300 text-sm tracking-wider ${
                    isRTL ? "font-arabic" : "font-body"
                  }`}
                >
                  <MapPinIcon />
                  {t.viewOnMap}
                </a>
              </div>

              <div className="gold-divider-simple" style={{ maxWidth: "80px" }} />

              {/* Men's Hall */}
              <div className="text-center">
                <h3 className={`text-xl text-gold-dark mb-2 ${isRTL ? "font-arabic font-bold" : "font-serif font-semibold"}`}>
                  {t.mensHall}
                </h3>
                <a
                  href={mensHallMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors duration-300 text-sm tracking-wider ${
                    isRTL ? "font-arabic" : "font-body"
                  }`}
                >
                  <MapPinIcon />
                  {t.viewOnMap}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════
            SECTION: Program Timeline
            ══════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16"
        >
          <motion.h2
            custom={0.2}
            variants={fadeInUp}
            className={`text-center text-2xl sm:text-3xl tracking-[0.2em] uppercase text-gold-dark mb-10 ${
              isRTL ? "font-arabic" : "font-serif font-semibold"
            }`}
          >
            {t.programTimeline}
          </motion.h2>

          <div className="relative">
            {/* Vertical golden line */}
            <div
              className={`absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent ${
                isRTL ? "right-6 sm:right-8" : "left-6 sm:left-8"
              }`}
            />

            <div className="space-y-8">
              {t.timeline.map((item, index) => (
                <motion.div
                  key={index}
                  custom={0.3 + index * 0.15}
                  variants={fadeInUp}
                  className={`flex items-start gap-6 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {/* Time dot */}
                  <div className="flex-shrink-0 w-12 sm:w-16 flex items-center justify-center">
                    <div className="w-3 h-3 bg-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                    <span className={`block text-sm text-gold tracking-wider mb-1 ${isRTL ? "font-arabic" : "font-body"}`}>
                      {item.time}
                    </span>
                    <span className={`block text-lg text-deep-brown ${isRTL ? "font-arabic" : "font-body"}`}>
                      {item.event}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════
            SECTION: Countdown Timer
            ══════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16"
        >
          <motion.h2
            custom={0.2}
            variants={fadeInUp}
            className={`text-center text-xl sm:text-2xl tracking-[0.15em] text-gold-dark/70 mb-8 ${
              isRTL ? "font-arabic" : "font-serif"
            }`}
          >
            {t.countdown}
          </motion.h2>

          <motion.div custom={0.4} variants={fadeInUp}>
            <CountdownTimer targetDate="2026-05-17T17:00:00" />
          </motion.div>
        </motion.section>

        {/* ══════════════════════════════════════════════
            SECTION: RSVP Button
            ══════════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div custom={0.2} variants={fadeInUp}>
            <GoldOrnament type="divider" />
          </motion.div>

          <motion.button
            custom={0.5}
            variants={fadeInUp}
            onClick={onNavigateToRSVP}
            className={`mt-8 px-12 py-4 border-2 border-gold text-gold-dark tracking-[0.25em] uppercase text-sm
              hover:bg-gold hover:text-white transition-all duration-700 ease-in-out
              shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]
              ${isRTL ? "font-arabic" : "font-serif font-semibold"}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t.rsvp}
          </motion.button>
        </motion.section>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
          className="flex justify-center pb-8"
        >
          <GoldOrnament type="bottom" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Map Pin Icon ───────────────────────────────────────── */

function MapPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
