
const express =require("express");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors=require("cors");
const{connectMongoDb}=require("./connection")
const {generateFile} =require("./GenerateFile")
const {inputFile} = require("./inputFile")
const {executeCpp}=require("./executeCpp");
//const { error } = require("firebase-functions/logger");
const {executePy}=require("./executePy")
const {executeJavaScript}=require("./executeJavaScript")
const {executeJava}=require("./executeJava");
const {Job}=require("./models/job")
const {deleteFile}=require("./deleteFile")
const ACTIONS = require("./Actions")


const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());




connectMongoDb("mongodb+srv://ankush1ankush:D5g0duYdmoGlSF32@cluster0.9gvgkgj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").catch(err => console.log(err));




const userSocketMap ={};

const getAllConnectedClients = (roomId)=>{
    return Array.from( io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId)=>{
            return {
               socketId,
               username : userSocketMap[socketId],
            }
        }
    )
}

io.on('connection', (socket) => {
     console.log('a user connected', socket.id);
     socket.on(ACTIONS.JOIN,({roomId,userName})=>{
        userSocketMap[socket.id]=userName;
        socket.join(roomId) // joinning the socket in
        const clients = getAllConnectedClients(roomId); // getting all socket present in this room
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                userName,
                socketId : socket.id
            }) 
        })
        console.log(" clients :");
        console.log(clients)
        socket.join(roomId);   // joinning the current socket the roomID 
     })
     socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms];
        
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
     })
});


app.get("/", (req, res) => {
    //console.log("hello");
    res.json({message:"hello world"});
  });
app.post("/run", async (req,res)=>{


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

  
    
 
})

app.get("/status", async (req,res)=>{

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

})

app.get("/delete", async (req,res)=>{
  
  
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
    
   
})

server.listen(process.env.PORT || 5000,()=>{
    console.log("listenning to the port no 5000")
})