/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,html}'],
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
          soft: 'rgb(var(--c-accent-soft) / <alpha-value>)',
        },
        line: 'rgb(var(--c-line) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Syne', 'Cairo', 'sans-serif'],
        sans: ['Manrope', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgb(var(--c-accent) / 0.25)',
        card: '0 20px 50px rgb(0 0 0 / 0.35)',
      },
      maxWidth: {
        site: '72rem',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to right, rgb(var(--c-line) / 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--c-line) / 0.35) 1px, transparent 1px)',
      },
    },
  },
  plugins: [tailwindScrollbar],
};
