/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontSize: {
        "10xl": "15rem",
      },
      colors: {
        "code-green": "#00ff41",
      },
      keyframes: {
        "airpods-connecting": {
          "0%": {
            backgroundColor: "#9d9d9d",
          },
          "38.46%": {
            backgroundColor: "#fff",
          },
          "50%": {
            backgroundColor: "#fff",
          },
          "88.46%": {
            backgroundColor: "#9d9d9d",
          },
          to: {
            backgroundColor: "#9d9d9d",
          },
        },
      },
      animation: {
        "airpods-connecting": "airpods-connecting 1.3s infinite",
      },
    },
  },
  // opening directly on html won't work with url you need a static server to have cross origin
  plugins: [
    "prettier-plugin-tailwindcss",
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities({
        "mask-img": (value) => {
          return {
            "mask-image": `${value}`,
            "-webkit-mask-image": `${value}`,
            "-webkit-mask-size": "100% 100%",
            "mask-size": "100% 100%",
          };
        },
      });
    }),
  ],
};
