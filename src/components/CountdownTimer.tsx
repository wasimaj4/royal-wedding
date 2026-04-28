"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTargetTime(targetDate: string): number {
  const parsed = Date.parse(targetDate);
  if (!Number.isNaN(parsed)) return parsed;

  const match = targetDate.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  if (!match) return NaN;

  const [, y, m, d, h, min, s] = match;
  return new Date(
    Number(y),
    Number(m) - 1,
    Number(d),
    Number(h),
    Number(min),
    Number(s ?? "0")
  ).getTime();
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const targetTime = getTargetTime(targetDate);
  if (Number.isNaN(targetTime)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = targetTime - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { t, isRTL } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    let timeoutId: number | null = null;

    const tick = () => {
      setTimeLeft(calculateTimeLeft(targetDate));
      timeoutId = window.setTimeout(tick, 1000);
    };

    const refreshNow = () => setTimeLeft(calculateTimeLeft(targetDate));

    refreshNow();
    timeoutId = window.setTimeout(tick, 1000);

    document.addEventListener("visibilitychange", refreshNow);
    window.addEventListener("pageshow", refreshNow);
    window.addEventListener("focus", refreshNow);

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", refreshNow);
      window.removeEventListener("pageshow", refreshNow);
      window.removeEventListener("focus", refreshNow);
    };
  }, [targetDate]);

  const units = [
    { id: "days", value: timeLeft.days, label: t.days },
    { id: "hours", value: timeLeft.hours, label: t.hours },
    { id: "minutes", value: timeLeft.minutes, label: t.minutes },
    { id: "seconds", value: timeLeft.seconds, label: t.seconds },
  ];

  return (
    <div className={`flex justify-center gap-3 sm:gap-5 ${isRTL ? "flex-row-reverse" : ""}`}>
      {units.map((unit, index) => (
        <div key={unit.id} className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className="w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center border border-border/60 bg-white/40 backdrop-blur-sm"
          >
            <motion.span
              key={unit.value}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-2xl sm:text-3xl font-serif text-text-primary"
              suppressHydrationWarning
            >
              {String(unit.value).padStart(2, "0")}
            </motion.span>
          </motion.div>
          <span
            className={`text-[10px] tracking-[0.2em] uppercase mt-2 block ${isRTL ? "font-arabic-label text-text-muted" : "font-body text-text-muted"}`}
          >
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
