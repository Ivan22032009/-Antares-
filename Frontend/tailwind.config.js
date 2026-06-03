/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        antares: {
          navy: '#0b2f4a',
          sky: '#21b5ff',
          mist: '#eaf7ff',
          slate: '#2f475a',
        },
      },
      fontFamily: {
        display: ['Montserrat Alternates', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
