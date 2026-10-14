import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        teal: {
          900: "var(--teal-900)",
          700: "var(--teal-700)",
          600: "var(--teal-600)",
          400: "var(--teal-400)",
          100: "var(--teal-100)",
        },
        red: {
          600: "var(--red-600)",
        },
      },
      fontFamily: {
        display: "var(--font-display)",
        text: "var(--font-text)",
      },
      fontSize: {
        small: "var(--step-small)",
        body: "var(--step-body)",
        lead: "var(--step-lead)",
        head: "var(--step-head)",
        display: "var(--step-display)",
      },
      spacing: {
        margin: "var(--margin)",
        gutter: "var(--gutter)",
        section: "var(--section)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
        soft: "var(--ease-soft)",
      },
    },
  },
  plugins: [],
};

export default config;
