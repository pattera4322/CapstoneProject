//const { initializeApp } = require("firebase/app");
const { get, remove, update } = require("firebase/database");
const { getDatabase } = require("firebase-admin/database");
const admin = require("firebase-admin/storage");
const { initializeApp, cert } = require("firebase-admin/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// //local
// app.listen(5000, () => {
//   console.log("started on port 5000");
// });

const port = 5000;
const host = '0.0.0.0'; // This makes your application accessible externally

app.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
});

// var admin = require("firebase-admin");
var serviceAccount = require("./config/serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL:
    "https://capstoneproject-7cbb3-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "capstoneproject-7cbb3.appspot.com",
});

// const firebaseConfig = {
//   apiKey: "AIzaSyCZEwn3r9sG0hXqoIUVH4VxlB4avleOIkY",
//   authDomain: "capstoneproject-7cbb3.firebaseapp.com",
//   databaseURL:
//     "https://capstoneproject-7cbb3-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "capstoneproject-7cbb3",
//   storageBucket: "capstoneproject-7cbb3.appspot.com",
//   messagingSenderId: "300399270711",
//   appId: "1:300399270711:web:432cacb35d320c905618b2",
//   measurementId: "G-GXC761QRB2",
// };

// const app2 = initializeApp(firebaseConfig);
// const storage = getStorage(app2);

//get your bucket
var bucket = admin.getStorage().bucket();
// const upload = multer(storage);
const storage = multer.memoryStorage();
const upload = multer({ storage });
// const db = getDatabase();

// -------------------------------------------File------------------------------------------------
//upload file firebase-admin
app.post("/api/file/:userid/:fileid", upload.single("file"), (req, res) => {
  try {
    console.log(req.file);
    bucket
      .file(`${req.params.userid}/${req.params.fileid}`)
      .save(req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: "public, max-age=31536000",
      })
      .then(() => {
        return res.status(200).json({
          RespCode: 200,
          RespMessage: "success file uploaded",
        });
      });
  } catch (err) {
    console.error("Error upload file:", err);
    return res.status(err.code).json({
      RespCode: err.code,
      RespMessage: err.message,
    });
  }
});

//GET file firebase-admin ${req.params.userid}/${req.params.fileid}
app.get("/api/file/:userid/:fileid", (req, res) => {
  //var storageRef = ref(storage, `user1/1`);
  try {
    console.log(`kuayyy: ${req.params.userid}`)
    console.log(`kuayyy2: ${req.params.fileid}`)
    bucket
      .file(`${req.params.userid}/${req.params.fileid}`)
      .download()
      .then((data) => {
        console.log("yoyoyoyoyo",data[0].buffer)
        res.status(200);
        res.end(Buffer.from(data[0].buffer))
      })
      .catch((error) => {
        console.error("Error fetching file content:", error.response.statusMessage);
        return res.status(error.code).json({
          ResponseCode: error.response.statusCode,
          ResponseMessage: error.response.statusMessage
        }) 
      });
  } catch (err) {
    console.log(`mar nee dai ngai: `,err);
    return res.status(500).json({
      RespCode: 500,
      RespMessage: err.message,
    });
  }
});

// -------------------------------------------Analyze------------------------------------------------
app.post("/api/analyze", upload.single("file"), (req, res) => {
  try {
    console.log(req.file);
    bucket
      .file(`${req.params.userid}/${req.params.fileid}`)
      .save(req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: "public, max-age=31536000",
      })
      .then(() => {
        return res.status(200).json({
          RespCode: 200,
          RespMessage: "success file uploaded",
        });
      });
  } catch (err) {
    console.error("Error upload file:", err);
    return res.status(err.code).json({
      RespCode: err.code,
      RespMessage: err.message,
    });
  }
});

// //upload file
// app.post("/api/file", upload.single("file"), (req, res) => {
//   var storageRef = ref(storage, `user1/1`);
//   try {
//     console.log(req.file);
//     uploadBytes(storageRef, req.file.buffer).then((snapshot) => {
//       return res.status(200).json({
//         RespCode: 200,
//         RespMessage: "success file uploaded",
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       RespCode: 500,
//       RespMessage: err.message,
//     });
//   }
// });

