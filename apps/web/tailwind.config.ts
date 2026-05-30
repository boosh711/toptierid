import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: "#050508",
        surface: {
          DEFAULT: "#12121a",
          elevated: "#1a1b23",
          input: "#1e2030",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        accent: {
          DEFAULT: "#1E6BD6",
          dim: "#1557B0",
          light: "#3D84E8",
        },
        brand: {
          DEFAULT: "#1E6BD6",
          dark: "#1557B0",
          light: "#3D84E8",
        },
        navy: {
          DEFAULT: "#0B1F3A",
          deep: "#06080f",
        },
        muted: "#94A3B8",
        success: "#22C55E",
      },
      fontFamily: {
        display: ["var(--font-russo)", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "profile-gradient": "linear-gradient(180deg, #12121a 0%, #050508 100%)",
        "hero-glow": "radial-gradient(ellipse at top, rgba(30,107,214,0.2) 0%, transparent 60%)",
      },
      boxShadow: {
        brand: "0 0 24px rgba(30, 107, 214, 0.35)",
        "brand-lg": "0 8px 32px rgba(30, 107, 214, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
