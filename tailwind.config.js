/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "antique-white": "#FAF0E6",
        "parchment": "#F5E6C8",
        "parchment-dark": "#E8D5A8",
        "gold": {
          light: "#D4AF37",
          DEFAULT: "#C5A028",
          dark: "#8B7536",
          metallic: "#CFB53B",
          muted: "#B8960C",
        },
        "candlelight": "#FFD700",
        "warm-glow": "#FFF8DC",
        "deep-brown": "#3E2723",
        "rich-black": "#1A1A1A",
      },
      fontFamily: {
        script: ["Great Vibes", "cursive"],
        serif: ["Playfair Display", "Georgia", "serif"],
        arabic: ["Amiri", "serif"],
        "arabic-decorative": ["Aref Ruqaa", "serif"],
        body: ["Cormorant Garamond", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 2s ease-in-out forwards",
        "fade-in-slow": "fadeIn 3s ease-in-out forwards",
        "fade-in-up": "fadeInUp 2s ease-out forwards",
        "gentle-zoom": "gentleZoom 20s ease-in-out infinite alternate",
        "candle-flicker": "candleFlicker 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "seal-break": "sealBreak 1.5s ease-in-out forwards",
        "envelope-open": "envelopeOpen 2s ease-in-out forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gentleZoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        candleFlicker: {
          "0%, 100%": { opacity: "1", transform: "scaleY(1)" },
          "25%": { opacity: "0.8", transform: "scaleY(0.95)" },
          "50%": { opacity: "1", transform: "scaleY(1.02)" },
          "75%": { opacity: "0.9", transform: "scaleY(0.98)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6", filter: "blur(20px)" },
          "50%": { opacity: "1", filter: "blur(30px)" },
        },
        sealBreak: {
          "0%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
          "50%": { transform: "scale(1.2) rotate(10deg)", opacity: "0.8" },
          "100%": { transform: "scale(0) rotate(45deg)", opacity: "0" },
        },
        envelopeOpen: {
          "0%": { transform: "rotateX(0deg)" },
          "100%": { transform: "rotateX(-180deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F5E6A8 50%, #D4AF37 100%)",
        "gold-shimmer": "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
      },
    },
  },
  plugins: [],
};
