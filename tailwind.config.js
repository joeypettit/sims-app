/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "sims-green-50": "#F8FAFA",
        "sims-green-100": "#F2F6F7",
        "sims-green-200": "#DFE7E9",
        "sims-green-300": "#C8D4D8",
        "sims-green-400": "#AEBFC7",
        "sims-green-500": "#90A8B2",
        "sims-green-600": "#6E8D9E",
        "sims-green-700": "#547587",
        "sims-green-800": "#416173",
        "sims-green-900": "#35728A",
      },
    },
  },
  plugins: [],
};
