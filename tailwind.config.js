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
        brand: {
          DEFAULT: "#2563eb", // primary blue
          light: "#3b82f6",
          dark: "#1e40af",
        },
        accent: {
          DEFAULT: "#f59e0b", // amber
          light: "#fbbf24",
          dark: "#b45309",
        },
      },
    },
  },
  darkMode: "class", // enable dark mode via class on <html>
  plugins: [require("@tailwindcss/typography")],
};
