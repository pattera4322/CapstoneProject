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

async function getQueues(req,res) {
  try {
    // Get information about the jobs in the queue
    // await queue.obliterate();
    const jobs = await queue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed']);
    const jobData = await Promise.all(jobs.map(async (job) => {
      return {
        id: job.id,
        name: job.name,
        data: job.data,
        state: await job.getState(),
      };
    }));
  
    res.status(200).json({ jobs: jobData });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { enqueueJob,getQueues };
