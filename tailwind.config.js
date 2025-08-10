// tailwind.config.js
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          ...colors.blue, // full blue scale (50–900)
          DEFAULT: "#2563eb", // brand blue
          light: "#3b82f6",
          dark: "#1e40af",
        },
        secondary: {
          ...colors.amber, // full amber scale (50–900)
          DEFAULT: "#f59e0b", // accent amber
          light: "#fbbf24",
          dark: "#b45309",
        },
        brand: {
          ...colors.blue,
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1e40af",
        },
        accent: {
          ...colors.amber,
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#b45309",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography")],
};
