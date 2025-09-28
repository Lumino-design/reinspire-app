/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sanctuary: {
          base: '#0b1022',
          highlight: '#7dd3fc',
          soft: '#1a1f38',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(125, 211, 252, 0.25)',
      },
    },
  },
  plugins: [],
}