const { app, port, host } = require("./config/expressSetup");
const { uploadFile, getFile, deleteFile } = require("./handler/fileHandler");
const { upload } = require("./config/firebaseConfig");
const { analyze } = require("./handler/analyzeHandler");
const { createUser } = require("./handler/userHandler");
const { enqueueData, getQueues } = require("./handler/queueHandler")
const {
  saveData,
  getData,
  getHistoryData,
  getAllHistoryData,
} = require("./handler/userDataHandler");

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

// -------------------------------------------File------------------------------------------------
app.post("/api/file/:userid/:fileid", upload.single("file"), (req, res) => {
  uploadFile(req, res);
});
app.get("/api/file/:userid/:fileid", (req, res) => {
  getFile(req, res);
});

// -------------------------------------------Analyze------------------------------------------------
let isRunning = false;
const requestQueue = [];
app.post("/api/analyze/:userid/:fileid", (req, res) => {
  const { userid, fileid } = req.params;
  requestQueue.push({ userid, fileid });
  enqueueData(requestQueue,userid)
  res.status(200).json({ message: "send Analyze in queue successfully." });
  console.log(requestQueue);
  if (requestQueue.length === 1) {
    isRunning = false;
  }
  console.log(isRunning);
  if (isRunning) {
    return;
  }
  isRunning = analyze(requestQueue);
});

app.delete("/api/file/:userid/:fileid", (req, res) => {
  deleteFile(req, res);
});

app.get("/api/queues/:userid", async (req, res) => {
   getQueues(req, res);
});

// for queue the task
// app.post("/api/enqueueJob/:userid/:fileid", async (req, res) => {
//   try {
//     const { userid, fileid } = req.params;
//     const args = {
//       userid,
//       fileid,
//       userData: req.body.userData,
//     };
//     await enqueueJob(args);
//     res.status(200).json({ message: "Job enqueued successfully." });
//   } catch (error) {
//     console.error("Error enqueueing job:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/api/queues/:userid", async (req, res) => {
//   getQueues(req, res);
// });

// -------------------------------------------User------------------------------------------------
app.post("/api/signup", (req, res) => {
  createUser(req, res);
});

// -------------------------------------------User Data------------------------------------------------
app.post("/api/saveUserData/:userid", (req, res) => {
  saveData(req, res);
});

app.get("/api/userData/:userid", (req, res) => {
  getData(req, res);
});

app.get("/api/userHistory/:userid/:fileid", (req, res) => {
  getHistoryData(req, res);
});

app.get("/api/userHistory/:userid", (req, res) => {
  getAllHistoryData(req, res);
});
