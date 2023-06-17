const { auth } = require('../middleware/auth');
const Problem=require('../model/ProblemModel');

const express=require('express');
const comment=async(req,res)=>{
    try{
        let problem=await Problem.findById(req.body.id);
        if(problem && req.body.comment){
               problem.reply.push({
                userId:req.body.userId,
                name:req.body.user_name,
                comment:req.body.comment
               })
               problem =await problem.save();
                res.status(201).json({
                    problem,
                    success:true,
                    message:"commented Succesfully"
                })
        }else{
            res.status(404).json({
                success:true,
                message:"doesnot get comment"
            })
        }
    }catch(err){
        
res.status(500).json({
    err,
    success:false,
    message:"something went wrong try after sometime"
})
}
}
const displayComment=async(req,res)=>{
    try{
        const problem=await Problem.findById(req.body.id);
        const reply=problem.reply
        if(problem){
              
                res.status(201).json({
                    reply,
                    success:true,
                    message:"comment display Succesfully"
                })
        }else{
            res.status(404).json({
                success:true,
                message:"doesnot get comment"
            })
        }
    }catch(err){
        
res.status(500).json({
    err,
    success:false,
    message:"something went wrong try after sometime"
})
}
}
const router=express.Router();
router.route('/problem/comment').post(auth,comment);
router.route('/problem/display/comment').post(displayComment);
module.exports=router;