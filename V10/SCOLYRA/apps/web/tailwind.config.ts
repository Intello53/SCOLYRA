import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0F0D18",
          900: "#14121F",
          800: "#211D33",
          700: "#332C4D",
        },
        paper: "#FAFAFC",
        primary: {
          50: "#F1EEFE",
          100: "#E1DBFD",
          200: "#C3B8FB",
          300: "#9F8CF7",
          400: "#7C64F2",
          500: "#5B3DF5",
          600: "#4A2DE0",
          700: "#3B22B8",
          800: "#2E1B8F",
          900: "#221468",
        },
        gold: {
          50: "#FBF3E6",
          100: "#F5E2C0",
          200: "#EFCE93",
          300: "#E7B665",
          400: "#DE9F42",
          500: "#C98A2E",
          600: "#A86F22",
          700: "#87581B",
        },
        mastery: {
          50: "#E7F7F1",
          200: "#A9E4CC",
          500: "#1E9E70",
          700: "#147A56",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 13, 24, 0.04), 0 8px 24px -12px rgba(15, 13, 24, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
