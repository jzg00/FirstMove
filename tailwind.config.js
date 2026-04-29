/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f3f8f5',
          100: '#e4f0e9',
          200: '#c6e0d1',
          300: '#9dc8b0',
          400: '#6daa8a',
          500: '#4a8f6a',
          600: '#3a7354',
          700: '#2f5c43',
          800: '#274a37',
          900: '#213d2e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
