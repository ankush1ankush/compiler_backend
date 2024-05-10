const fs=require('fs')

const path =require('path');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const outputPath =path.join(appDir,"outputs")



const deleteFile = async (filepath, inputFilePath)=>{

    const jobId=path.basename(filepath).split(".")[0];
    
    const outPath= path.join(outputPath,`${jobId}.out`)
    /*
    const jobId=uuid();
    const filename=`${jobId}.${format}`
    const filepath=path.join(dirCodes,filename); //create file path
   // console.log(filepath);
    await fs.writeFileSync(filepath,code)  // this will write the code in the file and if file done not exsist 
                                           //then will create the file.
    return filepath;*/

    await fs.unlink(inputFilePath, (err)=> {
        if (err){ console.log(err);
            return {status:false,error:err};
        }
        else {
            console.log("\nDeleted file: example_file.txt");
    
            // Get the files in current directory
            // after deletion
           
        }
    });
    await fs.unlink(filepath,(err)=> {
        if (err){ console.log(err);
            return {status:false,error:err};
        }
        else {
            console.log("\nDeleted file: example_file.txt");
    
            // Get the files in current directory
            // after deletion
           
        }
    });
   await fs.unlink(outPath,(err)=> {

    if (err){ console.log(err);
        return {status:false,error:err};
    }
    else {
        console.log("\nDeleted file: example_file.txt");

        // Get the files in current directory
        // after deletion
       
    }
})
    return {status:true,success:"fileDeleted"}
}

module.exports  = {
    deleteFile,
}

