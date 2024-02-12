const { spawn } = require('child_process');

// const pythonScript = './server/test.py';
// const pythonArgs = ['Mint','Max','My','./server/assets/test.csv'];

// const pythonProcess = spawn('python', [pythonScript, ...pythonArgs]);

const pythonArgs = ["BNpbU1pwKpPbhDqaIfBswOw8ycM2","5"];
const pythonScript = "./server/predictmodel/test2.py";

const pythonProcess = spawn("python", [pythonScript, ...pythonArgs]);
const valuesToCheck = ['h 10',"20",10];
// Handle result ka
pythonProcess.stdout.on('data', (data) => {
   console.log("result",data);
  console.log('h 10' === data.toString())
 

  if (valuesToCheck.includes(data.toString())) {
    console.log(`Received progress: ${data.toString()}`);
  
  }
});

// Handle error ka
pythonProcess.stderr.on('data', (data) => {
  console.error(`Python stderr: ${data.toString()}`);
});

// Handle the Python script's exit
pythonProcess.on('close', (code) => {
  if (code === 0) {
    console.log('Python script executed successfully.');
  } else {
    console.error(`Python script exited with code ${code}`);
  }
});
