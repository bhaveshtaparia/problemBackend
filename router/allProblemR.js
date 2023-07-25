const { auth } = require('../middleware/auth');
const Problem=require('../model/ProblemModel');

const express=require('express');
const allProblem=async(req,res)=>{
    try{
    
            const problem= await Problem.find({title:{ $regex: req.body.title, $options: 'i' }});
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
router.route('/problem/allproblem').post(allProblem);


// for upvoting 

const upvoteState=async(req,res)=>{
   try{
    let problem= await Problem.findById(req.body._id);
    let total= problem.upvote?problem.upvote.length:0;
    let state=false;
    if( req.body.userId && problem.upvote){
        problem.upvote=problem.upvote.filter(e=>e.userId!=req.body.userId);
    }
    if(req.body.userId && total!==problem.upvote.length ){
        state=true;
    }
    res.status(200).json({
        total,
        state
    })
   }catch(err){
    console.log(err)
     res.status(404).json({
        message:"something went wrong"
     })
    }
}

router.route('/problem/upvote').post(upvoteState);





// update Upvote state 
const updateUpvote=async(req,res)=>{
    try{
        
        let problem=await Problem.findById(req.body._id);
        let size=problem.upvote?problem.upvote.length:0;
        if(problem.id==req.body.userId){
            res.status(201).json({
                total:size,
                state:false,
                success:true,
                message:"You cannot Upvote in You posted Problem"

            })
            return ;
        }
        if(problem.upvote){
            problem.upvote=problem.upvote.filter(e=>e.userId!=req.body.userId);

        }
        let state=false;
         if(!problem.upvote || size===problem.upvote.length){
            const array=problem.upvote || [];
            array.push({userId:req.body.userId});
            problem.upvote=array;
            state=true;
        }
        problem=await problem.save(); 
        const total=problem.upvote.length;
        res.status(200).json({
            total,
            state,
            success:true
        })
    }catch(err){
    res.status(404).json({
        success:false,
        message:"something went wrong"
    })
    console.log(err);
}
}
router.route('/problem/new/upvote').post(auth,updateUpvote);





// profile data -->
const profileProblem=async(req,res)=>{
    try{
        let user=await Problem.find({id:req.body.userId});
        let array=[];
        let problemD={};
        const problem=user.length;
        let upvote=0;
        for( let i=0;i<user.length;i++){
            const date=new Date(user[i].createdAt);
            const s=date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
            if(!problemD.hasOwnProperty(s)){
                array.push(s);
                problemD[s]=0;
            }
            problemD[s]++;
            
            upvote+=user[i].upvote?user[i].upvote.length:0;   
        }
        res.status(200).json({
            Totalproblem:problem,
            time:array,
            coins:upvote,
            problemD,
            success:true
        })
    }catch(err){
        res.status(200).json({
            success:false,
            message:"someThing went wrong"         
        })
        console.log(err);
    }
}


const idvalid=async(req,res)=>{
    try{
     const problem=await Problem.findById(req.body.id);
     if(problem){
         res.status(201).json({
             id:true
            })
        }else{
            res.status(201).json({
                id:false
            })
            
        }
    }catch(err){
        res.status(404).json({
            message:"something went wrong",
            id:false
        })
    }
}

router.route('/id').post(auth,idvalid);
router.route('/problem/profile').post(auth,profileProblem);


/// ranking problem 
const problemRank=async(req,res)=>{
    try{
        const problem=await Problem.find({});
        map={};
        for(let i=0;i<problem.length;i++){
            if(!map[problem[i].id]){
                map[problem[i].id]=0;
            }
            map[problem[i].id]=map[problem[i].id]+(problem[i].upvote?problem[i].upvote.length:0);
        }
      
        const sortedValues = Object.keys(map).sort((a, b) => map[a] - map[b]);
        let totalUser=sortedValues.length;
        let rank=totalUser;
        a=true;
        for(let i=0;i<sortedValues.length;i++){
          if(sortedValues[i]==req.body.id){
           
            rank-=i;
            a=false;
            break;
          }
        }
        if(a==true){
            rank++;
        }
        res.status(200).json({
            rank,totalUser
        })
    }catch(err){
        console.log(err);
        res.status(404).json({
            message:"something went wrong",
            id:false
        })
    }
}
router.route('/problem/rank/profile').post(problemRank);










module.exports=router;