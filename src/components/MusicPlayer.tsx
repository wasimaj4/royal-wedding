"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function MusicPlayer() {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    let handler: (() => void) | null = null;

    // Try immediate autoplay
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay blocked — play on first user interaction
        handler = () => {
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
          document.removeEventListener("click", handler!);
          document.removeEventListener("touchstart", handler!);
        };
        document.addEventListener("click", handler);
        document.addEventListener("touchstart", handler);
      });

    return () => {
      audio.pause();
      audioRef.current = null;
      if (handler) {
        document.removeEventListener("click", handler);
        document.removeEventListener("touchstart", handler);
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Play/Pause Button */}
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
