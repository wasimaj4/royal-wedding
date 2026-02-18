"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import CandleFlame from "./CandleFlame";

interface EnvelopePageProps {
  onOpen: () => void;
  isOpening: boolean;
}

export default function EnvelopePage({ onOpen, isOpening }: EnvelopePageProps) {
  const { t, isRTL } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="min-h-screen parchment-bg flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Ambient candle glow background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left candle */}
        <div className="absolute top-[15%] left-[10%] sm:left-[15%]">
          <CandleFlame size="small" />
        </div>
        {/* Top right candle */}
        <div className="absolute top-[15%] right-[10%] sm:right-[15%]">
          <CandleFlame size="small" />
        </div>
        {/* Bottom left glow */}
        <div className="absolute bottom-[20%] left-[20%]">
          <CandleFlame size="tiny" />
        </div>
        {/* Bottom right glow */}
        <div className="absolute bottom-[20%] right-[20%]">
          <CandleFlame size="tiny" />
        </div>
      </div>

      {/* Soft vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(62,39,35,0.15)_100%)]" />

      {/* Envelope */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
        className="relative cursor-pointer group"
        onClick={!isOpening ? onOpen : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isOpening) onOpen();
        }}
        aria-label={t.tapToOpen}
      >
        {/* Envelope body */}
        <div className="envelope" style={{ perspective: "800px" }}>
          {/* Envelope back pattern — subtle lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 right-0 h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 20px,
                  rgba(139,117,54,0.15) 20px,
                  rgba(139,117,54,0.15) 21px
                )`,
              }}
            />
          </div>

          {/* Envelope gold border accent */}
          <div className="absolute inset-2 border border-gold/20 rounded-sm pointer-events-none" />

          {/* Flap */}
          <div
            className={`envelope-flap ${isOpening ? "opening" : ""}`}
            style={{ perspective: "600px" }}
          />

          {/* Wax Seal — centered */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            animate={
              isOpening
                ? { scale: 0, rotate: 45, opacity: 0 }
                : { scale: 1, rotate: 0, opacity: 1 }
            }
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <div className="wax-seal">
              <WaxSealDesign />
            </div>
          </motion.div>
        </div>

        {/* "Tap to Open" text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpening ? 0 : 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className={`mt-10 text-center font-serif text-lg tracking-[0.25em] text-gold-dark/80 ${
            isRTL ? "font-arabic" : ""
          }`}
        >
          {t.tapToOpen}
        </motion.p>
      </motion.div>

      {/* Decorative bottom ornament */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <OrnamentalDivider />
      </motion.div>
    </motion.div>
  );
}

function OrnamentalDivider() {
  return (
    <svg width="200" height="20" viewBox="0 0 200 20" className="text-gold-dark">
      <line x1="0" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <polygon points="95,5 100,10 105,5 100,0" fill="currentColor" opacity="0.6" />
      <polygon points="95,15 100,10 105,15 100,20" fill="currentColor" opacity="0.6" />
      <line x1="120" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

/* ── Ornate Wax Seal SVG Design ─────────────────────────── */
function WaxSealDesign() {
  return (
    <svg
      width="110"
      height="110"
      viewBox="0 0 200 200"
      className="relative z-10"
      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
    >
      {/* Outer decorative ring — beaded border */}
      <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" strokeDasharray="3 5" />

      {/* Small dots around the outer ring */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const x = 100 + 88 * Math.cos(angle);
        const y = 100 + 88 * Math.sin(angle);
        return (
          <circle key={`dot-${i}`} cx={x} cy={y} r="1" fill="rgba(255,255,255,0.18)" />
        );
      })}

      {/* Inner decorative ring */}
      <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="68" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

      {/* Left laurel branch */}
      <g opacity="0.2" fill="rgba(255,255,255,0.9)" transform="translate(100,100)">
        {/* Left branch */}
        <path d="M-8 30 Q-10 20 -8 10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <ellipse cx="-16" cy="28" rx="6" ry="3" transform="rotate(-30 -16 28)" />
        <ellipse cx="-19" cy="20" rx="6" ry="3" transform="rotate(-40 -19 20)" />
        <ellipse cx="-20" cy="12" rx="6" ry="3" transform="rotate(-50 -20 12)" />
        <ellipse cx="-18" cy="4" rx="5" ry="2.5" transform="rotate(-60 -18 4)" />
        <ellipse cx="-14" cy="-3" rx="5" ry="2.5" transform="rotate(-70 -14 -3)" />

        {/* Right branch */}
        <path d="M8 30 Q10 20 8 10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <ellipse cx="16" cy="28" rx="6" ry="3" transform="rotate(30 16 28)" />
        <ellipse cx="19" cy="20" rx="6" ry="3" transform="rotate(40 19 20)" />
        <ellipse cx="20" cy="12" rx="6" ry="3" transform="rotate(50 20 12)" />
        <ellipse cx="18" cy="4" rx="5" ry="2.5" transform="rotate(60 18 4)" />
        <ellipse cx="14" cy="-3" rx="5" ry="2.5" transform="rotate(70 14 -3)" />
      </g>

      {/* Crown / fleur-de-lis accent at top */}
      <g transform="translate(100, 38)" opacity="0.22" fill="rgba(255,255,255,0.9)">
        <path d="M0 0 L-3 8 L0 6 L3 8 Z" />
        <circle cx="-6" cy="4" r="1.5" />
        <circle cx="6" cy="4" r="1.5" />
        <path d="M-8 6 Q-10 2 -6 0" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        <path d="M8 6 Q10 2 6 0" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      </g>

      {/* "W" — left initial */}
      <text
        x="72"
        y="112"
        fontFamily="'Great Vibes', cursive"
        fontSize="48"
        fill="rgba(255,255,255,0.85)"
        textAnchor="middle"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
      >
        W
      </text>

      {/* Ampersand — center, smaller */}
      <text
        x="100"
        y="105"
        fontFamily="'Playfair Display', serif"
        fontSize="22"
        fontStyle="italic"
        fill="rgba(255,255,255,0.5)"
        textAnchor="middle"
      >
        &amp;
      </text>

      {/* "R" — right initial */}
      <text
        x="128"
        y="112"
        fontFamily="'Great Vibes', cursive"
        fontSize="48"
        fill="rgba(255,255,255,0.85)"
        textAnchor="middle"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
      >
        R
      </text>

      {/* Small diamond below initials */}
      <polygon points="100,138 104,142 100,146 96,142" fill="rgba(255,255,255,0.15)" />

      {/* Bottom small accent line */}
      <line x1="80" y1="152" x2="120" y2="152" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    </svg>
  );
}
