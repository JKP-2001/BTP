import dotenv from "dotenv"
dotenv.config();

import express from "express";
const app = express();

app.use(express.json());


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