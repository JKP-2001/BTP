

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {type:String,required:true},
    brief_abstract:{type:String,required:true},
    co_supervisor:{type:String},
    specialization:{type:String,required:true},
    ownerDetails:{type:mongoose.Schema.Types.ObjectId, default:"000000000000000000000000"},
    intrestedPeople:[{type:mongoose.Schema.Types.ObjectId,default:[]}],
    creation_date:{type:String,required:true},
    creation_time:{type:String,required:true},
    updation_date:{type:String,required:false},
    updation_time:{type:String,required:false},
    is_banned:{type:Boolean,required:true,default:false},
    getFull:{type:String},
})


const Projects = mongoose.model("Project",projectSchema);
export default Projects; 


