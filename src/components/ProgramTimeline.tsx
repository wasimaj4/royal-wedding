"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, delay, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

/* ── Per-event icons ── */
const EVENT_ICONS = [
  /* Ceremony Begins */
  <svg key="0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>,
  /* Entrance of the Couple */
  <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>,
  /* Dinner */
  <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6h3.5a1.5 1.5 0 0 1 0 3H16v4" />
  </svg>,
  /* Cake Cutting */
  <svg key="3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-8a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v8" />
    <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1" />
    <path d="M2 21h20" />
    <path d="M7 8v3" />
    <path d="M12 8v3" />
    <path d="M17 8v3" />
    <path d="M7 4h.01" />
    <path d="M12 4h.01" />
    <path d="M17 4h.01" />
  </svg>,
  /* Family Entrance */
  <svg key="4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
];

export default function ProgramTimeline() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-12"
        >
          <motion.p
            custom={0.1}
            variants={fadeInUp}
            className={`text-xs mb-3 ${
              isRTL
                ? "font-arabic text-text-muted"
                : "font-body tracking-[0.25em] uppercase text-text-muted"
            }`}
          >
            {t.programTimeline}
          </motion.p>
          <motion.div custom={0.2} variants={fadeInUp}>
            <div className="accent-line" />
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <div className="relative max-w-sm mx-auto">
            {/* Vertical connector line */}
            <div
              className={`absolute top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-border to-transparent ${
                isRTL ? "right-[19px]" : "left-[19px]"
              }`}
            />

            <div className="space-y-0">
              {t.timeline.map((item, index) => (
                <motion.div
                  key={index}
                  custom={0.2 + index * 0.15}
                  variants={fadeInUp}
                  className={`flex items-start gap-4 py-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Icon bubble */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full border border-border bg-[#FDFAF5] flex items-center justify-center text-accent relative z-10 ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  >
                    {EVENT_ICONS[index] ?? (
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 pt-2 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <span
                      className={`block text-xs text-accent mb-0.5 tabular-nums ${
                        isRTL ? "font-arabic" : "font-body tracking-wider"
                      }`}
                    >
                      {item.time}
                    </span>
                    <span
                      className={`block text-base text-text-primary leading-snug ${
                        isRTL ? "font-arabic" : "font-body"
                      }`}
                    >
                      {item.event}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
