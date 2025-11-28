/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        day: {
          bg: "#ffffff",
          accent: "#1e3a8a",
          secondary: "#f1f5f9",
          text: "#1e293b",
          muted: "#64748b",
        },
        night: {
          bg: "#0B0A0F",
          accent: "#22c55e",
          secondary: "#1a1a24",
          text: "#f8fafc",
          muted: "#94a3b8",
        },
      },
      fontFamily: {
        inter: ["Inter"],
        mono: ["SpaceMono"],
      },
    },
  },
  plugins: [],
};
