const { app, port, host } = require("./config/expressSetup");
const { uploadFile, getFile, analyze } = require("./handler/fileHandler");
const { upload } = require("./config/firebaseConfig");

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

app.post("/api/analyze", upload.single("file"), (req, res) => {
  analyze(req, res);
});

