const { Worker, Queue, DelayedError } = require("bullmq");

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
    
    console.log("tood---------------------------");
    console.log(job.data);
    const token = job.token;
    console.log("token from job", token);

    //await job.moveToDelayed(Date.now() + 200, job.token);
    console.log(`Processing job ${job.id}`);
    
    //throw new DelayedError();
    //  await delay(10000)
    //  job.moveToCompleted("success",token)
  },
  {
    connection: redisConfig,autorun:false
  }
);

myWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

myWorker.on("active", (job) => {
  console.log(`${job.id} has active!`);
});
myWorker.on("delayed", (job) => {
  console.log(`${job.id} has delayed!`);
});

myWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

// Example: Add a job to the queue
(async () => {
  await myQueue.obliterate();
  //await myQueue.add("myJob", { someData: "example" });
  //await myQueue.add("myJob", { someData: "yoyo" });
  
  //await myQueue.obliterate();
})();
