const { auth } = require('../middleware/auth');
const Problem=require('../model/ProblemModel');

const express=require('express');
const allProblem=async(req,res)=>{
    try{
    
            const problem= await Problem.find({});
            res.status(201).json({
                problem,
                success:true,
                message:"Check problem"
            })
        
    }catch(err){
res.status(404).json({
    err,
    success:false,
    message:"No Promblem Found"
})
}
}
const router=express.Router();
router.route('/problem/allproblem').get(allProblem);
module.exports=router;