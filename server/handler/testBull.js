const { Worker, Queue } = require("bullmq");

const redisConfig = {
  host: "redis-19738.c295.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 19738,
  password: "OBH97QGNgEtGm61w0qZbbjsOfcYhvBGs",
};

const myQueue = new Queue("myqueue", {
  connection: redisConfig,
});

const myWorker = new Worker(
  "myqueue",
  async (job) => {
    console.log(job.data);
  },
  {
    connection: redisConfig,
  }
);

myWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

myWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

// Example: Add a job to the queue
(async () => {
  await myQueue.add("myJob", { someData: "example" });
  await myQueue.add("myJob", { someData: "yoyo" });
  // await myQueue.obliterate();
})();
