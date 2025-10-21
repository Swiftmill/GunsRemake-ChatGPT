/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      colors: {
        gunspurple: '#5b3fc4',
        gunspink: '#c057f5',
        gunsdark: '#0f0a1f'
      },
      backgroundImage: {
        'guns-gradient': 'linear-gradient(135deg, #14042c 0%, #2b0b5c 40%, #45136f 75%, #6a1bb4 100%)'
      },
      boxShadow: {
        glow: '0 10px 40px rgba(128, 90, 213, 0.45)'
      }
    }
  },
  plugins: []
};
