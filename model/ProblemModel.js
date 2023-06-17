const mongoose =require('mongoose');
const problemSchema=new mongoose.Schema({
    id:{
        type:mongoose.Schema.ObjectId,
        ref:"Registers",
        required:true
    },
    name:{
        type:String,
        required:true,
    },

    phoneNo:{
type:Number,
required:true
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
    createdAt:{
        type:Date,
        default:Date.now
    }
   
})

module.exports=new mongoose.model('problem',problemSchema);