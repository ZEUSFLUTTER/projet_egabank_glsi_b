/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf0',
          100: '#fff9e6',
          200: '#ffefcc',
          300: '#ffe4b3',
          400: '#ffd680',
          500: '#ffc933',
          600: '#ffbb00',
          700: '#e6a800',
          800: '#cc9500',
          900: '#b38400',
        },
        dark: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#000000',
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #ffbb00 0%, #ffd680 50%, #ffefcc 100%)',
        'gold-dark': 'linear-gradient(135deg, #b38400 0%, #cc9500 50%, #e6a800 100%)',
        'gold-white': 'linear-gradient(135deg, #ffffff 0%, #fff9e6 50%, #ffbb00 100%)',
      }
    },
  },
  plugins: [],
}
