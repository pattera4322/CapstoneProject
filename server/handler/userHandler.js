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

function authMiddleware(request, response, next) {
  const headerToken = request.headers.authorization;
  if (!headerToken) {
    return response.send({ message: "No token provided" }).status(401);
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    response.send({ message: "Invalid token" }).status(401);
  }

  const token = headerToken.split(" ")[1];
  auth
    .verifyIdToken(token)
    .then(() => next())
    .catch(() => response.send({ message: "Could not authorize" }).status(403));
}

module.exports = { createUser, authMiddleware };
