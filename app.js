const express=require('express');
const cors=require('cors')
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser')
const app=express();
app.use(cookieParser());
const dbconnection=require('./server');
const Signup=require('./router/singupR');
const Login=require('./router/loginR');
const Problem=require('./router/problemR');
const AllProblem=require('./router/allProblemR');
const History=require('./router/problemHistoryR');
const Logout=require('./router/logoutR');
const Comment=require('./router/commentR');
const bodyParser=require('body-parser');
dotenv.config({path:'./config.env'});
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json());
dbconnection();
app.get('/',(req,res)=>{
    res.send("working")
})
app.use(cors({
    origin:process.env.WEBLINK,
    credentials: true,
    methods:["GET","POST","DELETE","PUT"]
}));
app.use('/api/v1',Signup);
app.use('/api/v1',Login);
app.use('/api/v1',Problem);
app.use('/api/v1',Logout);
app.use('/api/v1',History);
app.use('/api/v1',AllProblem);
app.use('/api/v1',Comment);
app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`)
    console.log(`server is working on ${process.env.PORT} `)
})