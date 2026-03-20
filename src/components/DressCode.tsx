"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, delay, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

export default function DressCode() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center"
        >
          <motion.h2
            custom={0.1}
            variants={fadeUp}
            className={`text-2xl sm:text-3xl mb-8 ${
              isRTL ? "font-arabic-label font-semibold text-text-primary" : "font-serif tracking-[0.15em] uppercase text-text-primary"
            }`}
          >
            {t.dressCodeTitle}
          </motion.h2>

          <motion.div custom={0.3} variants={fadeUp}>
            <div className="verse-card max-w-md mx-auto px-6 py-6 sm:px-8 sm:py-8 text-center">
              <p
                className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                  isRTL
                    ? "font-arabic-label text-text-secondary"
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
