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
    }
  },
  plugins: [],
});
