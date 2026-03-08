"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import CountdownTimer from "./CountdownTimer";

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: "easeOut" },
  }),
};

export default function EventDetails() {
  const { t, isRTL } = useLanguage();

  const venueMap = "https://maps.google.com/?q=Kon.+Wilhelminahaven+ZZ+10,+3134+KC+Vlaardingen";

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="max-w-xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-14"
        >
          <motion.div custom={0} variants={fadeInUp}>
            <div className="section-divider mb-10" />
          </motion.div>

          <motion.h2
            custom={0.2}
            variants={fadeInUp}
            className={`text-2xl sm:text-3xl tracking-[0.15em] uppercase mb-4 ${
              isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary"
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
          className="text-center mb-14 space-y-8"
        >
          <motion.div custom={0.2} variants={fadeInUp} className="space-y-2">
            <p className={`text-xs tracking-[0.3em] uppercase ${isRTL ? "font-arabic text-text-muted" : "font-body text-text-muted"}`}>
              {t.date}
            </p>
            <p className={`text-2xl sm:text-3xl ${isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary font-medium"}`}>
              {t.dateValue}
            </p>
          </motion.div>

          <motion.div custom={0.3} variants={fadeInUp}>
            <div className="accent-line" />
          </motion.div>

          <motion.div custom={0.4} variants={fadeInUp} className="space-y-2">
            <p className={`text-xs tracking-[0.3em] uppercase ${isRTL ? "font-arabic text-text-muted" : "font-body text-text-muted"}`}>
              {t.time}
            </p>
            <p className={`text-2xl sm:text-3xl ${isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary font-medium"}`}>
              {t.timeValue}
            </p>
          </motion.div>
        </motion.div>

        {/* Venue */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mb-16"
        >
          <motion.div custom={0.2} variants={fadeInUp} className="text-center">
            <h3 className={`text-lg mb-2 ${isRTL ? "font-arabic font-bold text-text-primary" : "font-serif font-semibold text-text-primary"}`}>
              {isRTL ? "مكان الحفل" : "Venue"}
            </h3>
            <p className={`text-sm text-text-secondary mb-3 ${isRTL ? "font-arabic" : "font-body"}`}>
              Kon. Wilhelminahaven ZZ 10, 3134 KC Vlaardingen
            </p>
            <a
              href={venueMap}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors duration-300 text-sm tracking-wider ${
                isRTL ? "font-arabic" : "font-body"
              }`}
            >
              <MapPinIcon />
              {t.viewOnMap}
            </a>
          </motion.div>
        </motion.div>

        {/* Program Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.h2
            custom={0.1}
            variants={fadeInUp}
            className={`text-center text-xl sm:text-2xl tracking-[0.15em] uppercase mb-10 ${
              isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary"
            }`}
          >
            {t.programTimeline}
          </motion.h2>

          <div className="relative max-w-sm mx-auto">
            {/* Vertical line */}
            <div
              className={`absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent ${
                isRTL ? "right-4" : "left-4"
              }`}
            />

            <div className="space-y-6">
              {t.timeline.map((item, index) => (
                <motion.div
                  key={index}
                  custom={0.2 + index * 0.12}
                  variants={fadeInUp}
                  className={`flex items-start gap-6 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {/* Dot */}
                  <div className="flex-shrink-0 w-8 flex items-center justify-center pt-1">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-2 ${isRTL ? "text-right" : ""}`}>
                    <span className={`block text-xs tracking-wider text-accent mb-0.5 ${isRTL ? "font-arabic" : "font-body"}`}>
                      {item.time}
                    </span>
                    <span className={`block text-base text-text-primary ${isRTL ? "font-arabic" : "font-body"}`}>
                      {item.event}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-20"
        >
          <motion.h2
            custom={0.1}
            variants={fadeInUp}
            className={`text-center text-lg sm:text-xl tracking-[0.1em] mb-8 ${
              isRTL ? "font-arabic text-text-secondary" : "font-body text-text-secondary"
            }`}
          >
            {t.countdown}
          </motion.h2>

          <motion.div custom={0.3} variants={fadeInUp}>
            <CountdownTimer targetDate="2026-05-17T17:00:00" />
          </motion.div>
        </motion.div>
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
