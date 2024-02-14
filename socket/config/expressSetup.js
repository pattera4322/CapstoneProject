const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { authMiddleware } = require("../handler/userHandler");
const { socketio } = require("socket.io");

const app = express();
// const corsOptions = {
//   origin: ["http://localhost:3000", "http://cp23sj1.sit.kmutt.ac.th:3000","https://capstone23.sit.kmutt.ac.th"],
//   credentials: true,
// };

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.configure(
//   socketio({ path: "/sj1-socket/", cors: { origin: "*" } }, (io) => {
//     socketSocialMessage(app, io);
//     socket.on('test', (shopName) => {
//       console.log(`Client connected from ${socket.id}`)
//       socket.join(socket.id)
//       console.log(`tatttttt`)
//       // const intervalMessage = setInterval(() => {
//       //   emitLatestMessage(shopName)
//       // }, 500)
//     })

//   })
// );
//  const socketSocialMessage = async (app: Application, io: Server) => {
//   io.of('/sockets/latest-message').on('connection', (socket) => {
//     socket.on('join-message', (shopName) => {
//       console.log(`Client connected from ${socket.id}`)
//       socket.join(socket.id)
//       const intervalMessage = setInterval(() => {
//         emitLatestMessage(shopName)
//       }, 500)

//       socket.on('leave-message', (shopName) => {
//         console.log(`Client leaving from ${socket.id}`)
//         socket.leave(shopName)
//         clearInterval(intervalMessage)
//         socket.disconnect(true)
//       })
//     })
//   }
// }
  

//TODO: for token in each api
// app.use("/", authMiddleware);

// const port = 5000;
// const host = "0.0.0.0";

module.exports = { app };
