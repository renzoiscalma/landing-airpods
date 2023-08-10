/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontSize: {
        "10xl": "15rem",
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
};
