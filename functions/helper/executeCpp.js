const {exec}=require("child_process");
const path =require('path');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const fs= require('fs');
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

const executeCpp =(filepath ,inputFilePath)=>{
   
   console.log(appDir);
   // console.log(inputFilePath);
    //5ebe9699-ac2d-4af9-8bc3-3f93742aa066.cpp
    const jobId=path.basename(filepath).split(".")[0];
    
    const outPath= path.join(outputPath,`${jobId}.out`)

    return new Promise((resolve,reject)=>{

        process.chdir(outputPath); // Change the working directory
        //const command1= `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`
        const command2=`g++ ${filepath} -o ${outPath} &&  ${jobId}.out < ${inputFilePath}`
        exec(command2 ,(error,stdout,stderr)=>{
            if(error)
            {
                reject({error,stderr});
            }
            if(stderr)
            {
                reject(stderr);
                
            }
            resolve(stdout);
        });
        
    });

}

module.exports={
    executeCpp
}