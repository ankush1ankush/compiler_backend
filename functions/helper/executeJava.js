const {exec}=require("child_process");
const path =require('path');
const fs= require('fs');

const executeJava = (filepath, inputFilePath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const javaPath = `${jobId}.java`
    const javaDirectory = path.dirname(filepath); //
    
    console.log(javaDirectory)
   // const classPath = path.join(outputPath, jobId);

    return new Promise((resolve, reject) => {
       process.chdir(javaDirectory); // Change the working directory
        //console.log(javaDirectory);
        // Copy the Java source file to the output directory
   
                // Compile the Java source file
                const compileCommand = `javac ${javaPath}`;
                exec(compileCommand, (compileError, compileStdout, compileStderr) => {
                    if (compileError) {
                        console.error(`Error during compilation: ${compileError}`);
                        reject({ error: compileError, stderr: compileStderr });
                    } else {

                        const runCommand = `java -cp ${javaDirectory} ${'run'} < ${inputFilePath}`;
                        exec(runCommand, (runError, runStdout, runStderr) => {
                            if (runError) {
                                console.error(`Error during execution: ${runError}`);
                                reject({ error: runError, stderr: runStderr });
                            } else {
                                console.log(`Java program executed successfully`);
                                resolve(runStdout);
                            }
                        });
                     
                    }
                })


});
}

module.exports = {
    executeJava
};

