const path=require('path')
const fs=require('fs')
const {v4:uuid}=require('uuid')
const dirCodes=path.join(__dirname,"codes"); // creating path to the folder

if(!fs.exists(dirCodes, ()=>{
      console.log("checking outPut directory")
    })){
    fs.mkdir(dirCodes,{recursive:true},(err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Directory created successfully!');
    })
}

const generateFile = async (format, code)=>{
    const jobId=uuid();
    const filename=`${jobId}.${format}`
    const filepath=path.join(dirCodes,filename); //create file path
   // console.log(filepath);
    await fs.writeFile(filepath,code,(err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
  }
})  // this will write the code in the file and if file done not exsist 
                                           //then will create the file.
    return filepath;
}

module.exports  = {
    generateFile
}