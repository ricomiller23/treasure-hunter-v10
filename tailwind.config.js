/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          light: '#f7f1e1',
          DEFAULT: '#eadeca',
          dark: '#d6c4a8',
          aged: '#bead8e',
        },
        jungle: {
          darkest: '#09130d',
          dark: '#0e1d14',
          deep: '#142a1d',
          mid: '#1d3e2b',
          leaf: '#2c5d41',
        },
        brass: {
          light: '#f2dc9b',
          DEFAULT: '#c9a227',
          dark: '#937418',
        },
        leather: {
          light: '#8b5a2b',
          DEFAULT: '#5c3a1e',
          dark: '#3b2513',
        },
      },
      fontFamily: {
        display: ['"Pirata One"', '"IM Fell English SC"', 'serif'],
        serif: ['"Merriweather"', '"IM Fell English"', 'serif'],
        mono: ['monospace'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0,0,0,0.6)',
        'card-glow': '0 0 16px rgba(201, 162, 39, 0.6), 0 4px 12px rgba(0,0,0,0.5)',
        'card-red-glow': '0 0 14px rgba(220, 38, 38, 0.5), 0 4px 12px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
