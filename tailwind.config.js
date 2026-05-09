/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        secondary: "#d9f3f0",
        accent: "#7dd3c7",
        dark: "#0f172a",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        heading: ["Sora", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(31, 38, 135, 0.12)",
      },
    },
  },
  plugins: [],
}