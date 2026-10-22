/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        greek: {
          navy: '#070D1E',
          deep: '#0D1730',
          night: '#132247',
          gold: '#FFD700',
          'gold-light': '#FEE180',
          'gold-dark': '#B8860B',
          bronze: '#CD7F32',
          'bronze-dark': '#8B4513',
          marble: '#F5E6CA',
          'marble-light': '#FFFDF9',
          'marble-dark': '#D8C7A5',
          turquoise: '#00CED1',
          'turquoise-dark': '#008B8B',
          ocean: '#1E90FF',
          sky: '#38BDF8',
          laurel: '#2E8B57',
          amethyst: '#8A2BE2'
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Cinzel Decorative"', '"Cinzel"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(255, 215, 0, 0.45)',
        'blue-glow': '0 0 25px rgba(0, 206, 209, 0.45)',
        'divine': '0 10px 30px -5px rgba(255, 215, 0, 0.3), 0 0 15px rgba(205, 127, 50, 0.2)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'wave': 'wave 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(15px)' },
        }
      }
    },
  },
  plugins: [],
}
