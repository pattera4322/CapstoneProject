/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'SmartStockLogo': 'url(./assets/SmartStockLogo.svg)'
    },
  },
  plugins: [],
}
}
