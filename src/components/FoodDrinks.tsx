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

export default function FoodDrinks() {
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
            {t.foodDrinksTitle}
          </motion.h2>

          <motion.div custom={0.3} variants={fadeUp}>
            <div className="verse-card max-w-md mx-auto px-6 py-6 sm:px-8 sm:py-8">
              {/* Food */}
              <p
                className={`text-sm sm:text-base mb-4 ${
                  isRTL
                    ? "font-arabic-label font-semibold text-text-primary text-right"
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
                        ? "font-arabic-label text-text-secondary flex-row-reverse"
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
                    ? "font-arabic-label font-semibold text-text-primary text-right"
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
                        ? "font-arabic-label text-text-secondary flex-row-reverse"
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
                    ? "font-arabic-label text-text-muted text-center"
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
