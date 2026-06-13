/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lightGreen: '#f4fbf7',
          lightRed: '#fff5f5',
          green: '#2e7d32',
          red: '#c62828',
          orange: '#ef6c00',
        }
      }
    },
  },
  plugins: [],
}
