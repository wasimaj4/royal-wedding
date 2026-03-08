"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-0 rounded-full border border-border bg-bg-primary/90 backdrop-blur-sm shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setLocale("en")}
        className={`px-4 py-2 text-xs font-serif tracking-wider transition-all duration-400 ${
          locale === "en"
            ? "bg-accent text-white"
            : "text-text-secondary hover:bg-bg-secondary"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <div className="w-px h-5 bg-border" />
      <button
        onClick={() => setLocale("ar")}
        className={`px-4 py-2 text-xs font-arabic tracking-wider transition-all duration-400 ${
          locale === "ar"
            ? "bg-accent text-white"
            : "text-text-secondary hover:bg-bg-secondary"
        }`}
        aria-label="Switch to Arabic"
      >
        AR
      </button>
    </motion.div>
  );
}
