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

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { t, isRTL } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    const difference = new Date(targetDate).getTime() - Date.now();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff > 0) {
        return {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: t.days },
    { value: timeLeft.hours, label: t.hours },
    { value: timeLeft.minutes, label: t.minutes },
    { value: timeLeft.seconds, label: t.seconds },
  ];

  return (
    <div className={`flex justify-center gap-4 sm:gap-6 ${isRTL ? "flex-row-reverse" : ""}`}>
      {units.map((unit, index) => (
        <div key={unit.label} className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center border border-border bg-bg-secondary/50"
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
          <span className={`text-[10px] tracking-[0.2em] uppercase mt-2 block ${isRTL ? "font-arabic text-text-muted" : "font-body text-text-muted"}`}>
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
