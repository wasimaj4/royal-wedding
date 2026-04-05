"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

/* ═══════════════════════════════════════════════════════════════════
   LUXURY ENVELOPE — Cinematic Wedding Experience v3
   
   The entire viewport IS the envelope. No card. No centering.
   The seal sits exactly where the flap meets the body.
   
   Visual Architecture:
   ─────────────────────────────────────────────────────────────────
   BG    — Warm ivory atmosphere + deep vignette + studio light
   BODY  — Envelope front face: rich paper texture, edge shadows,
           gold filigree double-border, fold crease shadow
   FLAP  — Top 40% of viewport, triangular, 3D hinge rotation
   SEAL  — 100px gold disc at flap tip junction (top: 40%)
   
   Animation Phases (total ~4.8s):
   idle → pressed → waiting → breaking → opening → revealing → done
   ═══════════════════════════════════════════════════════════════════ */

/* ── Layout ── */
const FLAP_PCT = 40; // flap triangle tip at 40% of viewport height

/* ═══════════════════════════════════════════════════════════════
   RING GEOMETRY — Precise calculations from SVG viewBox
   ═══════════════════════════════════════════════════════════════
   SVG viewBox: 0 0 80 70  →  rendered: 144 × 126 px (scale 1.8×)

   Ring ellipses:
     Left:  center(30, 35)  semi-axes(17, 21)  rotation −14°
     Right: center(50, 35)  semi-axes(17, 21)  rotation +14°
     strokeWidth: 5.5  →  half-stroke = 2.75 viewBox units

   Key Y coordinates (viewBox → pixels from SVG top):
     Ring top (stroke outer):      ≈ 11.5  →  20.7 px
     Ring center:                    35.0  →  63.0 px
     Ring crossing (bottom):       ≈ 53.0  →  95.4 px
     Ring bottom (stroke center):  ≈ 55.8  → 100.4 px
     Ring bottom (stroke outer):   ≈ 58.5  → 105.3 px
     Cast shadow bottom:             67.0  → 120.6 px
   ═══════════════════════════════════════════════════════════════ */
const RING_CENTER_Y = 63;       // px: ring vertical center from SVG top
const RING_BOTTOM_Y = 105;      // px: ring outer-stroke bottom from SVG top
const CIRCLE_SIZE = 60;         // px: transparent glow circle diameter
const CIRCLE_TOP = RING_CENTER_Y - CIRCLE_SIZE / 2; // 33px
const RING_ABOVE_TIP = 8;       // px: ring bottom floats above triangle tip
const TAP_TEXT_OFFSET = 88;     // px: "tap to open" below triangle tip

/* ── Easing ── */
const EASE_CINEMATIC = [0.22, 0.61, 0.36, 1] as const;
const EASE_FLAP = [0.32, 0, 0.15, 1] as const;
const EASE_DISSOLVE = [0.4, 0, 0.2, 1] as const;

/* ── Rich gold seal gradient ── */
const SEAL_BG = `
  radial-gradient(circle at 38% 28%,
    #F5E4B0 0%, #E8CE88 6%, #DBBD72 14%,
    #CBAA5C 24%, #B8954E 36%, #A68042 48%,
    #8F6C38 60%, #7A5A2E 74%, #654A24 86%, #573F1E 100%
  )
`;

/* ── SVG noise texture (inlined, no network request) ── */
const PAPER_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

