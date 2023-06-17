const express=require('express');
const app=express();
const jwt=require('jsonwebtoken');
const user=require('../model/loginModel');
const cookieParser=require('cookie-parser')
app.use(cookieParser())
exports.auth=async(req,res,next)=>{
try{

    const tokens=req.cookies.token;
    // console.log(req);
    // console.log(req);
    if(!tokens){
        res.status(404).json({
            message:"Please Login to access the resource"
        })
        // return next(new Error("Please Login to access the resource"));
    }else{

        const decode=await jwt.verify(tokens,process.env.SECRETKEY)
        user.req=await user.findById(decode.id);
        next();
    }
}catch(err){
    return next(new Error("please Login First"));
}
}
// exports.methods=isAutenticated;