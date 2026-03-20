"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: "easeOut" },
  }),
};

export default function QuranicVerse() {
  const { t, isRTL } = useLanguage();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="px-6 py-20 sm:py-28"
    >
      <motion.div
        custom={0.2}
        variants={fadeInUp}
        className="verse-card max-w-xl mx-auto px-8 py-12 sm:px-12 sm:py-16 text-center"
      >
        {/* Opening Bismillah ornament */}
        <motion.div custom={0.3} variants={fadeInUp} className="mb-8">
          <svg width="30" height="30" viewBox="0 0 100 100" className="mx-auto text-accent opacity-50">
            <polygon points="50,5 61,39 97,39 68,61 79,95 50,73 21,95 32,61 3,39 39,39" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Verse */}
        <motion.blockquote
          custom={0.5}
          variants={fadeInUp}
          className={`text-base sm:text-lg leading-[2] ${
            isRTL
              ? "font-arabic-label text-text-primary"
              : "font-body italic text-text-primary"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t.quranVerse}
        </motion.blockquote>

        {/* Reference */}
        <motion.div custom={0.8} variants={fadeInUp} className="mt-8">
          <div className="accent-line mb-4" />
          <p
            className={`text-xs sm:text-sm tracking-wider ${
              isRTL
                ? "font-arabic-label text-accent-dark"
                : "font-body text-accent-dark"
            }`}
          >
            {t.quranReference}
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
