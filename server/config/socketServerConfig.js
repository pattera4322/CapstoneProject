const { Manager, io } = require("socket.io-client");

//TODO: change manual if run local wait for .env
//'http://localhost:5001';
//https://capstone23.sit.kmutt.ac.th

const manager = new Manager("https://capstone23.sit.kmutt.ac.th", {
  path: "/sj1-socket/",
  forceNew: true,
  transports: ["websocket"],
});
const socketJobProgress = manager.socket("/sockets/job-progress");

module.exports = { socketJobProgress };
