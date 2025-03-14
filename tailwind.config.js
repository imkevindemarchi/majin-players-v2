/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#f37c90",
      "primary-transparent": "#f37c903a",
      white: "#ffffff",
      black: "#000000",
      lightgray: "#ececec",
      gray: "#cccccc",
      darkgray: "#4d4d4d",
      darkgray2: "#777777",
      red: "#ff0000",
      green: "#008000",
      orange: "#ffa500",
      "white-transparent": "#ffffff8d",
      "black-transparent": "#0000008d",
    },
    screens: {
      desktop: { min: "1100px" },
      mobile: { max: "800px" },
    },
  },
  plugins: [],
};
