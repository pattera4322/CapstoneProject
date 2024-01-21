const { app, port, host } = require("./config/expressSetup");
const { uploadFile, getFile, deleteFile } = require("./handler/fileHandler");
const { upload } = require("./config/firebaseConfig");
const { analyze }= require("./handler/analyzeHandler");
const { createUser } = require("./handler/userHandler");

app.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
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

// -------------------------------------------User------------------------------------------------
app.post("/api/signup", (req, res) => {
  createUser(req, res);
});