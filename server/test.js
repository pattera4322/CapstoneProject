const { spawn } = require('child_process');

const pythonScript = './server/test.py';
const pythonArgs = ['Mint','Max','My','./server/assets/test.csv'];

const pythonProcess = spawn('python', [pythonScript, ...pythonArgs]);

// Handle result ka
pythonProcess.stdout.on('data', (data) => {
  console.log(`Result: ${data.toString()}`);
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
