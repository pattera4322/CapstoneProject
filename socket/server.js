const { app} = require("./config/expressSetup");
// const { io } = require("./config/socketConfig");
// const { analyze } = require("./handler/analyzeHandler");
// const { enqueueData, getQueues } = require("./handler/queueHandler")
const socketio = require('socket.io');

// WebSocket connection handling----------------------------------
const server = app.listen(5001, () => {
  console.log('Socket Server is running on port 5001');
});

const io = socketio(server, {
  path: '/sj1-socket/',
  cors: {
    origin: '*',
  },
});

io.of('/sockets/job-progress').on("connection", (socket) => {
  console.log("Client connected");
  console.log("id",socket.id);
  socket.on('test', () => {
          console.log(`Client connected from ${socket.id}`)
          socket.join(socket.id)
          console.log(`tatttttt`)
        })

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

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
