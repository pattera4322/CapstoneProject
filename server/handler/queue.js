// queue.js
const { Queue } = require("bullmq");

const redisConfig = {
  host: "redis-19738.c295.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 19738,
  password: "OBH97QGNgEtGm61w0qZbbjsOfcYhvBGs",
};

const queue = new Queue("myqueue", {
  connection: redisConfig,
});

async function enqueueJob(args) {
  await queue.add("pythonJob", args);
  // await queueScheduler.waitUntilReady();
}

function getQueues(req,res) {
  const queues = [queue.name]; // Add more queues as needed

  res.status(200).json({ queues });
}

module.exports = { enqueueJob,getQueues };
