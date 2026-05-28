import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1E6BD6",
          dark: "#1557B0",
          light: "#3D84E8",
        },
        navy: "#0B1F3A",
      },
      fontFamily: {
        display: ["var(--font-russo)", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
