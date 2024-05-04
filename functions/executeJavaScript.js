const {exec}=require("child_process");
const path =require('path');
const fs= require('fs');

const outputPath =path.join(__dirname,"outputs")


if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath,{recursive:true})
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