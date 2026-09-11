import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0B0F",
          soft: "#1C1C22",
        },
        paper: {
          DEFAULT: "#F6F3EE",
          2: "#EDE8E0",
        },
        saffron: {
          DEFAULT: "#E8862A",
          light: "#F5B56A",
          dark: "#B8611A",
        },
        breaking: "#C8102E",
        rule: "#D8D2C8",
        muted: "#6B6B75",
      },
      fontFamily: {
        serif: [
          "var(--font-serif)",
          "var(--font-hindi-serif)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "var(--font-hindi-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        "hindi-serif": ["var(--font-hindi-serif)", "var(--font-serif)", "serif"],
        "hindi-sans": ["var(--font-hindi-sans)", "var(--font-sans)", "sans-serif"],
      },
      fontSize: {
        display: [
          "clamp(2.75rem, 6vw, 6.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h1: [
          "clamp(2rem, 4vw, 3.75rem)",
          { lineHeight: "1.05", letterSpacing: "-0.015em", fontWeight: "700" },
        ],
        h2: [
          "clamp(1.5rem, 2.5vw, 2.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h3: ["1.35rem", { lineHeight: "1.2", fontWeight: "600" }],
        kicker: [
          "0.75rem",
          { lineHeight: "1", letterSpacing: "0.18em", fontWeight: "600" },
        ],
      },
      maxWidth: {
        editorial: "1320px",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(6px)" },
        },
        "scroll-line": {
          "0%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
        "scroll-line": "scroll-line 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        wave: "wave 1.1s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
