const mongoose=require('mongoose')

const JobSchema=mongoose.Schema({
   
    language:{
        type:String,
        require:true,
        enum:["cpp","py","js","java"]
    },
    filepath:{
       type:String,
       require:true,
    },
    inputpath:{
       type:String,
       require:true,
    },
    submittedAt:{
       type:Date,
       default:Date.now
    },
    startedAt:{
        type:Date
    },
    completedAt:{
        type:Date
    },
    output:{
        type:String
    },
    status:{
     type:String,
     default:"pending",
     enum:["pending","success","error"],
    
    }

})

const Job=mongoose.model('jobs',JobSchema)

module.exports={
  Job
}