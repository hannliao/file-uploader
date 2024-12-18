/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      colors: {
        'hover-gray': '#ddd',
      },
    },
  },
  plugins: [],
};
