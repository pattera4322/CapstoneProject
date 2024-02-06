const { Worker, delay } = require("bullmq");
const { spawn } = require("child_process");
const { io } = require("../config/socketConfig")

//remove later
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
      io.emit('jobProgress', { jobId: job.id, progress: 0 });
      //-------------------------------------------------------------
      const pythonArgs = [job.data.userid,job.data.fileid];
      // const pythonArgs = req.body.dataForAnalyze
      const pythonScript = "./predictmodel/createModelPredictionNewVer.py";
      const pythonProcess = spawn("python", [pythonScript, ...pythonArgs]);
      pythonProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      pythonProcess.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
      });

      pythonProcess.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
      });
      pythonProcess.on("error", (err) => {
        console.error("Failed to start Python process:", err);
      });
      
      //--------------------------------------------------------------
      await job.updateProgress(70);
      console.log(job.data);
      io.emit('jobProgress', { jobId: job.id, progress: 42 });
      console.log("1");
      await sleep(2000)
      io.emit('jobProgress', { jobId: job.id, progress: 50 });
      console.log("1");
      await sleep(2000)
      io.emit('jobProgress', { jobId: job.id, progress: 60 });
      console.log("1");
      await sleep(10000)
      io.emit('jobProgress', { jobId: job.id, progress: 70 });
      console.log("1");
      await sleep(4000)
      io.emit('jobProgress', { jobId: job.id, progress: 80 });
      console.log("1");
      await sleep(2000)
      //this is socket.io------------------------------------
      // for (let i = 0; i <= 100; i += 10) {
      //   await job.updateProgress(i);
      //   // Emit progress to connected clients
      //   io.emit('jobProgress', { jobId: job.id, progress: i });
      // }
      io.emit('jobProgress', { jobId: job.id, progress: 100 });
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
  worker.on('waiting', (job) => {
		console.debug(`${job.id} has waiting`);
	});
}



module.exports = { setUpWorker };
