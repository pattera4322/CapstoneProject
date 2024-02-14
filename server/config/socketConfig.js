const http = require('http');
const { Server } = require("socket.io");
const {app} = require('./expressSetup')

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
    },
  });

module.exports = { io ,httpServer};

