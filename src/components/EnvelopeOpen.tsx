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
const SEAL = 120;
const HALF = SEAL / 2;
const FLAP_PCT = 40; // flap apex at 40% of viewport height

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
      audio.volume = 0.25;
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

            {/* ═══════════════════════════════════════════════
                WAX SEAL — at the exact flap junction
                Positioned at top: FLAP_PCT%, left: 50%
                ═══════════════════════════════════════════════ */}
            <AnimatePresence>
              {(phase === "idle" || phase === "pressed" || phase === "waiting") && (
                <>
                  {/* ═══ PREMIUM WAX SEAL ═══ */}

                  {/* Seal ambient glow (breathing gold pulse) */}
                  <motion.div
                    className="absolute z-20 pointer-events-none"
                    style={{
                      width: SEAL + 32,
                      height: SEAL + 32,
                      left: "50%",
                      top: `${FLAP_PCT}%`,
                      marginLeft: -(SEAL + 32) / 2,
                      marginTop: -(SEAL + 32) / 2,
                      borderRadius: "50%",
                    }}
                    animate={
                      phase === "idle"
                        ? {
                            boxShadow: [
                              "0 0 24px 8px rgba(196,162,101,0.12), 0 0 60px 20px rgba(196,162,101,0.06)",
                              "0 0 48px 18px rgba(196,162,101,0.30), 0 0 80px 30px rgba(196,162,101,0.12)",
                              "0 0 24px 8px rgba(196,162,101,0.12), 0 0 60px 20px rgba(196,162,101,0.06)",
                            ],
                            scale: [1, 1.04, 1],
                          }
                        : phase === "pressed" || phase === "waiting"
                        ? {
                            boxShadow: "0 0 60px 24px rgba(196,162,101,0.40), 0 0 100px 40px rgba(196,162,101,0.18)",
                            scale: 1.12,
                          }
                        : {
                            boxShadow: "0 0 14px 5px rgba(196,162,101,0.08)",
                            scale: 1,
                          }
                    }
                    transition={
                      phase === "idle"
                        ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.3, ease: "easeOut" }
                    }
                  />

                  {/* ── Seal disc ── */}
                  <motion.div
                    className="absolute z-20 flex items-center justify-center"
                    style={{
                      width: SEAL,
                      height: SEAL,
                      left: "50%",
                      top: `${FLAP_PCT}%`,
                      marginLeft: -HALF,
                      marginTop: -HALF,
                      borderRadius: "50%",
                      background: SEAL_BG,
                      boxShadow: `
                        0 10px 32px rgba(0,0,0,0.38),
                        0 4px 10px rgba(0,0,0,0.26),
                        0 18px 48px rgba(80,60,20,0.22),
                        inset 0 3px 10px rgba(255,245,215,0.45),
                        inset 0 -6px 18px rgba(0,0,0,0.3),
                        inset 5px 0 10px rgba(0,0,0,0.1),
                        inset -5px 0 10px rgba(0,0,0,0.1)
                      `,
                      willChange: "transform",
                    }}
                    animate={
                      phase === "pressed" || phase === "waiting"
                        ? {
                            scale: 0.91,
                            rotate: -2,
                            boxShadow: `
                              0 4px 16px rgba(0,0,0,0.50),
                              0 2px 6px rgba(0,0,0,0.34),
                              0 8px 24px rgba(80,60,20,0.28),
                              0 0 40px 12px rgba(196,162,101,0.25),
                              inset 0 3px 10px rgba(255,245,215,0.50),
                              inset 0 -6px 18px rgba(0,0,0,0.35),
                              inset 5px 0 10px rgba(0,0,0,0.12),
                              inset -5px 0 10px rgba(0,0,0,0.12)
                            `,
                          }
                        : {
                            scale: 1,
                            rotate: 0,
                            boxShadow: `
                              0 10px 32px rgba(0,0,0,0.38),
                              0 4px 10px rgba(0,0,0,0.26),
                              0 18px 48px rgba(80,60,20,0.22),
                              inset 0 3px 10px rgba(255,245,215,0.45),
                              inset 0 -6px 18px rgba(0,0,0,0.3),
                              inset 5px 0 10px rgba(0,0,0,0.1),
                              inset -5px 0 10px rgba(0,0,0,0.1)
                            `,
                          }
                    }
                    whileHover={
                      phase === "idle"
                        ? {
                            scale: 1.06,
                            rotate: 0.5,
                            boxShadow: `
                              0 14px 42px rgba(0,0,0,0.42),
                              0 4px 10px rgba(0,0,0,0.26),
                              0 22px 60px rgba(80,60,20,0.28),
                              0 0 36px 10px rgba(196,162,101,0.24),
                              inset 0 3px 10px rgba(255,245,215,0.55),
                              inset 0 -6px 18px rgba(0,0,0,0.3),
                              inset 5px 0 10px rgba(0,0,0,0.1),
                              inset -5px 0 10px rgba(0,0,0,0.1)
                            `,
                          }
                        : {}
                    }
                    whileTap={phase === "idle" ? { scale: 0.91, rotate: -2 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                      mass: 0.8,
                    }}
                  >
                    {/* Wax texture overlay (realistic surface) */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
                      style={{
                        backgroundImage: PAPER_NOISE,
                        backgroundRepeat: "repeat",
                        backgroundSize: "180px 180px",
                        opacity: 0.065,
                        mixBlendMode: "multiply",
                      }}
                    />

                    {/* ── Outer embossed ring ── */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 120 120" style={{ zIndex: 1 }}>
                      <circle cx="60" cy="60" r="53" fill="none" stroke="rgba(255,240,200,0.22)" strokeWidth="2.5" />
                    </svg>

                    {/* Specular highlight — top-left (studio light reflection) */}
                    <div
                      className="absolute top-[7px] left-[12px] w-[44px] h-[26px] rounded-full pointer-events-none"
                      style={{
                        background: "linear-gradient(145deg, rgba(255,253,240,0.55) 0%, rgba(255,250,225,0.18) 55%, transparent 100%)",
                        filter: "blur(4.5px)",
                      }}
                    />

                    {/* Secondary rim catch light (bottom-right) */}
                    <div
                      className="absolute bottom-[14px] right-[10px] w-[20px] h-[12px] rounded-full pointer-events-none"
                      style={{
                        background: "linear-gradient(320deg, rgba(255,252,240,0.2) 0%, transparent 100%)",
                        filter: "blur(3px)",
                      }}
                    />

                    {/* Edge imperfections — handcrafted wax character */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        boxShadow: `
                          inset 3px 1px 4px rgba(0,0,0,0.05),
                          inset -2px 2px 3px rgba(0,0,0,0.04),
                          inset 1px -3px 5px rgba(0,0,0,0.06),
                          inset -1px -1px 2px rgba(255,250,230,0.04)
                        `,
                      }}
                    />

                    {/* ── Luxury Monogram: W 💍💍 R — realistic interlocked rings ── */}
                    <div
                      className="flex items-center justify-center select-none pointer-events-none"
                      style={{
                        position: "relative",
                        zIndex: 2,
                        direction: "ltr",
                      }}
                    >
                      {/* Letter W — Great Vibes signature calligraphy */}
                      <span
                        style={{
                          fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive",
                          fontSize: "36px",
                          fontWeight: 400,
                          color: "rgba(255,248,230,0.72)",
                          textShadow:
                            "0 0 10px rgba(212,175,55,0.18), 0 2px 5px rgba(0,0,0,0.30)",
                          lineHeight: 1,
                          letterSpacing: "0.02em",
                          marginRight: "-4px",
                        }}
                      >
                        W
                      </span>

                      {/* ── Realistic Interlocked Wedding Rings ── */}
                      <motion.svg
                        viewBox="0 0 80 70"
                        style={{ width: 64, height: 56, overflow: "visible" }}
                        animate={{
                          filter:
                            phase === "pressed" || phase === "waiting"
                              ? "drop-shadow(0 0 18px rgba(212,175,55,0.45)) drop-shadow(0 8px 22px rgba(0,0,0,0.12))"
                              : "drop-shadow(0 0 8px rgba(212,175,55,0.20)) drop-shadow(0 6px 16px rgba(0,0,0,0.08))",
                          rotate:
                            phase === "pressed" || phase === "waiting"
                              ? [0, 7, -3, 0]
                              : 0,
                        }}
                        transition={{
                          filter: { duration: 0.5, ease: "easeOut" },
                          rotate: { duration: 0.85, ease: "easeInOut" },
                        }}
                      >
                        <defs>
                          {/* Gold band base gradient */}
                          <linearGradient id="rg-base" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#F5E4B0" />
                            <stop offset="26%" stopColor="#E2C575" />
                            <stop offset="52%" stopColor="#D4AF37" />
                            <stop offset="76%" stopColor="#B8954E" />
                            <stop offset="100%" stopColor="#DAC07A" />
                          </linearGradient>

                          {/* Specular highlight */}
                          <linearGradient id="rg-hi" x1="0.15" y1="0" x2="0.85" y2="1">
                            <stop offset="0%" stopColor="rgba(255,252,240,0.55)" />
                            <stop offset="30%" stopColor="rgba(255,252,240,0.04)" />
                            <stop offset="60%" stopColor="rgba(255,252,240,0.28)" />
                            <stop offset="100%" stopColor="rgba(255,252,240,0.0)" />
                          </linearGradient>

                          {/* Inner depth / shadow gradient */}
                          <linearGradient id="rg-dp" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="rgba(100,75,25,0.38)" />
                            <stop offset="45%" stopColor="rgba(100,75,25,0.06)" />
                            <stop offset="100%" stopColor="rgba(100,75,25,0.32)" />
                          </linearGradient>

                          {/* Clip paths for interlock illusion */}
                          <clipPath id="rg-top">
                            <rect x="-10" y="-10" width="100" height="45" />
                          </clipPath>
                          <clipPath id="rg-bot">
                            <rect x="-10" y="35" width="100" height="45" />
                          </clipPath>
                        </defs>

                        {/* Soft cast shadow beneath the rings */}
                        <ellipse cx="40" cy="63" rx="20" ry="3.5" fill="rgba(0,0,0,0.06)" />

                        {/* ─── RIGHT RING: bottom half (BEHIND left ring) ─── */}
                        <g clipPath="url(#rg-bot)">
                          <motion.g
                            animate={{
                              x: phase === "pressed" || phase === "waiting" ? -5 : 0,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 16,
                              mass: 0.7,
                            }}
                          >
                            <ellipse
                              cx="50" cy="35" rx="17" ry="21"
                              fill="none" stroke="url(#rg-base)" strokeWidth="5.5"
                              transform="rotate(14, 50, 35)"
                            />
                            <ellipse
                              cx="50" cy="35" rx="17" ry="21"
                              fill="none" stroke="url(#rg-dp)" strokeWidth="2.8"
                              transform="rotate(14, 50, 35)"
                            />
                          </motion.g>
                        </g>

                        {/* ─── LEFT RING: full circle (middle layer) ─── */}
                        <motion.g
                          animate={{
                            x: phase === "pressed" || phase === "waiting" ? 5 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 16,
                            mass: 0.7,
                          }}
                        >
                          <ellipse
                            cx="30" cy="35" rx="17" ry="21"
                            fill="none" stroke="url(#rg-base)" strokeWidth="5.5"
                            transform="rotate(-14, 30, 35)"
                          />
                          <ellipse
                            cx="30" cy="35" rx="17" ry="21"
                            fill="none" stroke="url(#rg-dp)" strokeWidth="2.8"
                            transform="rotate(-14, 30, 35)"
                          />
                          <ellipse
                            cx="30" cy="35" rx="17" ry="21"
                            fill="none" stroke="url(#rg-hi)" strokeWidth="1.6"
                            transform="rotate(-14, 30, 35)"
                          />
                        </motion.g>

                        {/* ─── RIGHT RING: top half (IN FRONT of left ring) ─── */}
                        <g clipPath="url(#rg-top)">
                          <motion.g
                            animate={{
                              x: phase === "pressed" || phase === "waiting" ? -5 : 0,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 16,
                              mass: 0.7,
                            }}
                          >
                            <ellipse
                              cx="50" cy="35" rx="17" ry="21"
                              fill="none" stroke="url(#rg-base)" strokeWidth="5.5"
                              transform="rotate(14, 50, 35)"
                            />
                            <ellipse
                              cx="50" cy="35" rx="17" ry="21"
                              fill="none" stroke="url(#rg-hi)" strokeWidth="1.6"
                              transform="rotate(14, 50, 35)"
                            />
                          </motion.g>
                        </g>
                      </motion.svg>

                      {/* Letter R — Great Vibes signature calligraphy */}
                      <span
                        style={{
                          fontFamily: "var(--font-great-vibes), 'Great Vibes', cursive",
                          fontSize: "36px",
                          fontWeight: 400,
                          color: "rgba(255,248,230,0.72)",
                          textShadow:
                            "0 0 10px rgba(212,175,55,0.18), 0 2px 5px rgba(0,0,0,0.30)",
                          lineHeight: 1,
                          letterSpacing: "0.02em",
                          marginLeft: "-4px",
                        }}
                      >
                        R
                      </span>
                    </div>
                  </motion.div>
                </>
              )}

              {/* ════════ SEAL BREAK ════════ */}
              {isAfterBreak && (
                <>
                  {/* Crack flash */}
                  <motion.div
                    className="absolute z-[22] pointer-events-none"
                    style={{
                      width: 2,
                      height: SEAL - 16,
                      left: "50%",
                      top: `${FLAP_PCT}%`,
                      marginLeft: -1,
                      marginTop: -(SEAL - 16) / 2,
                      background: "linear-gradient(to bottom, transparent, rgba(220,195,140,0.7), transparent)",
                      borderRadius: 1,
                    }}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />

                  {/* Left half */}
                  <motion.div
                    className="absolute z-20 overflow-hidden"
                    style={{
                      width: HALF,
                      height: SEAL,
                      left: "50%",
                      top: `${FLAP_PCT}%`,
                      marginLeft: -HALF,
                      marginTop: -HALF,
                      borderRadius: `${HALF}px 0 0 ${HALF}px`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                    animate={{ x: -36, y: 22, opacity: 0, rotate: -24 }}
                    transition={{ duration: 0.7, ease: [0.35, 0, 0.55, 1] }}
                  >
                    <div
                      style={{
                        width: SEAL,
                        height: SEAL,
                        borderRadius: "50%",
                        background: SEAL_BG,
                        boxShadow: "0 5px 16px rgba(0,0,0,0.25), inset 0 2px 6px rgba(255,245,220,0.35)",
                      }}
                    />
                  </motion.div>

                  {/* Right half */}
                  <motion.div
                    className="absolute z-20 overflow-hidden"
                    style={{
                      width: HALF,
                      height: SEAL,
                      left: "50%",
                      top: `${FLAP_PCT}%`,
                      marginTop: -HALF,
                      borderRadius: `0 ${HALF}px ${HALF}px 0`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                    animate={{ x: 36, y: 22, opacity: 0, rotate: 24 }}
                    transition={{ duration: 0.7, ease: [0.35, 0, 0.55, 1] }}
                  >
                    <div
                      style={{
                        width: SEAL,
                        height: SEAL,
                        marginLeft: -HALF,
                        borderRadius: "50%",
                        background: SEAL_BG,
                        boxShadow: "0 5px 16px rgba(0,0,0,0.25), inset 0 2px 6px rgba(255,245,220,0.35)",
                      }}
                    />
                  </motion.div>

                  {/* Gold dust */}
                  {particles.map((p, i) => (
                    <motion.div
                      key={i}
                      className="absolute z-[21] rounded-full"
                      style={{
                        width: p.size,
                        height: p.size,
                        left: "50%",
                        top: `${FLAP_PCT}%`,
                        marginLeft: -p.size / 2,
                        marginTop: -p.size / 2,
                        background: `rgba(${p.r}, ${p.g}, ${p.b}, 0.85)`,
                        willChange: "transform, opacity",
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos(p.angle) * p.dist,
                        y: Math.sin(p.angle) * p.dist + 16,
                        opacity: 0,
                        scale: 0.1,
                      }}
                      transition={{
                        duration: 0.9,
                        delay: p.delay,
                        ease: [0.15, 0, 0.5, 1],
                      }}
                    />
                  ))}
                </>
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
                  top: `calc(${FLAP_PCT}% + ${HALF + 28}px)`,
                  color: "rgba(62,39,35,1)",
                  textShadow: "0 1px 4px rgba(255,252,245,0.9), 0 0 16px rgba(255,250,235,0.6)",
                  fontWeight: isRTL ? 600 : undefined,
                  letterSpacing: isRTL ? "0.5px" : undefined,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: [0, 1, 1, 0.85, 1], y: 0 }}
                transition={{
                  delay: 2,
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
