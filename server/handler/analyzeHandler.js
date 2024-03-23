const { spawn } = require("child_process");
const { socketJobProgress } = require("../config/socketServerConfig");
const { enqueueData } = require("../handler/queueHandler");
const { saveHistoryData } = require("../handler/userDataHandler");
const { data } = require("@tensorflow/tfjs");

const analyze = async (requestQueue) => {
  if (requestQueue.length === 0) {
    return false;
  }

  const { userid, historyid, state } = requestQueue[0];
  requestQueue[0].state = "running";
  await enqueueData(requestQueue);

  const pythonScript = "./predictmodel/createModelPredictionNewVer.py";
  const pythonArgs = [userid, historyid];
  //const pythonScript = "./predictmodel/test2.py";

  const pythonProcess = spawn("python", [pythonScript, ...pythonArgs]);
  socketJobProgress.emit("progress", {
    userid: userid,
    historyid: historyid,
    progress: 5,
  });

  let stderrData = "";
  let dataReceived = false;

  pythonProcess.stdout.on("data", async (data) => {
    console.log(`stdout: ${data.toString()}`);
    const valuesToCheck = [12, 15, 20, 30, 35, 50, 65, 70, 75, 80, 90, 100];
    if (valuesToCheck.includes(parseInt(data.toString()))) {
      // console.log(`Received progress: ${data.toString()}`);

      requestQueue[0].progress = parseInt(data.toString());
      await enqueueData(requestQueue);

      socketJobProgress.emit("progress", {
        userid: userid,
        historyid: historyid,
        progress: parseInt(data.toString()),
      });

      dataReceived = true;
    }
  });

  // Handle error ka
  pythonProcess.stderr.on("data", (data) => {
    console.log(`Python stderr: ${data.toString()}`);
    stderrData = data.toString();
  });

  pythonProcess.on("error", (data) => {
    console.log(`Error: ${data.toString()}`);
  });

  // Handle the Python script's exit
  pythonProcess.on("close", async (code) => {
    if (code === 0) {
      console.log("Successs");
    } else {
      const lastLine = stderrData.trim().split("\n").pop();
      console.log(
        `Python script exited with code ${code}. Error output: ${lastLine}`
      );
      const data = {
        errorMessage: `${lastLine}`,
      };
      saveHistoryData(data, userid, historyid);
    }
    if (dataReceived) {
      requestQueue.shift();
      await enqueueData(requestQueue);

      socketJobProgress.emit("progress", {
        userid: userid,
        historyid: historyid,
        progress: 101,
      });
      analyze(requestQueue);
    }
  });
  return true;
};

module.exports = { analyze };
