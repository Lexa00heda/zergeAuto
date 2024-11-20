import { spawn } from 'child_process';
import path from 'path';
// Function to run a shell command using spawn and return a promise
export async function runCommandSpawn(command, args,) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args,{shell:true});

    let output = '';
    let errorOutput = '';

    // Capture standard output
    process.stdout.on('data', (data) => {
      output += data.toString();
      console.log(data.toString())
    });

    // Capture standard error
    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle process exit
    process.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(code);
        // reject(new Error(`Process exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}