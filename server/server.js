import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, set, ref,get,remove,update } from "firebase/database";
import  express from "express";
import  bodyParser from "body-parser";
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//local
const server = app.listen(5000, () => {console.log("started on port 5000")})

const firebaseConfig = {
  apiKey: "AIzaSyCZEwn3r9sG0hXqoIUVH4VxlB4avleOIkY",
  authDomain: "capstoneproject-7cbb3.firebaseapp.com",
  databaseURL: "https://capstoneproject-7cbb3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capstoneproject-7cbb3",
  storageBucket: "capstoneproject-7cbb3.appspot.com",
  messagingSenderId: "300399270711",
  appId: "1:300399270711:web:432cacb35d320c905618b2",
  measurementId: "G-GXC761QRB2"
};

const app2 = initializeApp(firebaseConfig)
const db = getDatabase(app2)

//create user
app.post('/user', (req,res) => {
  var fullname = req.body.fullname;

  try {
      console.log('>>>> fullname', fullname)
      console.log('path', 'users/' + fullname)
      set(ref(db, 'users/' + fullname), {
          name: fullname,
          mil: new Date().getTime(),
          date: new Date() + ''
      })
      return res.status(200).json({
          RespCode: 200,
          RespMessage: "success"
      })
  }
  catch(err) {
      console.log(err)
      return res.status(500).json({
          RespCode: 500,
          RespMessage: err.message
      })
  }
})

//get
app.get('/users', (req, res) => {
  try {
      get(ref(db, 'users'))
      .then((snapshot) => {
          console.log(snapshot.val())
          if( snapshot.exists() ) {
              return res.status(200).json({
                  RespCode: 200,
                  RespMessage: 'good',
                  Result: snapshot.val()
              })
          }
          else {
              return res.status(200).json({
                  RespCode: 200,
                  RespMessage: 'good',
                  Result: 'not found data'
              })
          }
      })
      .catch((err2) => {
          console.log(err2)
          return res.status(500).json({
              RespCode: 500,
              RespMessage: err2.message
          })
      })
  }
  catch(err) {
      console.log(err)
      return res.status(500).json({
          RespCode: 500,
          RespMessage: err.message
      })
  }
})

//get by user
app.post('/api/getbyuser', (req, res) => {
  var fullname = req.body.fullname

  try {
      get(ref(db, 'users/' + fullname))
      .then((snapshot) => {
          console.log(snapshot.val())
          if( snapshot.exists() ) {
              return res.status(200).json({
                  RespCode: 200,
                  RespMessage: 'good',
                  Result: snapshot.val()
              })
          }
          else {
              return res.status(200).json({
                  RespCode: 200,
                  RespMessage: 'good',
                  Result: 'not found data'
              })
          }
      })
      .catch((err2) => {
          console.log(err2)
          return res.status(500).json({
              RespCode: 500,
              RespMessage: err2.message
          })
      })
  }
  catch(err) {
      console.log(err)
      return res.status(500).json({
          RespCode: 500,
          RespMessage: err.message
      })
  }
})

//update
app.put('/updateUser', (req, res) => {
  var fullname = req.body.fullname

  try {
      var updates = {};
      updates[`users/${fullname}/date`] = new Date() + '';
      updates[`users/${fullname}/mil`] = new Date().getTime();

      update(ref(db), updates)
      .then(() => {
          return res.status(200).json({
              RespCode: 200,
              RespMessage: 'good'
          })
      })
      .catch((err2) => {
          return res.status(500).json({
              RespCode: 500,
              RespMessage: 'bad ' + err2.message
          })
      })
  }
  catch(err) {
      console.log(err)
      return res.status(500).json({
          RespCode: 500,
          RespMessage: err.message
      })
  }
})

//delete
app.delete('/deleteUser', (req, res) => {
  var fullname = req.body.fullname

  try {
      remove(ref(db, "users/"+fullname))
      .then(() => {
          return res.status(200).json({
              RespCode: 200,
              RespMessage: 'good'
          })
      })
      .catch((err2) => {
          return res.status(500).json({
              RespCode: 500,
              RespMessage: 'bad ' + err2.message
          })
      })
  }
  catch(err) {
      console.log(err)
      return res.status(500).json({
          RespCode: 500,
          RespMessage: err.message
      })
  }
})

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
