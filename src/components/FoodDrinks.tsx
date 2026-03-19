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

export default function FoodDrinks() {
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
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </motion.div>

          <motion.h2
            custom={0.2}
            variants={fadeUp}
            className={`text-2xl sm:text-3xl tracking-[0.15em] uppercase mb-8 ${
              isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary"
            }`}
          >
            {t.foodDrinksTitle}
          </motion.h2>

          <motion.div custom={0.4} variants={fadeUp}>
            <div className="verse-card max-w-md mx-auto px-6 py-6 sm:px-8 sm:py-8">
              {/* Food */}
              <p
                className={`text-sm sm:text-base mb-4 ${
                  isRTL
                    ? "font-arabic text-text-primary font-bold text-right"
                    : "font-serif text-text-primary font-semibold text-left"
                }`}
              >
                {t.foodIntro}
              </p>
              <ul className={`mb-6 space-y-1.5 ${isRTL ? "text-right pr-4" : "text-left pl-4"}`}>
                {t.foodItems.map((item, i) => (
                  <li
                    key={i}
                    className={`text-sm sm:text-base flex items-center gap-2 ${
                      isRTL
                        ? "font-arabic text-text-secondary flex-row-reverse"
                        : "font-body text-text-secondary"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="accent-line mb-6" />

              {/* Drinks */}
              <p
                className={`text-sm sm:text-base mb-4 ${
                  isRTL
                    ? "font-arabic text-text-primary font-bold text-right"
                    : "font-serif text-text-primary font-semibold text-left"
                }`}
              >
                {t.drinksIntro}
              </p>
              <ul className={`mb-6 space-y-1.5 ${isRTL ? "text-right pr-4" : "text-left pl-4"}`}>
                {t.drinkItems.map((item, i) => (
                  <li
                    key={i}
                    className={`text-sm sm:text-base flex items-center gap-2 ${
                      isRTL
                        ? "font-arabic text-text-secondary flex-row-reverse"
                        : "font-body text-text-secondary"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="accent-line mb-5" />

              {/* Note */}
              <p
                className={`text-xs sm:text-sm tracking-wider ${
                  isRTL
                    ? "font-arabic text-text-muted text-center"
                    : "font-body text-text-muted text-center italic"
                }`}
              >
                {t.foodNote}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
