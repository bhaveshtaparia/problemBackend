const { auth } = require('../middleware/auth');
const Problem=require('../model/ProblemModel');

const express=require('express');
const historyProblem=async(req,res)=>{
    try{
        if(req.body.id){

            const problem= await Problem.find({id:req.body.id});
            res.status(201).json({
                problem,
                success:true,
                message:"Check problem"
            })
        }else{
            res.status(201).json({
                success:true,
                message:"Please Login First"
            })
        }
    }catch(err){
res.status(404).json({
    err,
    success:false,
    message:"No Promblem Found"
})
}
}
const router=express.Router();
router.route('/problem/history').post(auth,historyProblem);
module.exports=router;