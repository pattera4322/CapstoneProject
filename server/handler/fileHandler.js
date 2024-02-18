const multer = require("multer");
const { bucket } = require("../config/firebaseConfig");

const storage = multer.memoryStorage();
const upload = multer({ storage });

function uploadFile(req, res) {
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
          RespMessage: "File uploaded success.",
        });
      })
      .catch((error) => {
        return res.status(error.code).json({
          ResponseCode: error.response.statusCode,
          ResponseMessage: error.response.statusMessage,
        });
      });
  } catch (err) {
    console.error("Error upload file:", err);
    return res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error.",
    });
  }
}

function getFile(req, res) {
  try {
    console.log(`userid: ${req.params.userid}`);
    console.log(`fileid: ${req.params.fileid}`);
    bucket
      .file(`${req.params.userid}/${req.params.fileid}`)
      .download()
      .then((data) => {
        //recieve data is buffer type
        console.log("dataBuffer", data[0].buffer);
        res.status(200);
        res.end(Buffer.from(data[0].buffer));
      })
      .catch((error) => {
        return res.status(error.code).json({
          ResponseCode: error.response.statusCode,
          ResponseMessage: error.response.statusMessage,
        });
      });
  } catch (err) {
    console.log(`mar nee dai ngai: `, err);
    return res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error.",
    });
  }
}

function deleteFile(req, res) {
  try {
    const filename = req.params.fileid;
    bucket
      .file(`${req.params.userid}/${req.params.fileid}`)
      .delete()
      .then(() => {
        res.status(200).json({
          ResponseCode: 200,
          ResponseMessage: "File deleted successfully",
        });
      })
      .catch((error) => {
        if (error.code === 404) {
          return res.status(404).json({
            ResponseCode: error.response.statusCode,
            ResponseMessage: `File ${req.params.fileid} not found`,
          });
        } else {
          return res.status(error.code).json({
            ResponseCode: error.response.statusCode,
            ResponseMessage: error.response.statusMessage,
          });
        }
      });
  } catch (error) {
    return res.status(500).json({
      ResponseCode: 500,
      ResponseMessage: "Internal server error",
    });
  }
}

module.exports = { uploadFile, getFile, deleteFile };
