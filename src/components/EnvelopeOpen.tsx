"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

/* ═══════════════════════════════════════════════════════════
   CINEMATIC ENVELOPE OPENING — Premium Wedding Experience
   
   Animation Timeline (total ~3.2s):
   ─────────────────────────────────────────────────────────
   IDLE STATE:
     • Pristine white envelope with layered depth
     • Deep antique gold wax seal (88px), embossed 3D
     • Soft pulsing glow + paper shadow = tactile realism
     • "Tap to open" hint appears after 2s delay
   
   ON CLICK:
     Step 1 — Press Feedback (0–100ms)
       • Seal scales to 0.93 (micro-press)
       • Envelope shadow compresses slightly
   
     Step 2 — Anticipation Pause (100–400ms)
       • Brief stillness — builds emotional tension
       • Seal holds pressed state, subtle shadow shift
   
     Step 3 — Seal Break (400–900ms)
       • Seal splits in two halves with rotation
       • Golden dust particles scatter outward
       • Faint crack-line flash down the center
   
     Step 4 — Flap Opens (700–1900ms)
       • Top flap rotates upward (3D, transform-origin: top)
       • Dynamic fold-shadow darkens then lightens
       • Inner card edge becomes visible beneath
       • Easing: cubic-bezier(0.32, 0, 0.15, 1)
   
     Step 5 — Depth Separation (1400–2200ms)
       • Front envelope face shifts down 12px
       • Inner card lifts up slightly (parallax)
       • Shadow expands underneath
   
     Step 6 — Content Reveal (2000–3200ms)
       • Envelope dissolves outward from center
       • Soft light bloom radiates
       • Parent callback fires → hero fades in
   ═══════════════════════════════════════════════════════════ */

/* ── Seal size constant (used for both idle & break halves) ── */
const SEAL = 88;
const HALF = SEAL / 2;

/* ── Seal gradient (single source of truth) ── */
const SEAL_BG = `radial-gradient(circle at 36% 32%,
  #D4BA82 0%, #C4A265 20%, #A8884A 45%,
  #8B6F3A 70%, #6E5728 90%, #5C4A22 100%
)`;

interface EnvelopeOpenProps {
  onOpen: () => void;
}

