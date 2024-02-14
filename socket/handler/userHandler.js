// const { auth } = require("../config/firebaseConfig");

// function createUser(req, res) {
//   auth
//     .createUser({
//       email: req.body.email,
//       password: req.body.password,
//     })
//     .then((userRecord) => {
//       console.log("Successfully created new user:", userRecord.uid);
//       return res.status(200).json({
//         userUid: userRecord.uid,
//       });
//     })
//     .catch((error) => {
//       console.log("Error create user:", error.errorInfo);
//       if (error.errorInfo.code == "auth/email-already-exists") {
//         return res.status(409).json({
//           RespCode: error.errorInfo.code,
//           RespMessage: error.errorInfo.message,
//         });
//       }
//       return error;
//     });
// }

// function authMiddleware(request, response, next) {
//   const headerToken = request.headers.authorization;
//   if (!headerToken) {
//     return response.send({ message: "No token provided" }).status(401);
//   }

//   if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
//     response.send({ message: "Invalid token" }).status(401);
//   }

//   const token = headerToken.split(" ")[1];
//   auth
//     .verifyIdToken(token)
//     .then(() => next())
//     .catch(() => response.send({ message: "Could not authorize" }).status(403));
// }

// module.exports = { createUser, authMiddleware };
