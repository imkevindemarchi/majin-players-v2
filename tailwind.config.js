/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#f37c90",
      "primary-transparent": "#f37c903a",
      white: "#ffffff",
      black: "#000000",
    },
    screens: {
      desktop: { min: "1100px" },
      mobile: { max: "800px" },
    },
  },
  plugins: [],
};
