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
    // Calculate immediately to avoid flash of "--"
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
    const calculateTimeLeft = () => {
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
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: t.days },
    { value: timeLeft.hours, label: t.hours },
    { value: timeLeft.minutes, label: t.minutes },
    { value: timeLeft.seconds, label: t.seconds },
  ];

  return (
    <div className={`flex justify-center gap-4 sm:gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
      {units.map((unit, index) => (
        <div key={unit.label} className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center border border-gold/30 bg-parchment-dark/20 relative overflow-hidden"
          >
            {/* Subtle shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
            <motion.span
              key={unit.value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl sm:text-3xl font-serif text-gold-dark relative z-10"
              suppressHydrationWarning
            >
              {String(unit.value).padStart(2, "0")}
            </motion.span>
          </motion.div>
          <span className={`text-xs tracking-[0.2em] uppercase text-gold-dark/50 mt-2 block ${isRTL ? "font-arabic" : "font-body"}`}>
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
