"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const TARGET_VOLUME = 0.75;
const FADE_IN_MS = 2000;
const FADE_IN_TOGGLE_MS = 1200;

function fadeAudioIn(audio: HTMLAudioElement, duration: number, target: number) {
  audio.volume = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    try { audio.volume = progress * target; } catch { /* disposed */ }
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export default function MusicPlayer() {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio("/audio/bridal-chorus-hq.mp3");
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    startedRef.current = true;

    const play = () => {
      audio.play()
        .then(() => { setIsPlaying(true); fadeAudioIn(audio, FADE_IN_MS, TARGET_VOLUME); })
        .catch(() => {
          const handler = () => {
            audio.play()
              .then(() => { setIsPlaying(true); fadeAudioIn(audio, FADE_IN_MS, TARGET_VOLUME); })
              .catch(() => {});
            document.removeEventListener("click", handler);
            document.removeEventListener("touchstart", handler);
          };
          document.addEventListener("click", handler);
          document.addEventListener("touchstart", handler);
        });
    };

    const id = setTimeout(play, 600);
    return () => clearTimeout(id);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        fadeAudioIn(audio, FADE_IN_TOGGLE_MS, TARGET_VOLUME);
      }).catch(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <button
        onClick={togglePlay}
        className={`music-btn ${isPlaying ? "playing" : ""}`}
        aria-label={isPlaying ? t.pauseMusic : t.playMusic}
      >
        {isPlaying ? (
          <div className="sound-bars">
            <div className="sound-bar" />
            <div className="sound-bar" />
            <div className="sound-bar" />
            <div className="sound-bar" />
          </div>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-accent"
          >
            <path
              d="M9 18V5l12-2v13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}
      </button>
    </motion.div>
  );
}
