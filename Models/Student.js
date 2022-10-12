import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    contact:{type:String,required:true},
    rollNum:{type:String, required:true},
    projectName:{type:mongoose.Schema.Types.ObjectId},
    partner:{type:mongoose.Schema.Types.ObjectId},
    is_banned:{type:Boolean,required:true,default:false},
    is_admin:{type:Boolean,required:true,default:false},
    token:{type:String,required:true},
    seckey:{type:String,required:true,default:process.env.JWT_SECRET},
})

const Students = mongoose.model("Student",studentSchema);
export default Students;