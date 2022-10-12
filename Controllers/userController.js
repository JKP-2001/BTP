import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

import User from "../Models/User.js";


// name:{type:String,required:true},
//     email:{type:String,required:true},
//     password:{type:String,required:true},
//     projects_posted:[{type:mongoose.Schema.Types.ObjectId,default:[]}],
//     is_banned:{type:Boolean,required:true,default:false},
//     is_admin:{type:Boolean,required:true,default:false},
//     token:{type:String,required:true},
//     seckey:{type:String,required:true,default:process.env.JWT_SECRET},


const createUser = async(req,res)=>{
    const email = req.body.email;
    
    const isExist = await User.findOne({email:email});

    if(isExist){
        res.status(400).send("Email Already Exisited");
    }
    else{
        bcrypt.hash(req.body.password,saltRounds, async (err,hashed)=>{
            if(err){
                res.status(401).send(err);
            }
            else{
                const newUser = await User.create({
                    name:req.body.name,
                    email:req.body.email,
                    password:hashed
                })

                res.status(200).send("Success");
            }
        })
    }
}

export {createUser};