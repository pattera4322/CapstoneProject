const { Worker } = require("bullmq");
const { spawn } = require("child_process");

function setUpWorker() {
  const redisConfig = {
    host: "redis-19738.c295.ap-southeast-1-1.ec2.cloud.redislabs.com",
    port: 19738,
    password: "OBH97QGNgEtGm61w0qZbbjsOfcYhvBGs",
  };

  const worker = new Worker(
    "myqueue",
    async (job) => {
      console.log(`Processing job ${job.id}`);

      const pythonArgs = [job.data.userid,job.data.fileid];
      const pythonScript = "./predictmodel/test2.py";
      const pythonProcess = spawn("python", [pythonScript, ...pythonArgs]);
      pythonProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      pythonProcess.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
      });

      console.log(job.data);

      return { result: "Job completed successfully" };
    },
    { connection: redisConfig, autorun: true }
  );

  worker.on("completed", (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on("failed", (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
  });
  worker.on('active', (job) => {
		console.debug(`Completed job with id ${job.id}`);
	});
 
}

module.exports = { setUpWorker };
