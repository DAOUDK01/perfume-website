import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        black: "#000000",
        white: "#ffffff",
        gray: {
          50: "#f9f9f9",
          100: "#f3f3f3",
          200: "#e8e8e8",
          300: "#dcdcdc",
          400: "#999999",
          500: "#666666",
          600: "#444444",
          700: "#222222",
        },
      },
      letterSpacing: {
        normal: "0em",
        wide: "0.05em",
        widest: "0.1em",
      },
    },
  },
  plugins: [],
};
export default config;
