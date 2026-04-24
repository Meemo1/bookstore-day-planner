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
        navy: {
          darkest: '#0E1A27',
          deep:    '#162234',
          raised:  '#1E2E42',
          border:  '#2A3E58',
          DEFAULT: '#1B3A5C',
          light:   '#2860A0',
          hover:   '#3474B8',
        },
        cream: {
          white:  '#FEFCF7',
          DEFAULT: '#FDF8F0',
          page:   '#F4EEE4',
          border: '#E8D8C0',
          deep:   '#DFD0B8',
        },
        ink: {
          900: '#1A1510',
          700: '#2E2416',
          500: '#6A5848',
          300: '#A89280',
          100: '#D4C8BA',
        },
        amber: {
          dark:    '#8A5010',
          DEFAULT: '#C4752A',
          border:  '#E8B870',
          tint:    '#FEF3E6',
        },
        teal: {
          DEFAULT: '#1D6B4A',
          border:  '#8CCDB0',
          tint:    '#E6F5EF',
        },
        gold: {
          DEFAULT: '#D4A030',
          tint:    '#FDF8E8',
        },
        ferry: '#0891b2',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['Figtree', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
