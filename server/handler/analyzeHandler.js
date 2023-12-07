const { spawn } = require("child_process");
const fs = require('fs');

function analyze(req, res) {
  console.log("REQ BODY",req.body.dataForAnalyze);
  const pythonScript = "./predictmodel/createModelPrediction.py";
  const pythonArgs = req.body.dataForAnalyze;

  const updatedPythonArgs = [...pythonArgs];

  updatedPythonArgs[4] = JSON.stringify(req.body.dataForAnalyze[4]);
  
  const arrayBufferData = req.body.dataForAnalyze[6];


  console.log("hereeeeeeee",updatedPythonArgs);
  const pythonProcess = spawn("python", [pythonScript, ...updatedPythonArgs]);

  const getDataFromPython = []

  pythonProcess.stdout.on("data", (data) => {
    const values = data.toString().split(' --- EndOfValue');
    values.forEach((value, index) => {
      if (value.trim() !== '') {
        console.log(`Index ${index} :`);
        console.log(value.trim());
        getDataFromPython[index] = value.trim();
      }
    });
    // const preaseData = JSON.parse(toStringData);
    // console.log("yoyo", preaseData)
    // getDataFromPython.push(preaseData)
    // console.log(`Result: ${data.toString()}`);
    // return res.status(200).json({
    //   data: "jubjub",
    // });
  });

  // Handle error ka
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python stderr: ${data.toString()}`);
  });

  // Handle the Python script's exit
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Python script executed successfully.");
      // getDataFromPython.forEach((value, index) => {
      //   console.log(`Index ${index} : ${value}`)
      // })
      // getDataFromPython.forEach((value, index) => {
      //   console.log(`Index ${index}`);
      //   const stringify = JSON.stringify(value);
      //   const parsedData = JSON.parse(stringify);
      //   if (index === 1) {
      //     const model = Object.keys(parsedData).map(category => ({
      //       [category]: {
      //         totalSales: parsedData[category].totalSales,
      //         quantity: parsedData[category].quantity,
      //       },
      //     }));
      //     console.log(`Model ===> ${model}`);
      //   } else{
      //     const predictValue = parsedData
      //     console.log(`Predictions ===> ${predictValue}`)
      //   }
      // });
      // return  res.status(200).json({
      //     model: model,
      //     predictValue: predictValue
      //   });
    } else {
      console.error(`Python script exited with code ${code}`);
    }
  });

  //   try {
  //     console.log(req);
  //     return res.status(200).json({
  //       data: "jubjub",
  //     });
  //   } catch (err) {
  //     console.error("Error upload file:", err);
  //     return res.status(err.code).json({
  //       RespCode: err.code,
  //       RespMessage: err.message,
  //     });
  //   }
}

module.exports = { analyze };
