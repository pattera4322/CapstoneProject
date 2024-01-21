// firebaseConfig.js
const admin = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const multer = require("multer");
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount),
    databaseURL:
      "https://capstoneproject-7cbb3-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "capstoneproject-7cbb3.appspot.com",
  });



const bucket = admin.storage().bucket();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const auth = getAuth();

module.exports = { bucket, upload, auth };


// // const firebaseConfig = {
// //   apiKey: "AIzaSyCZEwn3r9sG0hXqoIUVH4VxlB4avleOIkY",
// //   authDomain: "capstoneproject-7cbb3.firebaseapp.com",
// //   databaseURL:
// //     "https://capstoneproject-7cbb3-default-rtdb.asia-southeast1.firebasedatabase.app",
// //   projectId: "capstoneproject-7cbb3",
// //   storageBucket: "capstoneproject-7cbb3.appspot.com",
// //   messagingSenderId: "300399270711",
// //   appId: "1:300399270711:web:432cacb35d320c905618b2",
// //   measurementId: "G-GXC761QRB2",
// // };

// // const app2 = initializeApp(firebaseConfig);
// // const storage = getStorage(app2);