const {exec}=require("child_process");
const path =require('path');
const fs= require('fs');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const outputPath =path.join(appDir,"outputs")

if(!fs.exists(outputPath, ()=>{
      console.log("checking outPut directory")
    })){
    fs.mkdir(outputPath,{recursive:true},(err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Directory created successfully!');
    })
}


const executeJavaScript = (filepath, inputFilePath) => {
    const jobId = path.basename(filepath).split(".")[0];

    return new Promise((resolve, reject) => {
        process.chdir(outputPath); // Change the working directory

        // Run the JavaScript file with input redirection
        const runCommand = `node ${filepath} < ${inputFilePath}`;
        exec(runCommand, (runError, runStdout, runStderr) => {
            if (runError) {
                reject({ error: runError, stderr: runStderr });
            } else {
                resolve(runStdout);
            }
        });
    });
};
module.exports={
    executeJavaScript
}