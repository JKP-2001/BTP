
import express from "express"
import Student from "../Models/Student.js"
import User from "../Models/User.js"

const checkIsStudent = (req,res,next)=>{
    
    if(req.user){
        if(req.user.role === "stud"){
            next();
        }
        else{
            res.status(400).send("Not Allowed");
        }
    }
    else{
        res.status(404).send("User Not Logged In")
    }
}

export default checkIsStudent;