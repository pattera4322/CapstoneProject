const { app, port, host } = require("./config/expressSetup");
const { uploadFile, getFile, deleteFile } = require("./handler/fileHandler");
const { upload } = require("./config/firebaseConfig");
const { analyze } = require("./handler/analyzeHandler");
const {
  signUpUser,
  getToken,
  authenticateJWT,
} = require("./handler/authenHandler");
const { enqueueData, getQueues } = require("./handler/queueHandler");
const {
  saveData,
  updateData,
  getData,
  getHistoryData,
  getAllHistoryData,
} = require("./handler/userDataHandler");
const {
  createInsightData,
  updateInsightData
} = require("./handler/userInsightHandler");
const { socketJobProgress } = require("./config/socketServerConfig");

app.listen(port, host, () => {
  console.log(`Server backend started on http://${host}:${port}`);
});

// WebSocket connection handling----------------------------------
// io.on("connection", (socket) => {
//   console.log("Client connected");

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// httpServer.listen(5002, () => {
//   console.log("Socket server running on port 5002");
// });
socketJobProgress.connect();

// -------------------------------------------File------------------------------------------------
app.post(
  "/api/file/:userid/:fileid",
  upload.single("file"),
  authenticateJWT,
  (req, res) => {
    uploadFile(req, res);
  }
);
app.get("/api/file/:userid/:fileid", authenticateJWT, (req, res) => {
  getFile(req, res);
});

// -------------------------------------------Analyze------------------------------------------------
let isRunning = false;
const requestQueue = [];
app.post("/api/analyze/:userid/:fileid", authenticateJWT, async (req, res) => {
  const { userid, fileid } = req.params;
  requestQueue.push({ userid, fileid });
  await enqueueData(requestQueue, userid);
  res.status(200).json({
    ResponseCode: 200,
    ResponseMessage: "Send data to anayze in queue successfully.",
  });
  console.log(requestQueue);
  if (requestQueue.length === 1) {
    isRunning = false;
  }
  console.log(isRunning);
  if (isRunning) {
    return;
  }
  socketJobProgress.emit("authenticate", {
    userId: userid,
    isFromClient: false,
  });
  isRunning = analyze(requestQueue);
});

app.delete("/api/file/:userid/:fileid", authenticateJWT, (req, res) => {
  deleteFile(req, res);
});

app.get("/api/queues/:userid", authenticateJWT, async (req, res) => {
  getQueues(req, res);
});

// -------------------------------------------User------------------------------------------------
app.post("/api/signup", (req, res) => {
  signUpUser(req, res);
});

app.get("/api/token", (req, res) => {
  getToken(req, res);
});

// -------------------------------------------User Data------------------------------------------------
app.post("/api/userData/:userid", authenticateJWT, (req, res) => {
  saveData(req, res);
});

app.put("/api/userData/:userid", authenticateJWT, (req, res) => {
  updateData(req, res);
});

app.get("/api/userData/:userid", authenticateJWT, (req, res) => {
  getData(req, res);
});

// -------------------------------------------User History Data------------------------------------------------
app.get("/api/userHistory/:userid/:fileid", authenticateJWT, (req, res) => {
  getHistoryData(req, res);
});

app.get("/api/userHistory/:userid", authenticateJWT, (req, res) => {
  getAllHistoryData(req, res);
});

// -------------------------------------------User History Data------------------------------------------------

app.post("/api/userInsight/:userid/:fileid", (req, res) => {
  createInsightData(req, res);
});

app.put("/api/userInsight/:userid/:fileid", (req, res) => {
  updateInsightData(req, res);
});
