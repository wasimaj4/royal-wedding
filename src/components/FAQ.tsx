"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  }),
};

export default function FAQ() {
  const { t, isRTL } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div custom={0} variants={fadeUp} className="text-center">
            <div className="section-divider mb-10" />
          </motion.div>

          <motion.div custom={0.1} variants={fadeUp} className="flex justify-center mb-6">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent opacity-60"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </motion.div>

          <motion.h2
            custom={0.2}
            variants={fadeUp}
            className={`text-center text-2xl sm:text-3xl tracking-[0.15em] uppercase mb-10 ${
              isRTL ? "font-arabic text-text-primary" : "font-serif text-text-primary"
            }`}
          >
            {t.faqTitle}
          </motion.h2>

          <div className="space-y-3">
            {t.faqItems.map((item, i) => (
              <motion.div key={i} custom={0.3 + 0.1 * i} variants={fadeUp}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`w-full text-left faq-accordion-btn ${
                    openIndex === i ? "active" : ""
                  } ${isRTL ? "text-right" : ""}`}
                >
                  <span
                    className={`flex-1 text-sm sm:text-base ${
                      isRTL ? "font-arabic" : "font-body"
                    }`}
                  >
                    {item.question}
                  </span>
                  <motion.svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent flex-shrink-0"
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className={`faq-answer ${isRTL ? "text-right" : "text-left"}`}>
                        <p
                          className={`text-sm sm:text-base leading-relaxed ${
                            isRTL
                              ? "font-arabic text-text-secondary"
                              : "font-body text-text-secondary"
                          }`}
                        >
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
