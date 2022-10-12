import dotenv from "dotenv"
dotenv.config();

import express from "express";
import User from "./Views/user.js";
const app = express();

app.use(express.json());

import mongoose from "mongoose";


const url = "mongodb+srv://jkp6957:Iamgoingin1@cluster0.ncrzato.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url);

app.use("/user",User);



app.get("/",(req,res)=>{
    res.send("BTP Allocator");
})

app.listen(5000,(req,res,err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Server listening on PORT ",5000);
    }
})