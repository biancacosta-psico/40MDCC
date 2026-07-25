import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: "#48501F",
        "olive-dark": "#343A16",
        terracota: "#A8552E",
        bege: "#E4D3B8",
        offwhite: "#FAF3E7",
        bronze: "#A8823F",
        ink: "#2B2318",
        "ink-soft": "#7A715E",
        line: "#D9C8AB",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-karla)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
