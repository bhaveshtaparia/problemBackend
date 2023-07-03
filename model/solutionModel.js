const mongoose =require('mongoose');
const solutionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"Registers",
        required:true
    },
    problemId:{
        type:mongoose.Schema.ObjectId,
        ref:"problem",
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    reply:[
        {
        name:{
            type:String,
            required:true
        },
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:"Registers",
            required:true
        },
        comment:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    
    }
    ],
    upvote:[
     {
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:"Registers",
            required:true
        },
     }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
   
})

module.exports=new mongoose.model('solution',solutionSchema);