interface EnvelopeOpenProps {
  onOpen: () => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

export default function EnvelopeOpen({ onOpen, audioRef }: EnvelopeOpenProps) {
  const { t, isRTL } = useLanguage();
  const [phase, setPhase] = useState<
    "idle" | "pressed" | "waiting" | "breaking" | "opening" | "revealing" | "done"
  >("idle");

  /* ── Gold dust particles ── */
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        angle: (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
        dist: 45 + Math.random() * 50,
        size: 2 + Math.random() * 3.5,
        r: 180 + Math.floor(Math.random() * 55),
        g: 145 + Math.floor(Math.random() * 45),
        b: 45 + Math.floor(Math.random() * 55),
        delay: Math.random() * 0.14,
      })),
    []
  );

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;

    /* Start music NOW — inside the synchronous click handler
       so browsers treat this as a user-gesture-initiated play */
    if (audioRef?.current) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.volume = 0.02;
      audio.playbackRate = 0.70;
      audio.play().catch(() => {});
    }

    setPhase("pressed");
    // 0.3s pause — let the press register visually
    setTimeout(() => setPhase("waiting"), 300);
    // seal break — after rings interlock and settle
    setTimeout(() => setPhase("breaking"), 1300);
    // flap begins opening — slow, cinematic
    setTimeout(() => setPhase("opening"), 1800);
    // content reveal after flap is well open
    setTimeout(() => setPhase("revealing"), 4400);
    // dissolve out
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 6000);
  }, [phase, onOpen, audioRef]);

  const isAfterBreak = phase === "breaking" || phase === "opening" || phase === "revealing";
  const isOpening = phase === "opening" || phase === "revealing";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-fullscreen"
          className="fixed inset-0 z-50 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE_DISSOLVE as unknown as number[] }}
          style={{ width: "100vw", height: "100dvh", margin: 0, padding: 0 }}
        >

          {/* ═══════════════════════════════════════════════
              BG LAYER — Warm ivory atmosphere + parallax
              ═══════════════════════════════════════════════ */}
          <motion.div
            className="absolute inset-0"
            animate={
              isOpening
                ? { scale: 1.04, y: -8 }
                : phase === "pressed" || phase === "waiting"
                  ? { scale: 1.005 }
                  : { scale: 1 }
            }
            transition={
              isOpening
                ? { duration: 2.8, ease: EASE_CINEMATIC as unknown as number[] }
                : { duration: 0.3, ease: "easeOut" }
            }
            style={{
              background: `radial-gradient(ellipse at 50% 30%,
                #F5EFE5 0%,
                #EDE6D8 30%,
                #E3DAC8 60%,
                #D8CEBA 100%
              )`,
              willChange: "transform",
            }}
          >
            {/* Studio top-light (brighter at top) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg,
                  rgba(255,253,248,0.7) 0%,
                  rgba(255,252,248,0.3) 18%,
                  transparent 40%,
                  rgba(180,168,148,0.15) 72%,
                  rgba(155,142,122,0.28) 100%
                )`,
              }}
            />

            {/* Paper grain texture — visible */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: PAPER_NOISE,
                backgroundRepeat: "repeat",
                opacity: 0.065,
              }}
            />

            {/* Deep vignette — cinematic mood */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 45%,
                  transparent 30%,
                  rgba(0,0,0,0.05) 55%,
                  rgba(0,0,0,0.13) 78%,
                  rgba(0,0,0,0.22) 100%
                )`,
              }}
            />
          </motion.div>

          {/* Childhood photo — subtle watermark behind envelope */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <img
              src="/couple-childhood.png"
              alt=""
              className="w-full h-full object-cover"
              style={{ opacity: 0.09, filter: "sepia(0.4) saturate(0.4) brightness(1.1)" }}
            />
          </div>

          {/* Gold atmospheric glow (during animation) */}
          {(isAfterBreak || phase === "pressed" || phase === "waiting") && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={
                isOpening
                  ? { opacity: [0, 0.6, 0.3, 0] }
                  : { opacity: 0.18 }
              }
              transition={
                isOpening
                  ? { duration: 4.0, times: [0, 0.3, 0.65, 1], ease: "easeInOut" }
                  : { duration: 0.5 }
              }
              style={{
                background: `radial-gradient(ellipse at 50% ${FLAP_PCT}%,
                  rgba(210,185,120,0.18) 0%, transparent 50%)`,
              }}
            />
          )}

          {/* ═══════════════════════════════════════════════
              ENVELOPE — Clickable fullscreen surface
              ═══════════════════════════════════════════════ */}
          <motion.div
            className="absolute inset-0 cursor-pointer select-none"
            onClick={handleClick}
            tabIndex={0}
            role="button"
            aria-label="Open envelope"
            animate={
              phase === "revealing"
                ? { opacity: 0, scale: 1.02 }
                : phase === "pressed" || phase === "waiting"
                  ? { scale: 0.997 }
                  : { scale: 1 }
            }
            transition={
              phase === "revealing"
                ? { duration: 1.8, ease: EASE_DISSOLVE as unknown as number[] }
                : { duration: 0.3, ease: "easeOut" }
            }
            style={{ willChange: "transform, opacity" }}
          >
            <div
              className="relative w-full h-full"
              style={{ perspective: "1200px", perspectiveOrigin: "50% 35%" }}
            >

              {/* ─────────────────────────────────────────
                  INNER CARD — peeks through when flap opens
                  ───────────────────────────────────────── */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(170deg,
                    #FEFCF7 0%, #FAF6EE 35%, #F3ECE0 100%)`,
                  zIndex: 0,
                  willChange: "transform, opacity",
                }}
                animate={
                  isOpening
                    ? { y: -10, opacity: 1, scale: 1.002 }
                    : { y: 0, opacity: 0, scale: 1 }
                }
                transition={{
                  duration: 2.0,
                  delay: 0.6,
                  ease: EASE_FLAP as unknown as number[],
                }}
              >
              </motion.div>

              {/* ─────────────────────────────────────────
                  FRONT FACE — rich warm ivory paper body
                  ───────────────────────────────────────── */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(175deg,
                    #F7F2E9 0%, #F2EDE2 20%, #EDE6D8 48%,
                    #E7DFD0 70%, #E1D9C8 88%, #DACED8 100%
                  )`,
                  zIndex: 2,
                  willChange: "transform",
                }}
                animate={isOpening ? { y: 8 } : {}}
                transition={{
                  duration: 2.2,
                  delay: 0.4,
                  ease: EASE_FLAP as unknown as number[],
                }}
              >
                {/* Paper fiber texture — visible */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: PAPER_NOISE,
                    backgroundRepeat: "repeat",
                    opacity: 0.07,
                  }}
                />

                {/* Top lighting (studio light falloff) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg,
                      rgba(255,255,255,0.28) 0%,
                      rgba(255,255,255,0.1) 15%,
                      transparent 38%,
                      rgba(0,0,0,0.025) 68%,
                      rgba(0,0,0,0.055) 100%
                    )`,
                  }}
                />

                {/* Left edge fold shadow — deep */}
                <div
                  className="absolute top-0 left-0 bottom-0 pointer-events-none"
                  style={{
                    width: "clamp(40px, 8vw, 70px)",
                    background: "linear-gradient(to right, rgba(0,0,0,0.12), rgba(0,0,0,0.04) 50%, transparent)",
                  }}
                />

                {/* Right edge fold shadow — deep */}
                <div
                  className="absolute top-0 right-0 bottom-0 pointer-events-none"
                  style={{
                    width: "clamp(40px, 8vw, 70px)",
                    background: "linear-gradient(to left, rgba(0,0,0,0.12), rgba(0,0,0,0.04) 50%, transparent)",
                  }}
                />

                {/* Bottom edge shadow — deeper */}
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: "clamp(50px, 10vh, 90px)",
                    background: "linear-gradient(to top, rgba(0,0,0,0.09), rgba(0,0,0,0.03) 60%, transparent)",
                  }}
                />

                {/* ── Fold crease at flap junction ── */}
                <div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    top: `${FLAP_PCT}%`,
                    height: "14px",
                    marginTop: "-7px",
                    background: `linear-gradient(to bottom,
                      rgba(0,0,0,0.08),
                      rgba(0,0,0,0.04),
                      transparent
                    )`,
                    zIndex: 4,
                  }}
                />
                {/* Fold highlight (paper catches light above crease) */}
                <div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    top: `${FLAP_PCT}%`,
                    height: "1.5px",
                    marginTop: "-8px",
                    background: "rgba(255,255,255,0.4)",
                    zIndex: 4,
                  }}
                />

              </motion.div>

              {/* ─────────────────────────────────────────
                  SIDE FLAPS — subtle triangular depth
                  ───────────────────────────────────────── */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 1 }}
              >
                {/* Left inner shadow (fold depth) */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-[12%]"
                  style={{
                    background: `linear-gradient(to right,
                      rgba(200,190,175,0.08) 0%,
                      rgba(200,190,175,0.03) 40%,
                      transparent 100%
                    )`,
                  }}
                />
                {/* Right inner shadow */}
                <div
                  className="absolute top-0 right-0 bottom-0 w-[12%]"
                  style={{
                    background: `linear-gradient(to left,
                      rgba(200,190,175,0.08) 0%,
                      rgba(200,190,175,0.03) 40%,
                      transparent 100%
                    )`,
                  }}
                />
              </div>

              {/* ─────────────────────────────────────────
                  BOTTOM FLAP — visibly darker, physically distinct
                  ───────────────────────────────────────── */}
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ zIndex: -1, height: "32%" }}
              >
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                  style={{ display: "block" }}
                >
                  <defs>
                    <linearGradient id="bottomFlapGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C8BFA8" />
                      <stop offset="50%" stopColor="#C0B69E" />
                      <stop offset="100%" stopColor="#B8AC94" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="0,100 100,100 50,5"
                    fill="url(#bottomFlapGrad)"
                  />
                  {/* seam lines */}
                  <line x1="0" y1="100" x2="50" y2="5" stroke="rgba(0,0,0,0.1)" strokeWidth="0.4" />
                  <line x1="100" y1="100" x2="50" y2="5" stroke="rgba(0,0,0,0.1)" strokeWidth="0.4" />
                </svg>
              </div>

              {/* ─────────────────────────────────────────
                  TOP FLAP — 3D hinge at 40% height
                  ───────────────────────────────────────── */}
              <motion.div
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{
                  height: `${FLAP_PCT}%`,
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  zIndex: 12,
                  willChange: "transform",
                }}
                animate={
                  isOpening
                    ? { rotateX: -180 }
                    : isAfterBreak
                      ? { rotateX: -3 }
                      : { rotateX: 0 }
                }
                transition={
                  isOpening
                    ? { duration: 2.2, ease: EASE_FLAP as unknown as number[] }
                    : { duration: 0.6, ease: "easeOut" }
                }
              >
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                  style={{ display: "block" }}
                >
                  <defs>
                    <linearGradient id="flapGradV3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F2EBE0" />
                      <stop offset="40%" stopColor="#E9E0D2" />
                      <stop offset="75%" stopColor="#DED4C2" />
                      <stop offset="100%" stopColor="#D4C8B2" />
                    </linearGradient>
                    <linearGradient id="flapShadowV3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor="transparent" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.09)" />
                    </linearGradient>
                  </defs>
                  {/* Flap triangle */}
                  <polygon
                    points="0,0 100,0 50,100"
                    fill="url(#flapGradV3)"
                  />
                  {/* Shadow near tip */}
                  <polygon
                    points="0,0 100,0 50,100"
                    fill="url(#flapShadowV3)"
                  />
                  {/* Fold edge lines */}
                  <line x1="0" y1="0" x2="50" y2="100" stroke="rgba(150,138,118,0.18)" strokeWidth="0.3" />
                  <line x1="100" y1="0" x2="50" y2="100" stroke="rgba(150,138,118,0.18)" strokeWidth="0.3" />
                  {/* Top edge seam */}
                  <line x1="0" y1="0.3" x2="100" y2="0.3" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
                </svg>

                {/* Paper texture on flap */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: PAPER_NOISE,
                    backgroundRepeat: "repeat",
                    opacity: 0.065,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                />
              </motion.div>

              {/* Fold shadow — appears under flap during open */}
              <motion.div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  top: `${FLAP_PCT}%`,
                  height: "20px",
                  marginTop: "-4px",
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.06), transparent)",
                  borderRadius: "0 0 50% 50%",
                  zIndex: 3,
                  willChange: "transform, opacity",
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={
                  isOpening
                    ? { opacity: [0, 0.9, 0.4], scaleY: [0, 1.4, 0.7] }
                    : {}
                }
                transition={{ duration: 2.4, ease: "easeOut" }}
              />
            </div>

            {/* ═══════════════════════════════════════════════════════════
                WEDDING MONOGRAM — W 💍💍 R

                ALIGNMENT (whole block moves as one unit):
                ════════════════════════════════════════════════════════════
                1. Ring outer bottom = RING_ABOVE_TIP px above triangle tip
                   CSS top  = FLAP_PCT% − RING_ABOVE_TIP
                   Framer y = −RING_BOTTOM_Y  → shifts block up so ring
                             outer bottom sits at (FLAP_PCT% − 8px)

                2. LETTERS TOP = CIRCLE TOP (independent inner alignment)
                   Circle top  = RING_CENTER_Y − CIRCLE_SIZE/2 = 33px
                   Letters top = 33px (same as circle)
                ═══════════════════════════════════════════════════════════ */}
            <AnimatePresence>
              {(phase === "idle" || phase === "pressed" || phase === "waiting" || phase === "breaking") && (
                <motion.div
                  className="absolute z-20 pointer-events-auto"
                  style={{
                    left: "50%",
                    top: `calc(${FLAP_PCT}% - ${RING_ABOVE_TIP}px)`,
                    x: "-50%",
                    cursor: phase === "idle" ? "pointer" : "default",
                  }}
                  onClick={handleClick}
                  initial={{ opacity: 1, y: -RING_BOTTOM_Y }}
                  animate={
                    phase === "breaking"
                      ? { opacity: 0, y: -(RING_BOTTOM_Y + 10) }
                      : { opacity: 1, y: -RING_BOTTOM_Y }
                  }
                  exit={{ opacity: 0, y: -(RING_BOTTOM_Y + 10) }}
                  transition={
                    phase === "breaking"
                      ? { duration: 0.5, ease: "easeOut" }
                      : { duration: 0.3 }
                  }
                >
                  {/* ── Interlocked Wedding Rings — positioned at top of container ── */}
                  <motion.svg
                    className="pointer-events-none"
                    viewBox="0 0 80 70"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      width: 144,
                      height: 126,
                      zIndex: 2,
                      overflow: "visible",
                      filter: "drop-shadow(0 0 20px rgba(212,175,55,0.25)) drop-shadow(0 10px 25px rgba(0,0,0,0.15))",
                    }}
                    animate={{
                      rotate:
                        phase === "pressed" || phase === "waiting"
                          ? [0, 8, -4, 0]
                          : 0,
                      scale:
                        phase === "pressed" || phase === "waiting"
                          ? 0.94
                          : 1,
                    }}
                    transition={{
                      rotate: { duration: 0.8, ease: "easeInOut" },
                      scale: { duration: 0.3, ease: "easeOut" },
                    }}
                  >
                    <defs>
                      <linearGradient id="rg-base" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F5E4B0" />
                        <stop offset="26%" stopColor="#E2C575" />
                        <stop offset="52%" stopColor="#D4AF37" />
                        <stop offset="76%" stopColor="#B8954E" />
                        <stop offset="100%" stopColor="#DAC07A" />
                      </linearGradient>
                      <linearGradient id="rg-hi" x1="0.15" y1="0" x2="0.85" y2="1">
                        <stop offset="0%" stopColor="rgba(255,252,240,0.55)" />
                        <stop offset="30%" stopColor="rgba(255,252,240,0.04)" />
                        <stop offset="60%" stopColor="rgba(255,252,240,0.28)" />
                        <stop offset="100%" stopColor="rgba(255,252,240,0.0)" />
                      </linearGradient>
                      <linearGradient id="rg-dp" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(100,75,25,0.38)" />
                        <stop offset="45%" stopColor="rgba(100,75,25,0.06)" />
                        <stop offset="100%" stopColor="rgba(100,75,25,0.32)" />
                      </linearGradient>
                      <clipPath id="rg-top">
                        <rect x="-10" y="-10" width="100" height="45" />
                      </clipPath>
                      <clipPath id="rg-bot">
                        <rect x="-10" y="35" width="100" height="45" />
                      </clipPath>
                    </defs>

                    {/* Soft cast shadow */}
                    <ellipse cx="40" cy="63" rx="22" ry="4" fill="rgba(0,0,0,0.08)" />

                    {/* RIGHT RING: bottom half (BEHIND left ring) */}
                    <g clipPath="url(#rg-bot)">
                      <motion.g
                        animate={{
                          x: phase === "pressed" || phase === "waiting" ? -6 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 16, mass: 0.7 }}
                      >
                        <ellipse cx="50" cy="35" rx="17" ry="21" fill="none" stroke="url(#rg-base)" strokeWidth="5.5" transform="rotate(14, 50, 35)" />
                        <ellipse cx="50" cy="35" rx="17" ry="21" fill="none" stroke="url(#rg-dp)" strokeWidth="2.8" transform="rotate(14, 50, 35)" />
                      </motion.g>
                    </g>

                    {/* LEFT RING: full circle (middle layer) */}
                    <motion.g
                      animate={{
                        x: phase === "pressed" || phase === "waiting" ? 6 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 16, mass: 0.7 }}
                    >
                      <ellipse cx="30" cy="35" rx="17" ry="21" fill="none" stroke="url(#rg-base)" strokeWidth="5.5" transform="rotate(-14, 30, 35)" />
                      <ellipse cx="30" cy="35" rx="17" ry="21" fill="none" stroke="url(#rg-dp)" strokeWidth="2.8" transform="rotate(-14, 30, 35)" />
                      <ellipse cx="30" cy="35" rx="17" ry="21" fill="none" stroke="url(#rg-hi)" strokeWidth="1.6" transform="rotate(-14, 30, 35)" />
                    </motion.g>

                    {/* RIGHT RING: top half (IN FRONT of left ring) */}
                    <g clipPath="url(#rg-top)">
                      <motion.g
                        animate={{
                          x: phase === "pressed" || phase === "waiting" ? -6 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 16, mass: 0.7 }}
                      >
                        <ellipse cx="50" cy="35" rx="17" ry="21" fill="none" stroke="url(#rg-base)" strokeWidth="5.5" transform="rotate(14, 50, 35)" />
                        <ellipse cx="50" cy="35" rx="17" ry="21" fill="none" stroke="url(#rg-hi)" strokeWidth="1.6" transform="rotate(14, 50, 35)" />
                      </motion.g>
                    </g>
                  </motion.svg>

                  {/* ── Background circle — TOP aligned with letters ── */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: "50%",
                      top: CIRCLE_TOP, // 33px = RING_CENTER_Y − CIRCLE_SIZE/2
                      width: CIRCLE_SIZE,
                      height: CIRCLE_SIZE,
                      transform: "translateX(-50%)",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.10) 70%, transparent 100%)",
                      zIndex: 1,
                    }}
                  />

                  {/* ── Letter W — TOP = CIRCLE_TOP (locked alignment) ── */}
                  <motion.span
                    className="absolute select-none pointer-events-none"
                    style={{
                      right: "calc(50% + 58px)",
                      top: CIRCLE_TOP, // 33px — same as circle top ✓
                      fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive",
                      fontSize: "140px",
                      fontWeight: 400,
                      color: "rgba(212,175,55,0.35)",
                      lineHeight: 1,
                      textShadow: "0 0 30px rgba(212,175,55,0.2), 0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    animate={
                      phase === "pressed" || phase === "waiting"
                        ? { scale: 0.96 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    W
                  </motion.span>

                  {/* ── Letter R — TOP = CIRCLE_TOP (locked alignment) ── */}
                  <motion.span
                    className="absolute select-none pointer-events-none"
                    style={{
                      left: "calc(50% + 58px)",
                      top: CIRCLE_TOP, // 33px — same as circle top ✓
                      fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive",
                      fontSize: "140px",
                      fontWeight: 400,
                      color: "rgba(212,175,55,0.35)",
                      lineHeight: 1,
                      textShadow: "0 0 30px rgba(212,175,55,0.2), 0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    animate={
                      phase === "pressed" || phase === "waiting"
                        ? { scale: 0.96 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    R
                  </motion.span>

                  {/* Ambient glow (breathing pulse) — idle only */}
                  {phase === "idle" && (
                    <motion.div
                      className="absolute pointer-events-none"
                      style={{
                        left: "50%",
                      top: RING_CENTER_Y, // 63px — ring center
                        width: 180,
                        height: 140,
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        zIndex: 0,
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 25px 8px rgba(212,175,55,0.06)",
                          "0 0 50px 18px rgba(212,175,55,0.14)",
                          "0 0 25px 8px rgba(212,175,55,0.06)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── "Tap to open" ── */}
            {phase === "idle" && (
              <motion.p
                className={`absolute left-0 right-0 text-center z-30 pointer-events-none ${
                  isRTL
                    ? "font-arabic-label text-[1.1rem] sm:text-[1.25rem] tracking-wide"
                    : "font-body text-xs sm:text-sm tracking-[0.32em] uppercase"
                }`}
                style={{
                  top: `calc(${FLAP_PCT}% + ${TAP_TEXT_OFFSET}px)`,
                  color: "rgba(62,39,35,1)",
                  textShadow: "0 1px 4px rgba(255,252,245,0.9), 0 0 16px rgba(255,250,235,0.6)",
                  fontWeight: isRTL ? 600 : undefined,
                  letterSpacing: isRTL ? "0.5px" : undefined,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: [0, 1, 1, 0.85, 1], y: 0 }}
                transition={{
                  delay: 0.8,
                  duration: 3,
                  ease: "easeOut",
                  times: [0, 0.3, 0.6, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
              >
                {t.tapToOpen}
              </motion.p>
            )}
          </motion.div>

          {/* ════════ LIGHT BLOOM ════════ */}
          {phase === "revealing" && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.65, 0] }}
              transition={{
                duration: 3.0,
                times: [0, 0.3, 0.65, 1],
                ease: "easeOut",
              }}
              style={{
                background: `radial-gradient(ellipse at 50% ${FLAP_PCT}%,
                  rgba(255,255,255,0.95) 0%,
                  rgba(255,255,255,0.35) 30%,
                  transparent 60%)`,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
