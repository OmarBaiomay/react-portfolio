/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
        },
        line: 'rgb(var(--c-line) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Manrope', 'Cairo', 'sans-serif'],
        display: ['Syne', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 32px rgb(var(--c-accent) / 0.28)',
      },
    },
  },
  plugins: [],
};
