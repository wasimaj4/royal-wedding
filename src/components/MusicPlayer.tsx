"use client";

import { useState, useEffect, useCallback, type RefObject } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const VOLUME = 0.02;
const PLAYBACK_RATE = 0.70;

interface MusicPlayerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
}

export default function MusicPlayer({ audioRef }: MusicPlayerProps) {
  const { t, isRTL } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  /* Sync state with the audio element that page.tsx already started */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(!audio.paused);

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [audioRef]);

  /* Pause when tab/browser goes to background, resume when visible.
     Mobile Safari doesn't reliably fire "visibilitychange" when the user
     switches apps or locks the screen, so we also listen to pagehide/
     pageshow (Safari-preferred) and window blur/focus as a fallback. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let wasPlayingBeforeHidden = false;

    const pause = () => {
      if (!audio.paused) {
        wasPlayingBeforeHidden = true;
        audio.pause();
      }
    };

    const resume = () => {
      if (wasPlayingBeforeHidden) {
        wasPlayingBeforeHidden = false;
        audio.play().catch(() => {});
      }
    };

    // Desktop & Android Chrome
    const handleVisibility = () => {
      if (document.hidden) pause();
      else resume();
    };

    // iOS Safari fires these more reliably when switching apps / locking
    const handlePageHide = () => pause();
    const handlePageShow = () => resume();

    // Extra fallback: window blur/focus (covers some PWA & in-app browsers)
    const handleBlur = () => pause();
    const handleFocus = () => resume();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [audioRef]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.volume = VOLUME;
      audio.playbackRate = PLAYBACK_RATE;
      audio.play().catch(() => {});
    }
  }, [isPlaying, audioRef]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className={`fixed bottom-6 z-50 ${isRTL ? "left-6" : "right-6"}`}
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
