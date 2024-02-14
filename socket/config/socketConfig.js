const http = require("http");
const { Server } = require("socket.io");
const { app } = require("./expressSetup");

const httpServer = http.createServer(app);

// const io = new Server(httpServer, {
//     cors: {
//       origin: 'http://0.0.0.0:3000', // Adjust this to match the origin of your main app
//       methods: ['GET', 'POST'],
//     },
//   });

const io = new Server(httpServer, { path: "/sj1-socket/", cors: { origin: "*" } });

module.exports = { io, httpServer };
