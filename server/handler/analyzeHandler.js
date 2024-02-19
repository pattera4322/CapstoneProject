const { spawn } = require("child_process");
 const { socketJobProgress } = require("../config/socketServerConfig");
const { enqueueData } = require("../handler/queueHandler");
const { saveHistoryData } = require("../handler/userDataHandler");

function analyze (requestQueue) {

  if (requestQueue.length === 0) {
    return false;
  }

  const { userid, fileid } = requestQueue[0];

  console.log("ARGS", userid, fileid);

  const pythonScript = "./predictmodel/createModelPredictionNewVer.py";
  const pythonArgs = [userid, fileid];
  //const pythonScript = "./predictmodel/test2.py";

  const pythonProcess = spawn("python", [pythonScript, ...pythonArgs]);
  socketJobProgress.emit('progress', {
    userid: userid,
    fileid: fileid,
    progress: 5
  });

  let stderrData = "";

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data.toString()}`);
    const valuesToCheck = [12, 15, 20, 30, 35, 50, 65, 70, 75, 80, 90,100];
    if (valuesToCheck.includes(parseInt(data.toString()))) {
      console.log(`Received progress: ${data.toString()}`);
      socketJobProgress.emit('progress', {
        userid: userid,
        fileid: fileid,
        progress: parseInt(data.toString()),
      });
    }
  });

  // Handle error ka
  pythonProcess.stderr.on("data", (data) => {
    console.log(`Python stderr: ${data.toString()}`);
    stderrData = data.toString();
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
      saveHistoryData(data, userid, fileid);
    }
    requestQueue.shift();
    await enqueueData(requestQueue, userid);
    console.log("hereee",requestQueue)
    socketJobProgress.emit('progress', {
      userid: userid,
      fileid: fileid,
      progress: 101,
    });
    analyze(requestQueue);
  });
  return true;
}

module.exports = { analyze };
