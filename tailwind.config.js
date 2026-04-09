/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF4',
          100: '#FDF8F0',
          200: '#FAF0DC',
        },
        forest: {
          DEFAULT: '#2D5016',
          light: '#3D6B1F',
          dark: '#1E3610',
        },
        burgundy: {
          DEFAULT: '#8B2035',
          light: '#A82A42',
          dark: '#6B1828',
        },
      },
    },
  },
  plugins: [],
}
