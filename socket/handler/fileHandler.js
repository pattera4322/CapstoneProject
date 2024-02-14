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
              RespMessage: "success file uploaded",
            });
          });
      } catch (err) {
        console.error("Error upload file:", err);
        return res.status(err.code).json({
          RespCode: err.code,
          RespMessage: err.message,
        });
      }
}

function getFile(req, res) {
    try {
        console.log(`userid: ${req.params.userid}`)
        console.log(`fileid: ${req.params.fileid}`)
        bucket
          .file(`${req.params.userid}/${req.params.fileid}`)
          .download()
          .then((data) => {
            //recieve data is buffer type
            console.log("dataBuffer",data[0].buffer)
            res.status(200);
            res.end(Buffer.from(data[0].buffer))
          })
          .catch((error) => {
            console.error("Error fetching file content:", error.response.statusMessage);
            return res.status(error.code).json({
              ResponseCode: error.response.statusCode,
              ResponseMessage: error.response.statusMessage
            }) 
          });
      } catch (err) {
        console.log(`mar nee dai ngai: `,err);
        return res.status(500).json({
          RespCode: 500,
          RespMessage: err.message,
        });
      }
}

function deleteFile(req, res){
  try {
    const filename = req.params.fileid;
    bucket
    .file(`${req.params.userid}/${req.params.fileid}`)
    .delete()
    .then(() => {
      res.status(200).json({ message: 'File deleted successfully' });
    })
    
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(error.code).json({
      ResponseCode: error.response.statusCode,
      ResponseMessage: error.response.statusMessage
    }) 
  }
}

module.exports = { uploadFile, getFile, deleteFile };
