// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',      // Dark Blue-Gray
        secondary: '#34495e',    // Lighter Blue-Gray
        accent: '#d2b48c',       // Tan Accent
      },
      fontFamily: {
        serif: ['"Merriweather"', 'serif'],
        sans: ['"Open Sans"', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0)' },
        },
        modalAppear: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        gradientShift: {
          '0%': {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.15))',
          },
          '50%': {
            background: 'linear-gradient(135deg, rgba(0,0,0,0.15), rgba(255,255,255,0.15))',
          },
          '100%': {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.15))',
          },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        modalAppear: 'modalAppear 0.5s ease-out forwards',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        gradientShift: 'gradientShift 8s ease infinite',
      },
      boxShadow: {
        '3xl': '0 20px 40px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
