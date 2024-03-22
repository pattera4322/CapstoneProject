/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // 'amiko': ['Amiko', 'sans'],
        'sans': ['Noto Sans', 'sans-serif']
      },
      screens: {
        '3xl': '1600px', // Define your custom breakpoint here for a 3xl screen size
        // Add more custom breakpoints as needed
      },
      // animation: {
      //   'bounce': 'bounce 10s infinite',
      // },
      animation: {
        'floating': 'floating 8s infinite',
        'floating-2': 'floating-2 7s infinite',
      },
      keyframes: {
        'floating': {
          '0%, 100%': { transform: 'translateY(5%)' },
          '50%': { transform: 'translateY(-5%)' },
        },
        'floating-2': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(5%)' },
        },
      },
    }
  },
  plugins: [],
});
