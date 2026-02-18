"use client";

import { motion } from "framer-motion";

interface CandleFlameProps {
  size?: "tiny" | "small" | "medium" | "large";
}

const sizeMap = {
  tiny: { flame: 20, glow: 40, candle: 30 },
  small: { flame: 30, glow: 60, candle: 50 },
  medium: { flame: 40, glow: 80, candle: 70 },
  large: { flame: 50, glow: 100, candle: 90 },
};

export default function CandleFlame({ size = "medium" }: CandleFlameProps) {
  const s = sizeMap[size];

  return (
    <div className="flex flex-col items-center" style={{ width: s.candle }}>
      {/* Flame glow (outer) */}
      <motion.div
        className="rounded-full"
        style={{
          width: s.glow,
          height: s.glow,
          background: `radial-gradient(ellipse at center, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.15) 40%, transparent 70%)`,
          position: "absolute",
          top: -s.glow / 3,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.6, 0.9, 0.5],
          scale: [1, 1.05, 0.98, 1.03, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Flame SVG */}
      <motion.div
        className="flame-container relative"
        animate={{
          scaleY: [1, 1.08, 0.95, 1.05, 1],
          scaleX: [1, 0.97, 1.03, 0.98, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width={s.flame}
          height={s.flame * 1.5}
          viewBox="0 0 40 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`flameGrad-${size}`} cx="50%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="30%" stopColor="#FFD700" />
              <stop offset="60%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M20 5 C12 20, 5 35, 10 50 C13 55, 18 58, 20 58 C22 58, 27 55, 30 50 C35 35, 28 20, 20 5Z"
            fill={`url(#flameGrad-${size})`}
          />
          {/* Inner bright core */}
          <path
            d="M20 20 C16 30, 13 40, 16 48 C17 50, 19 52, 20 52 C21 52, 23 50, 24 48 C27 40, 24 30, 20 20Z"
            fill="#FFF8DC"
            opacity="0.8"
          />
        </svg>
      </motion.div>

      {/* Candle body */}
      <div
        className="rounded-sm"
        style={{
          width: s.candle * 0.35,
          height: s.candle * 1.2,
          background: `linear-gradient(180deg, #FFF8F0 0%, #F5EEE0 50%, #E8DDD0 100%)`,
          boxShadow: `inset -2px 0 4px rgba(0,0,0,0.05), inset 2px 0 4px rgba(255,255,255,0.3)`,
        }}
      />

      {/* Candle base */}
      <div
        className="rounded-sm"
        style={{
          width: s.candle * 0.5,
          height: 4,
          background: `linear-gradient(180deg, #D4AF37, #B8960C)`,
        }}
      />
    </div>
  );
}
