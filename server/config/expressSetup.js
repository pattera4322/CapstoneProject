const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {authMiddleware} = require("../handler/userHandler");

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000", "http://cp23sj1.sit.kmutt.ac.th:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//TODO: for token in each api
// app.use("/", authMiddleware);

const port = 5000;
const host = '0.0.0.0';

module.exports = { app, port, host };
