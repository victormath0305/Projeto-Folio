/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F3EFE6',
          warm: '#EAE4D7',
          deep: '#E0D8C8',
        },
        ink: {
          DEFAULT: '#191919',
          muted: '#4A4741',
          subtle: '#59554E',
        },
        vermilion: {
          DEFAULT: '#D94732',
          dark: '#B83724',
          soft: '#F9E6E2',
        },
        paper: {
          DEFAULT: '#C8C1B4',
          dark: '#A8A092',
        },
        sheet: '#FFFFFF',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Newsreader"', 'Georgia', 'serif'],
        editorial: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        sheet: '0 20px 45px -15px rgba(25, 25, 25, 0.14), 0 1px 3px rgba(25, 25, 25, 0.08)',
        'sheet-hover': '0 28px 60px -15px rgba(25, 25, 25, 0.22), 0 2px 6px rgba(25, 25, 25, 0.1)',
        architectural: '4px 4px 0px 0px #191919',
        'architectural-red': '4px 4px 0px 0px #D94732',
      },
    },
  },
  plugins: [],
};