export default function EnvelopeOpen({ onOpen }: EnvelopeOpenProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<
    "idle" | "pressed" | "breaking" | "opening" | "revealing" | "done"
  >("idle");

  /* ── Pre-compute particle positions to avoid re-render randomness ── */
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        angle: (i / 10) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
        dist: 35 + Math.random() * 30,
        size: 2.5 + Math.random() * 3,
        r: 170 + Math.floor(Math.random() * 50),
        g: 135 + Math.floor(Math.random() * 40),
        b: 50 + Math.floor(Math.random() * 50),
      })),
    []
  );

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;

    /* Step 1 — Press feedback */
    setPhase("pressed");

    /* Step 2 — Anticipation pause (300ms hold) */
    setTimeout(() => {
      /* Step 3 — Seal breaks */
      setPhase("breaking");
    }, 350);

    /* Step 4+5 — Flap opens & depth separation */
    setTimeout(() => {
      setPhase("opening");
    }, 800);

    /* Step 6 — Content reveal & dissolve */
    setTimeout(() => {
      setPhase("revealing");
    }, 2200);

    /* Done → notify parent */
    setTimeout(() => {
      setPhase("done");
      setTimeout(onOpen, 250);
    }, 3200);
  }, [phase, onOpen]);

  const isAnimating = phase !== "idle" && phase !== "done";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-wrapper"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: `
              radial-gradient(ellipse at 50% 38%,
                rgba(255,255,255,0.97) 0%,
                rgba(253,250,245,0.98) 40%,
                rgba(248,244,236,1) 70%,
                rgba(242,237,228,1) 100%
              )
            `,
          }}
        >
          {/* ── Paper grain texture (very subtle) ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />

          {/* ── Ambient vignette (top/bottom depth) ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom,
                rgba(0,0,0,0.025) 0%, transparent 12%,
                transparent 88%, rgba(0,0,0,0.035) 100%
              )`,
            }}
          />

          {/* ── Ambient light shift during open (subtle warm glow) ── */}
          {isAnimating && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0.15, 0] }}
              transition={{
                duration: 3.0,
                times: [0, 0.35, 0.7, 1],
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(ellipse at 50% 45%, rgba(220,195,140,0.12) 0%, transparent 60%)",
              }}
            />
          )}

          {/* ════════════════════════════════════════════════
              ENVELOPE CONTAINER  
              ════════════════════════════════════════════════ */}
          <motion.div
            className="relative cursor-pointer select-none"
            onClick={handleClick}
            /* Step 5+6: envelope body shifts down and dissolves */
            animate={
              phase === "revealing"
                ? { y: 100, opacity: 0, scale: 0.97 }
                : phase === "pressed"
                  ? { scale: 0.985 }
                  : { scale: 1 }
            }
            transition={
              phase === "revealing"
                ? { duration: 1.0, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.15, ease: "easeOut" }
            }
          >
            {/* ── Drop shadow under entire envelope (depth layer) ── */}
            <motion.div
              className="absolute -bottom-3 left-4 right-4 h-8 pointer-events-none rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, transparent 70%)",
                filter: "blur(6px)",
              }}
              animate={
                phase === "opening" || phase === "revealing"
                  ? { scaleX: 1.06, scaleY: 1.3, opacity: 0.6, y: 6 }
                  : phase === "pressed"
                    ? { scaleX: 0.98, scaleY: 0.9 }
                    : {}
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* ── Envelope Depth Stack ── */}
            <div
              className="relative"
              style={{ perspective: "900px", perspectiveOrigin: "50% 30%" }}
            >
              {/* ── LAYER 0: Inner card (revealed behind flap) ── */}
              <motion.div
                className="absolute top-2 left-3 right-3 bottom-3 rounded-[3px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(170deg, #FFFEF9 0%, #FBF8F1 50%, #F5F0E7 100%)",
                  border: "1px solid rgba(176,141,87,0.08)",
                  zIndex: 0,
                }}
                animate={
                  phase === "opening" || phase === "revealing"
                    ? { y: -8, opacity: 1 }
                    : { y: 0, opacity: 0 }
                }
                transition={{ duration: 1.0, delay: 0.3, ease: [0.32, 0, 0.15, 1] }}
              >
                {/* Elegant inner border on the card */}
                <div
                  className="absolute inset-3 border border-dashed pointer-events-none"
                  style={{ borderColor: "rgba(176,141,87,0.1)" }}
                />
              </motion.div>

              {/* ── LAYER 1: Main envelope front face ── */}
              <motion.div
                className="relative w-[320px] h-[220px] sm:w-[400px] sm:h-[270px] md:w-[450px] md:h-[310px]"
                style={{
                  background: `linear-gradient(178deg,
                    #FFFFFF 0%, #FEFDFB 25%, #FBF8F3 50%,
                    #F7F3EB 75%, #F3EFE5 100%
                  )`,
                  borderRadius: "4px",
                  boxShadow: `
                    0 1px 4px rgba(0,0,0,0.03),
                    0 4px 16px rgba(0,0,0,0.05),
                    0 12px 40px rgba(0,0,0,0.04),
                    inset 0 1px 0 rgba(255,255,255,0.9),
                    inset 0 -1px 0 rgba(0,0,0,0.02)
                  `,
                  zIndex: 2,
                }}
                /* Step 5: front face slides down for paper separation */
                animate={
                  phase === "opening" || phase === "revealing"
                    ? { y: 10 }
                    : {}
                }
                transition={{ duration: 1.2, delay: 0.4, ease: [0.32, 0, 0.15, 1] }}
              >
                {/* Thin gold inner border frame */}
                <div
                  className="absolute inset-[9px] sm:inset-[12px] rounded-[2px] pointer-events-none"
                  style={{
                    border: "1px solid rgba(176, 141, 87, 0.1)",
                  }}
                />

                {/* Paper fiber texture overlay */}
                <div
                  className="absolute inset-0 rounded-[4px] pointer-events-none opacity-[0.02]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence baseFrequency='0.55' numOctaves='4' type='fractalNoise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Bottom edge shadow (gives thickness) */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[3px] pointer-events-none rounded-b"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgba(0,0,0,0.03))",
                  }}
                />
              </motion.div>

              {/* ── LAYER 2: Top Flap (Triangular) ── */}
              <motion.div
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  zIndex: 12,
                }}
                /* Step 4: flap opens upward with realistic easing */
                animate={
                  phase === "opening" || phase === "revealing"
                    ? { rotateX: -178 }
                    : phase === "breaking"
                      ? { rotateX: -3 } /* Tiny lift — flap starts to loosen */
                      : {}
                }
                transition={
                  phase === "opening" || phase === "revealing"
                    ? {
                        duration: 1.2,
                        ease: [0.32, 0, 0.15, 1], /* slow start, smooth decel */
                      }
                    : { duration: 0.4, ease: "easeOut" }
                }
              >
                <svg
                  viewBox="0 0 450 165"
                  className="w-[320px] sm:w-[400px] md:w-[450px]"
                  style={{ display: "block" }}
                >
                  <defs>
                    <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FEFDFB" />
                      <stop offset="50%" stopColor="#F9F6F0" />
                      <stop offset="100%" stopColor="#F2EDE4" />
                    </linearGradient>
                    <linearGradient id="flapShadow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="40%" stopColor="transparent" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="0,0 450,0 225,155"
                    fill="url(#flapGrad)"
                    stroke="rgba(200,190,175,0.2)"
                    strokeWidth="0.5"
                  />
                  <polygon
                    points="0,0 450,0 225,155"
                    fill="url(#flapShadow)"
                  />
                  <line
                    x1="0" y1="0.5" x2="450" y2="0.5"
                    stroke="rgba(176,141,87,0.08)"
                    strokeWidth="1"
                  />
                </svg>
              </motion.div>

              {/* ── Dynamic fold shadow (appears under flap as it opens) ── */}
              <motion.div
                className="absolute top-0 left-[5%] right-[5%] h-6 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.06), transparent)",
                  borderRadius: "0 0 50% 50%",
                  zIndex: 3,
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={
                  phase === "opening" || phase === "revealing"
                    ? { opacity: [0, 0.8, 0.3], scaleY: [0, 1.2, 0.6] }
                    : {}
                }
                transition={{ duration: 1.4, ease: "easeOut" }}
              />

              {/* ── Side flaps (left & right, behind main body) ── */}
              <div
                className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
                style={{ zIndex: 1 }}
              >
                {/* Left side flap */}
                <svg
                  viewBox="0 0 120 310"
                  className="absolute top-0 left-0 h-[220px] sm:h-[270px] md:h-[310px] w-auto"
                  style={{ transform: "translateX(-1px)" }}
                >
                  <polygon
                    points="0,0 120,155 0,310"
                    fill="#F5F1EA"
                    stroke="rgba(200,190,175,0.12)"
                    strokeWidth="0.5"
                  />
                </svg>
                {/* Right side flap */}
                <svg
                  viewBox="0 0 120 310"
                  className="absolute top-0 right-0 h-[220px] sm:h-[270px] md:h-[310px] w-auto"
                  style={{ transform: "translateX(1px)" }}
                >
                  <polygon
                    points="120,0 0,155 120,310"
                    fill="#F5F1EA"
                    stroke="rgba(200,190,175,0.12)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>

              {/* ── Bottom flap (behind body) ── */}
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ zIndex: -1 }}
              >
                <svg
                  viewBox="0 0 450 110"
                  className="w-[320px] sm:w-[400px] md:w-[450px]"
                  style={{ display: "block", transform: "translateY(1px)" }}
                >
                  <polygon
                    points="0,110 450,110 225,12"
                    fill="#F4F0E9"
                    stroke="rgba(200,190,175,0.12)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>

            {/* ════════════════════════════════════════════════
                WAX SEAL — Premium interaction element
                Deep antique gold, 88px, embossed 3D
               ════════════════════════════════════════════════ */}
            <AnimatePresence>
              {(phase === "idle" || phase === "pressed") && (
                <>
                  {/* Outer ambient glow (soft pulsing) */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                    animate={
                      phase === "idle"
                        ? {
                            boxShadow: [
                              `0 0 18px 5px rgba(176,141,87,0.12)`,
                              `0 0 30px 10px rgba(176,141,87,0.22)`,
                              `0 0 18px 5px rgba(176,141,87,0.12)`,
                            ],
                          }
                        : {
                            boxShadow: `0 0 12px 3px rgba(176,141,87,0.08)`,
                          }
                    }
                    transition={
                      phase === "idle"
                        ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.1 }
                    }
                    style={{
                      width: SEAL,
                      height: SEAL,
                      borderRadius: "50%",
                    }}
                  />

                  {/* Seal disc — deep antique gold with strong emboss */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
                    style={{
                      width: SEAL,
                      height: SEAL,
                      borderRadius: "50%",
                      background: SEAL_BG,
                      boxShadow: `
                        0 4px 14px rgba(0,0,0,0.25),
                        0 1px 4px rgba(0,0,0,0.18),
                        0 8px 20px rgba(90,70,30,0.12),
                        inset 0 2px 5px rgba(255,245,220,0.35),
                        inset 0 -3px 8px rgba(0,0,0,0.2),
                        inset 2px 0 4px rgba(0,0,0,0.06),
                        inset -2px 0 4px rgba(0,0,0,0.06)
                      `,
                    }}
                    /* Micro-press on tap: scale to 0.93 */
                    animate={phase === "pressed" ? { scale: 0.93 } : { scale: 1 }}
                    whileHover={phase === "idle" ? { scale: 1.05 } : {}}
                    whileTap={phase === "idle" ? { scale: 0.93 } : {}}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {/* Embossed outer ring */}
                    <div
                      className="absolute inset-[6px] rounded-full pointer-events-none"
                      style={{
                        border: "1.5px solid rgba(255,240,200,0.22)",
                        boxShadow: `
                          inset 0 1px 3px rgba(0,0,0,0.12),
                          0 1px 1px rgba(255,240,200,0.1)
                        `,
                      }}
                    />

                    {/* Inner decorative ring */}
                    <div
                      className="absolute inset-[11px] rounded-full pointer-events-none"
                      style={{
                        border: "0.75px solid rgba(255,240,200,0.14)",
                        boxShadow: "inset 0 0.5px 1px rgba(0,0,0,0.06)",
                      }}
                    />

                    {/* Top-left specular highlight */}
                    <div
                      className="absolute top-[7px] left-[14px] w-[22px] h-[12px] rounded-full pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(140deg, rgba(255,250,230,0.4) 0%, transparent 100%)",
                        filter: "blur(2.5px)",
                      }}
                    />

                    {/* Secondary highlight (smaller, lower) */}
                    <div
                      className="absolute bottom-[14px] right-[10px] w-[10px] h-[6px] rounded-full pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(320deg, rgba(255,250,230,0.15) 0%, transparent 100%)",
                        filter: "blur(2px)",
                      }}
                    />

                    {/* W R monogram — embossed text */}
                    <span
                      className="font-serif select-none pointer-events-none"
                      style={{
                        fontSize: "15px",
                        color: "rgba(255,250,235,0.9)",
                        textShadow: `
                          0 1.5px 2px rgba(0,0,0,0.25),
                          0 -1px 1px rgba(255,245,220,0.2),
                          0 0 8px rgba(220,195,140,0.15)
                        `,
                        fontWeight: 700,
                        letterSpacing: "0.4em",
                        paddingLeft: "0.4em",
                      }}
                    >
                      W R
                    </span>
                  </motion.div>
                </>
              )}

              {/* ── Step 3: Seal Break ── */}
              {(phase === "breaking" || phase === "opening" || phase === "revealing") && (
                <>
                  {/* Center crack flash */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 z-22 pointer-events-none"
                    style={{
                      width: 2,
                      height: SEAL - 16,
                      marginLeft: -1,
                      marginTop: -(SEAL - 16) / 2,
                      background: "linear-gradient(to bottom, transparent, rgba(220,195,140,0.6), transparent)",
                      borderRadius: 1,
                    }}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />

                  {/* Left half — falls left with rotation */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 z-20 overflow-hidden"
                    style={{
                      width: HALF,
                      height: SEAL,
                      marginLeft: -HALF,
                      marginTop: -HALF,
                      borderRadius: `${HALF}px 0 0 ${HALF}px`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                    animate={{ x: -28, y: 18, opacity: 0, rotate: -20 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.4, 0, 0.6, 1],
                    }}
                  >
                    <div
                      style={{
                        width: SEAL,
                        height: SEAL,
                        borderRadius: "50%",
                        background: SEAL_BG,
                        boxShadow:
                          "0 4px 14px rgba(0,0,0,0.25), inset 0 2px 5px rgba(255,245,220,0.35)",
                      }}
                    />
                  </motion.div>

                  {/* Right half — falls right with rotation */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 z-20 overflow-hidden"
                    style={{
                      width: HALF,
                      height: SEAL,
                      marginTop: -HALF,
                      borderRadius: `0 ${HALF}px ${HALF}px 0`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                    animate={{ x: 28, y: 18, opacity: 0, rotate: 20 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.4, 0, 0.6, 1],
                    }}
                  >
                    <div
                      style={{
                        width: SEAL,
                        height: SEAL,
                        marginLeft: -HALF,
                        borderRadius: "50%",
                        background: SEAL_BG,
                        boxShadow:
                          "0 4px 14px rgba(0,0,0,0.25), inset 0 2px 5px rgba(255,245,220,0.35)",
                      }}
                    />
                  </motion.div>

                  {/* Golden dust particles */}
                  {particles.map((p, i) => (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 top-1/2 z-21 rounded-full"
                      style={{
                        width: p.size,
                        height: p.size,
                        background: `rgba(${p.r}, ${p.g}, ${p.b}, 0.75)`,
                        marginLeft: -p.size / 2,
                        marginTop: -p.size / 2,
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos(p.angle) * p.dist,
                        y: Math.sin(p.angle) * p.dist + 15,
                        opacity: 0,
                        scale: 0.2,
                      }}
                      transition={{
                        duration: 0.7,
                        delay: 0.05 + i * 0.02,
                        ease: [0.2, 0, 0.6, 1],
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* ── "Tap to open" hint ── */}
            {phase === "idle" && (
              <motion.p
                className="absolute -bottom-11 sm:-bottom-14 left-0 right-0 text-center text-[11px] sm:text-xs tracking-[0.3em] uppercase font-body"
                style={{ color: "var(--text-muted)" }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: [0, 0.7], y: 0 }}
                transition={{ delay: 2.0, duration: 1.4, ease: "easeOut" }}
              >
                {t.tapToOpen}
              </motion.p>
            )}
          </motion.div>

          {/* ── Step 6: Light bloom on reveal ── */}
          {(phase === "opening" || phase === "revealing") && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.55, 0] }}
              transition={{
                duration: 2.4,
                times: [0, 0.4, 0.7, 1],
                ease: "easeOut",
              }}
              style={{
                background:
                  "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
