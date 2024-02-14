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
  

//TODO: for token in each api
// app.use("/", authMiddleware);

// const port = 5000;
// const host = "0.0.0.0";

module.exports = { app };
