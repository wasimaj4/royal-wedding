"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  }),
};

export default function DressCode() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center"
        >
          <motion.div custom={0} variants={fadeUp}>
            <div className="section-divider mb-10" />
          </motion.div>

          <motion.div custom={0.1} variants={fadeUp} className="flex justify-center mb-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent opacity-60"
            >
              <path d="M6 2l3 5h6l3-5" />
              <path d="M3 7h18l-2 15H5L3 7z" />
              <path d="M9 7v0a3 3 0 0 0 6 0v0" />
            </svg>
          </motion.div>

          <motion.h2
            custom={0.2}
            variants={fadeUp}
            className={`text-2xl sm:text-3xl tracking-[0.15em] uppercase mb-6 ${
              isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary"
            }`}
          >
            {t.dressCodeTitle}
          </motion.h2>

          <motion.div custom={0.4} variants={fadeUp}>
            <div className="verse-card max-w-md mx-auto px-6 py-6 sm:px-8 sm:py-8 text-center">
              <p
                className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                  isRTL
                    ? "font-arabic text-text-secondary"
                    : "font-body text-text-secondary"
                }`}
              >
                {t.dressCodeText}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
