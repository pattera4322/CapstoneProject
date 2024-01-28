const { app, port, host } = require("./config/expressSetup");
const { uploadFile, getFile, deleteFile } = require("./handler/fileHandler");
const { upload } = require("./config/firebaseConfig");
const { analyze } = require("./handler/analyzeHandler");
const { createUser } = require("./handler/userHandler");
const { enqueueJob, getQueues } = require("./handler/queue");
const { saveData } = require("./handler/userDataHandler");
const { setUpWorker } = require("./handler/worker");

app.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
  setUpWorker();
});

// -------------------------------------------File------------------------------------------------
app.post("/api/file/:userid/:fileid", upload.single("file"), (req, res) => {
  uploadFile(req, res);
});
app.get("/api/file/:userid/:fileid", (req, res) => {
  getFile(req, res);
});

// -------------------------------------------Analyze------------------------------------------------
app.post("/api/analyze", (req, res) => {
  analyze(req, res);
});

app.delete("/api/file/:userid/:fileid", (req, res) => {
  deleteFile(req, res);
});

// for queue the task
app.post("/api/enqueueJob/:userid/:fileid", async (req, res) => {
  try {
    const { userid, fileid } = req.params;
    const args = {
      userid,
      fileid,
    };
    await enqueueJob(args);
    res.status(200).json({ message: "Job enqueued successfully." });
  } catch (error) {
    console.error("Error enqueueing job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/queues", async (req, res) => {
  getQueues(req,res);
});

// -------------------------------------------User------------------------------------------------
app.post("/api/signup", (req, res) => {
  createUser(req, res);
});

// -------------------------------------------User Data------------------------------------------------
app.post("/api/saveUserData/:userid", (req, res) => {
  saveData(req, res);
});
