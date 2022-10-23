import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    rollNum:{type:String, required:true},
    projectName:{type:mongoose.Schema.Types.ObjectId, default:"000000000000000000000000"},
    partner:{type:mongoose.Schema.Types.ObjectId, default:"000000000000000000000000"},
    is_banned:{type:Boolean,required:true,default:false},
    is_admin:{type:Boolean,required:true,default:false},
    token:{type:String,required:true,default:"null"},
    seckey:{type:String,required:true,default:process.env.JWT_SECRET},
    role:{type:String,required:true,default:"stud"},
    project_name:{type:String,default:""},
    partner_name:{type:String,default:""}
})

const Student = mongoose.model("Student",studentSchema);
export default Student;