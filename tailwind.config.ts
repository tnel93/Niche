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
        cream: { DEFAULT: "#FFFBF7", alt: "#FFF5EC", warm: "#FEF0E4" },
        espresso: { DEFAULT: "#2D2016", soft: "#6B5B4E", muted: "#A89888" },
        terra: {
          DEFAULT: "#E8734A",
          hover: "#D4623B",
          pressed: "#C05530",
          soft: "rgba(232,115,74,0.10)",
          glow: "rgba(232,115,74,0.20)",
        },
        verified: { DEFAULT: "#4CAF6E", soft: "rgba(76,175,110,0.12)" },
        danger: { DEFAULT: "#E05252", soft: "rgba(224,82,82,0.10)" },
        gold: { DEFAULT: "#D4A24C", soft: "rgba(212,162,76,0.12)" },
        iris: { DEFAULT: "#8B6CC1", soft: "rgba(139,108,193,0.10)" },
        mint: { DEFAULT: "#3DAFA5", soft: "rgba(61,175,165,0.10)" },
        dark: "#1A1410",
      },
      fontFamily: {
        brand: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "Helvetica Neue", "sans-serif"],
        mono: ["var(--font-jetbrains)", "Fira Code", "monospace"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "1.5" }],
        sm: ["12px", { lineHeight: "1.5" }],
        base: ["14px", { lineHeight: "1.5" }],
        md: ["15px", { lineHeight: "1.65" }],
        lg: ["17px", { lineHeight: "1.4" }],
        xl: ["20px", { lineHeight: "1.35" }],
        "2xl": ["24px", { lineHeight: "1.3" }],
        "3xl": ["32px", { lineHeight: "1.2" }],
        "4xl": ["40px", { lineHeight: "1.1" }],
        "5xl": ["52px", { lineHeight: "1.1" }],
        hero: ["clamp(36px,5vw,56px)", { lineHeight: "1.1" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
        pill: "100px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(45,32,22,0.04)",
        md: "0 4px 12px rgba(45,32,22,0.06)",
        lg: "0 8px 24px rgba(45,32,22,0.08)",
        xl: "0 12px 40px rgba(45,32,22,0.12)",
        glow: "0 4px 16px rgba(232,115,74,0.25)",
        card: "0 2px 12px rgba(45,32,22,0.04)",
        "card-hover": "0 12px 40px rgba(232,115,74,0.10)",
        modal: "0 24px 64px rgba(45,32,22,0.20)",
        inner: "inset 0 1px 3px rgba(45,32,22,0.06)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
      letterSpacing: {
        caps: "0.10em",
        widest: "0.12em",
      },
    },
  },
  plugins: [],
};

export default config;
