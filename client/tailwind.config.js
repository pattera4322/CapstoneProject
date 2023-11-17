/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'amiko': ['Amiko', 'sans'],
      }
    }
  },
  plugins: [],
});
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage:{
//         'SmartStockLogo': 'url(./assets/SmartStockLogo.svg)'
//     },
//   },
//   plugins: [],
// }
// }
