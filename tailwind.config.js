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
          primary: "#FDFBF7",
          secondary: "#F5F0E8",
          dark: "#1A1A1A",
        },
        text: {
          primary: "#2A2A2A",
          secondary: "#6B6B6B",
          muted: "#9A9A9A",
        },
        accent: {
          light: "#DFC89A",
          DEFAULT: "#C4A265",
          dark: "#8B7235",
        },
        "damascus-rose": "#C17C74",
        olive: "#7C8C6E",
        border: "#E8E0D4",
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
