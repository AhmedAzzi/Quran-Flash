/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F6E56',
        secondary: '#534AB7',
        background: '#FAFAF8',
        danger: '#DC2626',
        warning: '#D97706',
        success: '#16A34A',
        'text-primary': '#1C1917',
        'text-secondary': '#78716C',
        border: '#E7E5E4',
      },
      fontFamily: {
        arabic: ['Noto Sans Arabic', 'Cairo', 'sans-serif'],
        quran: ['Amiri Quran', 'serif'],
      },
    },
  },
  plugins: [],
}
