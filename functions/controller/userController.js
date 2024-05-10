
const {Job}=require("../models/job")
const {generateFile} =require("../utils/GenerateFile")
const {executeCpp} =require("../helper/executeCpp")
const {executeJava} =require("../helper/executeJava")
const {executeJavaScript} =require("../helper/executeJavaScript")
const {executePy} =require("../helper/executePy")
const {inputFile} =require("../utils/inputFile")
const {deleteFile} = require("../utils/deleteFile")

const Run = async (req,res)=>{
    const {language="cpp", code,input} =req.body;
    //console.log(input);
    if(code===undefined)
    {
    res.send(400).json({success:false ,error :"Empty code body!"})
    }
    const filepath= await generateFile(language,code);
    const inputpath= await inputFile(".txt",input);
    const job = await new Job({language,filepath,inputpath,status:"pending"});
    await job.save()
    const jobId=job._id;
    //console.log(job)
    res.status(201).json({success:true,jobId})
    job["startedAt"]=new Date();
    // C:\Users\ankush\Desktop\Mycompiler\mycompiler\functions\codes\61d18561-0b5d-44de-8f97-077d74a79924.cpp
    if(language==="cpp"){
    executeCpp(filepath,inputpath).then(async (output)=>{
        job["completedAt"]=new Date();
        job["status"]="success";
        job["output"]=output;
        await job.save()
        // console.log(job)
    }).catch(async (error)=>{
        
        job["completedAt"]=new Date();
        job["status"]="error";
        job["output"]=JSON.stringify(error);
        await job.save();
    })
    }else if(language==="py"){
       
    executePy(filepath,inputpath).then(async (output)=>{
        job["completedAt"]=new Date();
        job["status"]="success";
        job["output"]=output;
        await job.save(); 
        //console.log(job)
    }).catch(async (error)=>{
        
        job["completedAt"]=new Date();
        job["status"]="error";
        job["output"]=JSON.stringify(error);
        
        await job.save();
        
        
    })  
    

   }
   else if(language==="js")
   {
    executeJavaScript(filepath,inputpath).then(async (output)=>{
        job["completedAt"]=new Date();
        job["status"]="success";
        job["output"]=output;
        console.log(output);
        await job.save()
        console.log(job)
       
    }).catch(async (error)=>{ 
        job["completedAt"]=new Date();
        job["status"]="error";
        job["output"]=JSON.stringify(error);
        await job.save()
    })  
    
   }
   else if( language==="java")
   {
     
    executeJava(filepath,inputpath).then(async (output)=>{
        job["completedAt"]=new Date();
        job["status"]="success";
        job["output"]=output;
        console.log(output);
        await job.save()
        console.log(job)
      
    }).catch(async (error)=>{
        
        job["completedAt"]=new Date();
        job["status"]="error";
        job["output"]=JSON.stringify(error);
       
        await job.save()    
    })  
   }
}

const Status =  async (req,res)=>{
  const jobId=req.query.id;
  //console.log("status requested ",jobId);
  if(jobId===undefined)
  {
    return res.status(400).json({success:false,error:"missing id query params"})
  }
  try{
  const job=await Job.findOne({_id:jobId});
   
  if(job===undefined)
  {
    return res.status(200).json({success:false,error:"invalid job id"});
  } 
  //console.log(JSON.parse(job.output));
  res.status(200).json(job);
  }
  catch(err)
  {  
    console.log(err);
    res.status(400).json({success:false})
  }

}

const Delete = async (req,res)=>{
  const jobId=req.query.id;
  //console.log("status requested ",jobId);
  if(jobId===undefined)
  {
    return res.status(400).json({success:false,error:"missing id query params"})
  }
  try{
  
    const job=await Job.findOne({_id:jobId});
     console.log(job);
    if(job===undefined)
    {
      return res.status(200).json({success:false,error:"invalid job id"});
    } 
    //console.log(JSON.parse(job.output));  
    const fileStatus= await deleteFile(job.filepath,job.inputpath);
    console.log(fileStatus);
    await Job.findOneAndDelete({_id:jobId});
    if(fileStatus.status){
        res.status(200).json({success:true,status:"Deleted"});
    }
    else{
        res.status(200).json({success:false,status:"notDeleted"}); 
    }
    }
    catch(err)
    {  
      console.log(err);
      res.status(400).json({success:false})
    }
}

module.exports = {
  Run,
  Status,
  Delete,
}