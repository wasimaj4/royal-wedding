"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

/* ── Countdown calculator ──────────────────────────────── */
function getCountdown(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* ── Single scratch circle ─────────────────────────────── */
interface ScratchCircleProps {
  size: number;
  label: string;
  value: string;
  onRevealed: () => void;
  index: number;
}

function ScratchCircle({ size, label, value, onRevealed, index }: ScratchCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isDrawing = useRef(false);
  const { isRTL } = useLanguage();

  /* Draw gold metallic gradient */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    const grad = ctx.createConicGradient(0, cx, cy);
    grad.addColorStop(0, "#d4a843");
    grad.addColorStop(0.1, "#f5e6a3");
    grad.addColorStop(0.2, "#c49a3c");
    grad.addColorStop(0.3, "#e8cf7a");
    grad.addColorStop(0.4, "#b8892e");
    grad.addColorStop(0.5, "#f0dfa0");
    grad.addColorStop(0.6, "#c4a040");
    grad.addColorStop(0.7, "#dfc870");
    grad.addColorStop(0.8, "#b08530");
    grad.addColorStop(0.9, "#f0dfa0");
    grad.addColorStop(1, "#d4a843");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    const sheen = ctx.createRadialGradient(cx * 0.7, cy * 0.7, 0, cx, cy, r);
    sheen.addColorStop(0, "rgba(255, 255, 255, 0.25)");
    sheen.addColorStop(0.5, "rgba(255, 255, 255, 0.05)");
    sheen.addColorStop(1, "rgba(0, 0, 0, 0.1)");
    ctx.globalCompositeOperation = "source-atop";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = sheen;
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }, [size]);

  const checkReveal = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    const total = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }

    if (transparent / total > 0.35) {
      setRevealed(true);
      onRevealed();
    }
  }, [revealed, onRevealed]);

  const scratch = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || revealed) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const x = (clientX - rect.left) * dpr;
      const y = (clientY - rect.top) * dpr;
      const brushSize = size * 0.18 * dpr;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    },
    [size, revealed]
  );

  const onMouseDown = (e: React.MouseEvent) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };
  const onMouseUp = () => {
    isDrawing.current = false;
    checkReveal();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = false;
    checkReveal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="scratch-circle-wrapper"
        style={{ width: size, height: size }}
      >
        <div className={`scratch-content ${revealed ? "visible" : ""}`}>
          <span className={`scratch-value ${isRTL ? "font-arabic-label" : "font-serif"}`}>
            {value}
          </span>
          <span className={`scratch-label ${isRTL ? "font-arabic-label" : "font-body"}`}>
            {label}
          </span>
        </div>

        <canvas
          ref={canvasRef}
          className={`scratch-canvas ${revealed ? "revealed" : ""}`}
          style={{ width: size, height: size }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />

        <div className="scratch-ring" />
      </div>
    </motion.div>
  );
}

/* ── Main Scratch Reveal Page ──────────────────────────── */
interface ScratchRevealProps {
  onNavigateNext: () => void;
  onNavigateBack: () => void;
}

export default function ScratchReveal({ onNavigateNext, onNavigateBack }: ScratchRevealProps) {
  const { t, isRTL } = useLanguage();
  const [revealedCount, setRevealedCount] = useState(0);
  const [countdown, setCountdown] = useState(() => getCountdown("2026-05-17T18:00:00"));
  const allRevealed = revealedCount >= 5;

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown("2026-05-17T18:00:00")), 1000);
    return () => clearInterval(timer);
  }, []);

  const circleSize = typeof window !== "undefined" && window.innerWidth < 640 ? 80 : 130;

  const items = [
    { label: isRTL ? "يوم" : "Days", value: String(countdown.days) },
    { label: isRTL ? "ساعة" : "Hours", value: String(countdown.hours) },
    { label: isRTL ? "دقيقة" : "Minutes", value: String(countdown.minutes) },
    { label: isRTL ? "ثانية" : "Seconds", value: String(countdown.seconds) },
    { label: isRTL ? "التاريخ" : "Date", value: t.dateValue },
  ];

  return (
    <div className="h-screen flex flex-col items-center justify-center scratch-page px-6">
      {/* Back arrow — top center */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onNavigateBack}
        className="absolute top-5 left-1/2 -translate-x-1/2 z-10"
        aria-label="Back"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6F5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className={`scratch-title ${isRTL ? "font-arabic-decorative" : "font-script"}`}
      >
        {isRTL ? "يبدأ العدّ التنازلي" : "The Countdown Begins"}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className={`scratch-subtitle ${isRTL ? "font-arabic-label" : "font-body"}`}
      >
        {isRTL
          ? "بقلوب ملؤها الامتنان،\nنتطلّع لمشاركتكم هذا الاتحاد المبارك."
          : "With hearts full of gratitude,\nwe look forward to celebrating this blessed union with you."}
      </motion.p>

      {/* Hand icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="scratch-hand-icon"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-4 0v5" />
          <path d="M14 10V4a2 2 0 0 0-4 0v7" />
          <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.21 0-4.2-.9-5.66-2.34L3.5 16.83a1.73 1.73 0 0 1 .25-2.44 1.76 1.76 0 0 1 2.38.16L8 16.5" />
        </svg>
      </motion.div>

      {/* Instruction text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className={`scratch-instruction ${isRTL ? "font-arabic-decorative" : "font-script"}`}
      >
        {isRTL
          ? "امسح الدوائر الخمس لكشف التفاصيل"
          : "Scratch all 5 circles to reveal the details"}
      </motion.p>

      {/* Scratch circles */}
      <div className="scratch-circles-row">
        {items.map((item, i) => (
          <ScratchCircle
            key={i}
            index={i}
            size={circleSize}
            label={item.label}
            value={item.value}
            onRevealed={() => setRevealedCount((c) => c + 1)}
          />
        ))}
      </div>

      {/* Continue button — appears after all revealed */}
      <AnimatePresence>
        {allRevealed && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={onNavigateNext}
            className="scratch-continue-btn"
          >
            <span className={`${isRTL ? "font-arabic-label font-semibold" : "font-serif font-semibold"}`}>
              {isRTL ? "تفاصيل الحفل وتأكيد الحضور" : "Event Details & RSVP"}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
