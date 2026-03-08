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
          primary: "rgba(10, 8, 6, 0.85)",
          secondary: "rgba(30, 25, 20, 0.60)",
          dark: "#0A0806",
        },
        text: {
          primary: "#F5F0E8",
          secondary: "#C8C0B4",
          muted: "#8A8278",
        },
        accent: {
          light: "#DFC89A",
          DEFAULT: "#C4A265",
          dark: "#E8D5A8",
        },
        "damascus-rose": "#E8A099",
        olive: "#A0B08E",
        border: "rgba(196, 162, 101, 0.25)",
      },
      fontFamily: {
        script: ["var(--font-great-vibes)", "cursive"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        arabic: ["var(--font-amiri)", "serif"],
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
