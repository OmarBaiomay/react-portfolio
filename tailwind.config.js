/** @type {import('tailwindcss').Config} */

import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}", // or whatever paths match your project
  ],
  theme: {
    extend: {
      gridAutoColumns: {
        '2fr': 'minmax(250, 1fr)',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [tailwindScrollbar],
}