const { auth } = require('../middleware/auth');
const Problem=require('../model/ProblemModel');

const express=require('express');
const postProblem=async(req,res)=>{
    try{
        
        const problem= await Problem.create(req.body);
        res.status(201).json({
            problem,
            success:true,
            message:"problem successfully submitted"
        })
    }catch(err){
res.status(404).json({
    err,
    success:false
})
}
}
const router=express.Router();
router.route('/problem').post(auth,postProblem);
module.exports=router;