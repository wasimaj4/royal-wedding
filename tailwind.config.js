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
        bg: {
          primary: "rgba(253, 250, 245, 0.9)",
          secondary: "rgba(240, 235, 225, 0.7)",
          dark: "#FDFAF5",
        },
        text: {
          primary: "#1A1612",
          secondary: "#4A4540",
          muted: "#8A8278",
        },
        accent: {
          light: "#DFC89A",
          DEFAULT: "#B08D57",
          dark: "#8B6F3A",
        },
        "damascus-rose": "#C4706A",
        olive: "#7A8E68",
        border: "rgba(176, 141, 87, 0.25)",
      },
      fontFamily: {
        script: ["var(--font-great-vibes)", "cursive"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        arabic: ["var(--font-amiri)", "serif"],
        "arabic-label": ["var(--font-cairo)", "sans-serif"],
        "arabic-decorative": ["var(--font-aref-ruqaa)", "serif"],
        body: ["var(--font-cormorant)", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 1.5s ease forwards",
        "slide-up": "slideUp 1s ease forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
