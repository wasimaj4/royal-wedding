"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-0 rounded-full border border-gold/40 bg-parchment/90 backdrop-blur-sm shadow-lg overflow-hidden"
    >
      <button
        onClick={() => setLocale("en")}
        className={`px-4 py-2 text-sm font-serif tracking-wider transition-all duration-500 ${
          locale === "en"
            ? "bg-gold text-white shadow-inner"
            : "text-gold-dark hover:bg-gold/10"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <div className="w-px h-6 bg-gold/30" />
      <button
        onClick={() => setLocale("ar")}
        className={`px-4 py-2 text-sm font-arabic tracking-wider transition-all duration-500 ${
          locale === "ar"
            ? "bg-gold text-white shadow-inner"
            : "text-gold-dark hover:bg-gold/10"
        }`}
        aria-label="التبديل إلى العربية"
      >
        AR
      </button>
    </motion.div>
  );
}
