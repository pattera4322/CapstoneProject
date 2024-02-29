const { auth } = require("../config/firebaseConfig");

function createUser(req, res) {
  auth
    .createUser({
      email: req.body.email,
      password: req.body.password,
    })
    .then((userRecord) => {
      console.log("Successfully created new user:", userRecord.uid);
      return res.status(200).json({
        userUid: userRecord.uid,
      });
    })
    .catch((error) => {
      console.error("Error creating user:", error.errorInfo);
      let statusCode = 500; // Default status code for unknown errors
      let respMessage = "An error occurred";

      if (error.errorInfo.code === "auth/email-already-exists") {
        statusCode = 409; // Conflict
        respMessage = error.errorInfo.message;
      } else if (
        error.errorInfo.code === "auth/invalid-email" ||
        error.errorInfo.code === "auth/invalid-password"
      ) {
        statusCode = 400; // Bad Request
        respMessage = error.errorInfo.message;
      }

      return res.status(statusCode).json({
        RespCode: statusCode,
        RespMessage: respMessage,
      });
    });
}

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authhh " + authHeader);
  if (authHeader) {
    const idToken = authHeader.split(" ")[1];
    
    auth
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        return next();
      })
      .catch((error) => {
        console.log(error.errorInfo.message);
        return res.status(403).json({
          ResponseCode: 403,
          ResponseMessage: error.errorInfo.message,
        });
      });
  } else {
    res.status(401).json({
      ResponseCode: 401,
      ResponseMessage: "Unauthorized",
    });
  }
};

module.exports = { createUser, authenticateJWT };
