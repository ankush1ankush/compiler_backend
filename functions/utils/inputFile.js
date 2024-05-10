const path=require('path')
const fs =require('fs');
const {v4:uuid}=require("uuid");
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const dirInput=path.join(appDir,"input");

if(!fs.existsSync(dirInput))
{
    fs.mkdirSync(dirInput,{recursive: true});
}


const inputFile = async (format, input)=>{
    const jobId=uuid();
    const filename=`${jobId}.${format}`
    const filepath=path.join(dirInput,filename); //create file path
   // console.log(filepath);
    await fs.writeFileSync(filepath,input)  // this will write the code in the file and if file done not exsist 
                                           //then will create the file.
    return filepath;
}

module.exports  = {
   inputFile
}