const { auth } = require('../middleware/auth');
const Solution=require('../model/solutionModel');

const express=require('express');



const router=express.Router();
// Posting solution here 
const postSolution=async(req,res)=>{
    try{
        
        const solution= await Solution.create(req.body);
        res.status(201).json({
            solution,
            success:true,
            message:"Solution successfully submitted"
        })
    }catch(err){
res.status(404).json({
    err,
    success:false
})
}
}

router.route('/solution').post(auth,postSolution);


// getting all solution

const getAllSolution=async(req,res)=>{
    try{
        
        const solution= await Solution.find({problemId:req.body.id});
        // console.log(solution);
        res.status(201).json({
            solution,
            success:true,
        })
    }catch(err){
        res.status(404).json({
            err,
            success:false,
            message:"Something went wrong"
})
}
}

router.route('/get/All/solution').post(auth,getAllSolution);

// gettting only user Solution 



const getMySolution=async(req,res)=>{
    try{
        
        const solution= await Solution.find({problemId:req.body.id,userId:req.body.userId});
        // console.log(solution);
        res.status(201).json({
            solution,
            success:true,
        })
    }catch(err){
        res.status(404).json({
            err,
            success:false,
            message:"Something went wrong"
        })
    }
}

router.route('/get/mysolution').post(auth,getMySolution);
// for upvoting 

const upvoteState=async(req,res)=>{
   try{
    let solution= await Solution.findById(req.body.id);
    let total= solution.upvote?solution.upvote.length:0;
    let state=false;
  
    if( req.body.userId && solution.upvote){
        solution.upvote=solution.upvote.filter(e=>e.userId!=req.body.userId);
    }
   
    if(req.body.userId &&  solution.upvote && total!=solution.upvote.length){
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

router.route('/solution/upvote').post(upvoteState);





// update Upvote state 
const updateUpvote=async(req,res)=>{
    try{
        
        let solution=await Solution.findById(req.body.id);
        let size=solution.upvote?solution.upvote.length:0;
        if(solution.userId==req.body.userId){
            res.status(201).json({
                total:size,
                state:false,
                success:true,
                message:"You cannot Upvote in You posted Solution"

            })
            return ;
        }
        if(solution.upvote){
            solution.upvote=solution.upvote.filter(e=>e.userId!=req.body.userId);

        }
      
        let state=false;
         if(size==solution.upvote.length){
            solution.upvote.push({userId:req.body.userId});
            state=true;
        }
        solution=await solution.save();
        const total=solution.upvote.length;
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
router.route('/solution/new/upvote').post(auth,updateUpvote);





// profile data -->
const profileSolution=async(req,res)=>{
    try{
        let user=await Solution.find({userId:req.body.userId});
        let array=[];
        let solutionD={};
        const solution=user.length;
        let upvote=0;
        for( let i=0;i<user.length;i++){
            const date=new Date(user[i].createdAt);
            const s=date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
            if(!solutionD.hasOwnProperty(s)){
                array.push(s);
                solutionD[s]=0;
            }
            solutionD[s]++;
            
            upvote+=user[i].upvote?user[i].upvote.length:0;   
        }
        res.status(200).json({
            Totalsolution:solution,
            time:array,
            coins:upvote,
            solutionD,
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

router.route('/solution/profile').post(auth,profileSolution);










const comment=async(req,res)=>{
    try{
        let solution=await Solution.findById(req.body.id);
        if(solution && req.body.comment){
               solution.reply.push({
                userId:req.body.userId,
                name:req.body.user_name,
                comment:req.body.comment
               })
               solution =await solution.save();
                res.status(201).json({
                    solution,
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
        const solution=await Solution.findById(req.body.id);
        const reply=solution.reply
        if(solution){
              
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

router.route('/solution/comment').post(auth,comment);
router.route('/solution/display/comment').post(displayComment)






// ranking solution 

const solutionRank=async(req,res)=>{
    try{
        const solution=await Solution.find({});
        map={};
        for(let i=0;i<solution.length;i++){
            if(!map[solution[i].userId]){
                map[solution[i].userId]=0;
            }
            map[solution[i].userId]=map[solution[i].userId]+(solution[i].upvote?solution[i].upvote.length:0);
        }
      
        const sortedValues = Object.keys(map).sort((a, b) => map[a] - map[b]);
        let totalUser=sortedValues.length;
        let rank=totalUser;
        a=true;
        for(let i=0;i<sortedValues.length;i++){
          if(sortedValues[i]==req.body.userId){
            // console.log(i);
            rank-=i;
            a=false;
            break;
          }
        }
        if(a){
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
router.route('/solution/rank/profile').post(solutionRank);

module.exports=router;