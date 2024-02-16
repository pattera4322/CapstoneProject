const { app } = require("./config/expressSetup");
// const { io } = require("./config/socketConfig");
// const { analyze } = require("./handler/analyzeHandler");
// const { enqueueData, getQueues } = require("./handler/queueHandler")
const socketio = require("socket.io");

// WebSocket connection handling----------------------------------
const server = app.listen(5001, () => {
  console.log("Socket Server is running on port 5001");
});

const io = socketio(server, {
  path: "/sj1-socket/",
  cors: {
    origin: "*",
  },
});

const progressData = {};
const frontendSockets = {}; 
const backendSockets = {};

io.of("/sockets/job-progress").on("connection", (socket) => {
  console.log("Client connected");
  // console.log("id", socket.id);

  socket.on("authenticate", (data) => {
    console.log("authen:",data);
    if (data.isFromClient) {
      frontendSockets[data.userId] = socket.id; 
    } else {
      backendSockets[data.userId] = socket.id; 
    }
  });

  socket.on("progress", (data) => {
    socket.join(socket.id);
    console.log(`Client from server connected from ${socket.id}`);
    console.log(`data:`, data);
    const sessionId = getSessionIdFromSocket(socket.id);
    const frontendSocketId = frontendSockets[sessionId];

    progressData[socket.id] = data;

    io.of("/sockets/job-progress").to(frontendSocketId).emit("progressfromServer", data);
    delete progressData[socket.id];
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete progressData[socket.id];
    removeSocketFromStore(socket.id);
  });
});

function getSessionIdFromSocket(socketId) {
  for (const sessionId in frontendSockets) {
    if (frontendSockets[sessionId] === socketId) {
      return sessionId;
    }
  }
  for (const sessionId in backendSockets) {
    if (backendSockets[sessionId] === socketId) {
      return sessionId;
    }
  }
  return null; // If no session ID is found
}


function removeSocketFromStore(socketId) {
  for (const sessionId in frontendSockets) {
    if (frontendSockets[sessionId] === socketId) {
      delete frontendSockets[sessionId];
      return;
    }
  }
  for (const sessionId in backendSockets) {
    if (backendSockets[sessionId] === socketId) {
      delete backendSockets[sessionId];
      return;
    }
  }
}

// httpServer.listen(5001, () => {
//   console.log("Socket server running on port 5001");
// });

// -------------------------------------------Analyze------------------------------------------------
// let isRunning = false;
// const requestQueue = [];
// app.post("/api/analyze/:userid/:fileid", (req, res) => {
//   const { userid, fileid } = req.params;
//   requestQueue.push({ userid, fileid });
//   enqueueData(requestQueue,userid)
//   res.status(200).json({ message: "send Analyze in queue successfully." });
//   console.log(requestQueue);
//   if (requestQueue.length === 1) {
//     isRunning = false;
//   }
//   console.log(isRunning);
//   if (isRunning) {
//     return;
//   }
//   isRunning = analyze(requestQueue);
// });
