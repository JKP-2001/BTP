import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    projects_posted:[{type:mongoose.Schema.Types.ObjectId,default:[]}],
    is_banned:{type:Boolean,required:true,default:false},
    is_admin:{type:Boolean,required:true,default:false},
    token:{type:String,default:"H"},
    // seckey:{type:String,required:true,default:process.env.JWT_SECRET},
})

const User = mongoose.model("User",userSchema);
export default User;