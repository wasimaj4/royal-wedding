"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import CountdownTimer from "./CountdownTimer";

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, delay, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function EventDetails() {
  const { t, isRTL } = useLanguage();

  const venueMap = "https://maps.google.com/?q=Kon.+Wilhelminahaven+ZZ+10,+3134+KC+Vlaardingen";

  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="max-w-xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-12"
        >
          <motion.h2
            custom={0.1}
            variants={fadeInUp}
            className={`text-2xl sm:text-3xl ${
              isRTL ? "font-arabic-label font-semibold text-text-primary" : "font-serif tracking-[0.15em] uppercase text-text-primary"
            }`}
          >
            {t.eventDetails}
          </motion.h2>
        </motion.div>

        {/* Date & Time */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="text-center mb-12 space-y-6"
        >
          <motion.div custom={0.2} variants={fadeInUp} className="space-y-2">
            <p className={`${isRTL ? "text-sm font-arabic-label font-medium text-text-muted" : "text-xs font-body tracking-[0.3em] uppercase text-text-muted"}`}>
              {t.date}
            </p>
            <p className={`text-2xl sm:text-3xl ${isRTL ? "font-arabic-label font-medium text-text-primary" : "font-serif text-text-primary font-medium"}`}>
              {t.dateValue}
            </p>
          </motion.div>

          <motion.div custom={0.3} variants={fadeInUp}>
            <div className="accent-line" />
          </motion.div>

          <motion.div custom={0.4} variants={fadeInUp} className="space-y-2">
            <p className={`${isRTL ? "text-sm font-arabic-label font-medium text-text-muted" : "text-xs font-body tracking-[0.3em] uppercase text-text-muted"}`}>
              {t.time}
            </p>
            <p className={`text-2xl sm:text-3xl ${isRTL ? "font-arabic-label font-medium text-text-primary" : "font-serif text-text-primary font-medium"}`}>
              {t.timeValue}
            </p>
          </motion.div>
        </motion.div>

        {/* Venue */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mb-14"
        >
          <motion.div custom={0.2} variants={fadeInUp} className="text-center">
            <p className={`mb-3 ${isRTL ? "text-sm font-arabic-label font-medium text-text-muted" : "text-xs font-body tracking-[0.25em] uppercase text-text-muted"}`}>
              {isRTL ? "مكان الحفل" : "Venue"}
            </p>
            <a
              href="https://maps.google.com/?q=Kon.+Wilhelminahaven+ZZ+10+3134+KC+Vlaardingen"
              target="_blank"
              rel="noopener noreferrer"
              className="group block mb-4"
            >
              <p className={`text-base sm:text-lg text-text-primary group-hover:text-accent transition-colors duration-300 mb-1 ${isRTL ? "font-arabic-label font-semibold" : "font-serif font-medium"}`}>
                Kon. Wilhelminahaven ZZ 10
              </p>
              <p className={`text-sm text-text-secondary group-hover:text-accent transition-colors duration-300 ${isRTL ? "font-arabic-label" : "font-body"}`}>
                3134 KC Vlaardingen
              </p>
            </a>

            {/* Venue photo */}
            <motion.div
              custom={0.5}
              variants={fadeInUp}
              className="mt-8 overflow-hidden rounded-lg border border-border/60"
            >
              <motion.img
                src="/venue.jpg"
                alt="Wedding venue"
                className="w-full h-auto object-cover"
              />
            </motion.div>

            {/* Open in Maps button */}
            <motion.div
              custom={0.6}
              variants={fadeInUp}
              className="mt-6"
            >
              <a
                href={venueMap}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-3 w-full max-w-xs mx-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C4A265] to-[#B08D57] text-white shadow-[0_4px_20px_rgba(176,141,87,0.3)] hover:shadow-[0_6px_28px_rgba(176,141,87,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${
                  isRTL ? "font-arabic-label text-sm" : "font-body text-xs tracking-[0.2em] uppercase"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {isRTL ? "افتح في الخريطة" : "Open in Maps"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-16"
        >
          <motion.p
            custom={0.1}
            variants={fadeInUp}
            className={`text-center mb-8 ${
              isRTL ? "text-sm font-arabic-label font-medium text-text-muted" : "text-xs font-body tracking-[0.25em] uppercase text-text-muted"
            }`}
          >
            {t.countdown}
          </motion.p>

          <motion.div custom={0.3} variants={fadeInUp}>
            <CountdownTimer targetDate="2026-05-17T18:00:00" />
          </motion.div>

          {/* Add to Calendar — English only */}
          {!isRTL && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-center mt-8"
            >              <a
                href={(() => {
                  const ics = [
                    "BEGIN:VCALENDAR",
                    "VERSION:2.0",
                    "PRODID:-//WasimRayan//Wedding//EN",
                    "BEGIN:VEVENT",
                    "DTSTART:20260517T160000Z",
                    "DTEND:20260517T220000Z",
                    "SUMMARY:Wasim & Rayan's Wedding",
                    "DESCRIPTION:Wedding celebration of Wasim & Rayan. We look forward to celebrating with you!",
                    "LOCATION:Kon. Wilhelminahaven ZZ 10\\, 3134 KC Vlaardingen\\, The Netherlands",
                    "URL:https://wasimandrayan.eu",
                    "END:VEVENT",
                    "END:VCALENDAR",
                  ].join("\r\n");
                  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
                })()}
                download="wasim-rayan-wedding.ics"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/40 bg-white/70 backdrop-blur-sm text-accent-dark hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 text-xs font-body tracking-wider uppercase"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Add to Calendar
              </a>
            </motion.div>
          )}
        </motion.div>

        {/* Countdown — removed from here, moved above Timeline */}
      </div>
    </section>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="14"
      height="14"
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
