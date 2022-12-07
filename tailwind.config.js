/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'additional-options': '2000ms cubic-bezier(0.33, 1, 0.68, 1) 0s 1 normal none running overlay-appear',
      },
    },
  },
  plugins: [],
};
