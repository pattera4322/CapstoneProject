const { Worker, delay, DelayedError } = require("bullmq");
const { spawn } = require("child_process");
const { io } = require("../config/socketConfig");

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
      io.emit("jobProgress", { jobId: job.id, progress: 0 });
      //-------------------------------------------------------------
      const pythonArgs = [job.data.userid, job.data.fileid];
      const pythonScript = "./predictmodel/createModelPredictionNewVer.py";

      // const pythonProcess = spawn("python", [pythonScript, ...pythonArgs]);
      let stderrData = '';
      try {
        const pythonProcess = spawn("python", [pythonScript, ...pythonArgs]);
  
        pythonProcess.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`);
          
          if (data == 10) {
            console.log(`Received progress: ${data}`);
            io.emit("jobProgress", { jobId: job.id, progress: data });
          }
        });

        pythonProcess.stderr.on("data", (data) => {
          stderrData += data; // Collect error output
        });
  
        await new Promise((resolve, reject) => {
          pythonProcess.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
            if (code === 0) {
              io.emit("jobProgress", { jobId: job.id, progress: 100 });
              resolve();
            } else {
              reject(new Error(`Python process exited with non-zero code: ${code}.Error output: ${stderrData}`));
            }
          });
  
          pythonProcess.on("error", (err) => {
            console.error("Failed to start Python process:", err);
            reject(err);
          });
        });

      } catch (error) {
        console.error("Error occurred during job processing:", error);
        // throw new DelayedError();
      }

      // pythonProcess.on("close", (code) => {
      //   console.log(`child process exited with code ${code}`);

      // });

      // pythonProcess.on("error", (err) => {
      //   console.error("Failed to start Python process:", err);
      //   throw new DelayedError();
      // });

  
    },
    { connection: redisConfig }
  );

  worker.on("completed", (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on("failed", (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
  });
  worker.on("active", (job) => {
    console.log(`active job with id ${job.id}`);
  });
  worker.on("waiting", (job) => {
    console.log(`${job.id} has waiting`);
  });
  worker.on("delayed", (job) => {
    console.log(`${job.id} has delayed`);
  });
}

module.exports = { setUpWorker };
