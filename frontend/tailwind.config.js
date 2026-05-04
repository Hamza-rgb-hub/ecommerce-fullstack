/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563eb', light: '#3b82f6', dark: '#1d4ed8' },
        accent: '#f97316',
      },
      fontFamily: { sans: ['DM Sans', 'sans-serif'] },
    },
  },
  plugins: [],
}
