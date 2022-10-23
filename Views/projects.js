import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { deleteProject, deselectProject,  getAllItems, getOwnerDeltails, getPostedProjects, newproject, selectProject, updateProjectDetails, downLoadDetails } from "../Controllers/projectController.js";
const router = express.Router();

import fetchuser from "../Middlewares/fetchuser.js";
import fetchstudent from "../Middlewares/fetchstudent.js"

router.post("/newproject",fetchuser,newproject);
router.patch("/updateproject/:id",fetchuser,updateProjectDetails);
router.delete("/deleteproject/:id",fetchuser,deleteProject);
router.get("/ownerdetails/:id",getOwnerDeltails);
router.get("/allprojects",getAllItems);
router.get("/projectaddition/:id/:email",fetchstudent,selectProject);
router.get("/deselectproject/:id",fetchstudent,deselectProject)
router.get("/projectsposted",fetchuser,getPostedProjects)
router.get("/intrestedpeople/:email",downLoadDetails);

const project = router

export default project;