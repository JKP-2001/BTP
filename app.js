import dotenv from "dotenv"
dotenv.config();

import passport from "passport";

import cors from "cors";

import express from "express";
import User from "./Views/user.js";
import msRoute from "./Controllers/studentLoginController.js";

import sessions from "express-session";
import cookieParser from "cookie-parser";

import cokkieSession from "cookie-session";

import student from "./Views/student.js";
import project from "./Views/projects.js";


const app = express();

app.use(express.json());

import mongoose from "mongoose";


const url = "mongodb+srv://jkp6957:"+process.env.mongopass+"@cluster0.ncrzato.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url);

app.use("/user",User);


const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));



app.use(passport.initialize());
app.use(passport.session());

app.use("",msRoute);
app.use("/student",student)
app.use("/project",project);

app.get("/",(req,res)=>{
    if(req.user){
        res.send(req.user);   
    }
    else{
        res.send("Hey");
    }
})


app.use(cors({
    origin: 'http://localhost:5000'
}))



app.listen(5000,(req,res,err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Server listening on PORT ",5000);
    }
})