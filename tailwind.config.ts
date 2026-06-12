import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#f8f9ff",
        "surface": "#f8f9ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "surface-container-low": "#eff4ff",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#474651",
        "outline": "#777682",
        "outline-variant": "#c8c5d3",
        "primary": "#1a146b",
        "on-primary": "#ffffff",
        "primary-container": "#312e81",
        "secondary": "#4648d4",
        "secondary-container": "#6063ee",
        "on-secondary-container": "#fffbff",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        gutter: "1.5rem",
        margin: "2rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;