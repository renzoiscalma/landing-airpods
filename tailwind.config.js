/** @type {import('tailwindcss').Config} */
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
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
};
