import dotenv from "dotenv";
dotenv.config();

import express from "express";

const router = express.Router();

router.get("/login/success",(req,res)=>{
    if(req.user){
        res.json({
            message:"success",
            user:req.user
        })
    }
    else{
        res.json({
            message:"failure"
        })
    }
})

const student = router;
export default student;