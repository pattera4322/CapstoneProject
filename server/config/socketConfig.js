const http = require('http');
const { Server } = require("socket.io");
const {app} = require('./expressSetup')

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000', // Adjust this to match the origin of your main app
      methods: ['GET', 'POST'],
    },
  });

module.exports = { io ,httpServer};