//GET File
// app.get("/api/file/:userid/:fileid", (req, res) => {
//   var storageRef = ref(storage, `user1/1`);
//   getDownloadURL(storageRef)
//     .then((url) => {
//       // Use the URL to download the file or display it in a table
//       console.log("CSV File URL:", url);

//       return res.status(200).json({
//         RespCode: 200,
//         RespMessage: "success download file",
//         urlFile: url,
//       });
//       // You can use this URL in your React component to fetch and display the CSV data.
//     })
//     .catch((error) => {
//       console.error("Error getting download URL:", error);
//     });
// });

//For create user
//   var fullname = req.body.fullname;
//   const newRecordRef = db.ref('users/').push();
//   try {
//       newRecordRef.set({
//           name: fullname,
//           mil: new Date().getTime(),
//           date: new Date() + ''
//       })
//       return res.status(200).json({
//           RespCode: 200,
//           RespMessage: "success"
//       })
//   }

// //get by user
// app.post('/api/getbyuser', (req, res) => {
//   var fullname = req.body.fullname

//   try {
//       get(ref(db, 'users/' + fullname))
//       .then((snapshot) => {
//           console.log(snapshot.val())
//           if( snapshot.exists() ) {
//               return res.status(200).json({
//                   RespCode: 200,
//                   RespMessage: 'good',
//                   Result: snapshot.val()
//               })
//           }
//           else {
//               return res.status(200).json({
//                   RespCode: 200,
//                   RespMessage: 'good',
//                   Result: 'not found data'
//               })
//           }
//       })
//       .catch((err2) => {
//           console.log(err2)
//           return res.status(500).json({
//               RespCode: 500,
//               RespMessage: err2.message
//           })
//       })
//   }
//   catch(err) {
//       console.log(err)
//       return res.status(500).json({
//           RespCode: 500,
//           RespMessage: err.message
//       })
//   }
// })

// //update
// app.put('/updateUser', (req, res) => {
//   var fullname = req.body.fullname

//   try {
//       var updates = {};
//       updates[`users/${fullname}/date`] = new Date() + '';
//       updates[`users/${fullname}/mil`] = new Date().getTime();

//       update(ref(db), updates)
//       .then(() => {
//           return res.status(200).json({
//               RespCode: 200,
//               RespMessage: 'good'
//           })
//       })
//       .catch((err2) => {
//           return res.status(500).json({
//               RespCode: 500,
//               RespMessage: 'bad ' + err2.message
//           })
//       })
//   }
//   catch(err) {
//       console.log(err)
//       return res.status(500).json({
//           RespCode: 500,
//           RespMessage: err.message
//       })
//   }
// })

// //delete
// app.delete('/deleteUser', (req, res) => {
//   var fullname = req.body.fullname

//   try {
//       remove(ref(db, "users/"+fullname))
//       .then(() => {
//           return res.status(200).json({
//               RespCode: 200,
//               RespMessage: 'good'
//           })
//       })
//       .catch((err2) => {
//           return res.status(500).json({
//               RespCode: 500,
//               RespMessage: 'bad ' + err2.message
//           })
//       })
//   }
//   catch(err) {
//       console.log(err)
//       return res.status(500).json({
//           RespCode: 500,
//           RespMessage: err.message
//       })
//   }
// })

// app.get("/users", (req,res) => {
//     res.json({
//         "users" : ["Mint", "Max", "My"]
//     })
// })

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// firebase.initializeApp(firebaseConfig)
// let database = firebase.database()

// database.ref("customPath").set(obj, function(error) {
//   if (error) {
//     // The write failed...
//     console.log("Failed with error: " + error)
//   } else {
//     // The write was successful...
//     console.log("success")
//   }
// })

// const firebaseConfig = {
//   apiKey: "AIzaSyCZEwn3r9sG0hXqoIUVH4VxlB4avleOIkY",
//   authDomain: "capstoneproject-7cbb3.firebaseapp.com",
//   databaseURL: "https://capstoneproject-7cbb3-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "capstoneproject-7cbb3",
//   storageBucket: "capstoneproject-7cbb3.appspot.com",
//   messagingSenderId: "300399270711",
//   appId: "1:300399270711:web:432cacb35d320c905618b2",
//   measurementId: "G-GXC761QRB2"
// };

// const app2 = initializeApp()
