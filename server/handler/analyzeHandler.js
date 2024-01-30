const { spawn } = require("child_process");


function analyze(req, res) {
  console.log("REQ BODY", req.body.dataForAnalyze);
  const pythonScript = "./predictmodel/createModelPredictionNewVer.py";
  const pythonArgs = req.body.dataForAnalyze;

  const updatedPythonArgs = [...pythonArgs];

  updatedPythonArgs[5] = JSON.stringify(req.body.dataForAnalyze[5]);

  console.log("UpdatedPythonArgs", updatedPythonArgs);
  const pythonProcess = spawn("python", [pythonScript, ...updatedPythonArgs]);

  const getDataFromPython = [];
  var getErrorFromPython = "No error";

  // pythonProcess.stdout.on("data", (data) => {
  //   const values = data.toString().split("----EndOfValue");
  //   console.log("split leaw", values);
  //   getDataFromPython.push(values);
  //   // values.forEach((value, index) => {
  //   //   if (value.trim() !== '') {
  //   //     console.log(`Index ${index} :`);
  //   //     console.log(value.trim());
  //   //     getDataFromPython[index] = value.trim();
  //   //   }
  //   // });
  // });

  // Handle error ka
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python stderr: ${data.toString()}`);
    getErrorFromPython = data.toString();
  });

  // Handle the Python script's exit
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Python script executed successfully.");
      console.log("--------------------------------");
      console.log(`predictSalesData: ${getDataFromPython[0]}`);
      console.log(`predictQuantityData: ${getDataFromPython[1]}`);
      console.log(`evaluateSalesData: ${getDataFromPython[2][0]}`);
      console.log(`evaluateQuantityData: ${getDataFromPython[2][1]}`);
      console.log(`predictImage: ${getDataFromPython[2][2]}`);
      console.log(`predictModel: ${getDataFromPython[2][3]}`);

      return res.status(200).json({
        predictSalesData: getDataFromPython[0],
        predictQuantityData: getDataFromPython[1],
        evaluateSalesData: getDataFromPython[2][0],
        evaluateQuantityData: getDataFromPython[2][1],
        predictImage: getDataFromPython[2][2],
        predictModel: getDataFromPython[2][3],
      });
    } else if (code === 1) {
      console.error(`Python script exited with code ${code}`);
      return res.status(500).json({
        RespCode: 500,
        RespMessage: getErrorFromPython,
      });
    } else {
      console.error(`Python script exited with code ${code}`);
      return res.status(500).json({
        RespCode: 500,
        RespMessage: getErrorFromPython,
      });
    }
  });

}

module.exports = { analyze };
