import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Project from "../Models/Project.js";
import Student from "../Models/Student.js";
import User from "../Models/User.js";
// import User from "../Models/User.js";

import XLSX from "xlsx";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const extract_projects = async (projects_array) => {
    var projects = [];

    for (var i = 0; i < projects_array.length; i++) {
        let project = await Project.findById(projects_array[i]).select("-password -token -seckey").lean();;
        projects.push(project);
    }

    return projects;
}


const intrestedPeople = async (arrayOfProjects) => {
    var result = [];

    for (let i = 0; i < arrayOfProjects.length; i++) {
        const project = await Project.findById(arrayOfProjects[i]);
        if (project) {
            for (let j = 0; j < 2; j++) {
                let people = await Student.findById(project.intrestedPeople[j]).select("-password -seckey -is_banned -is_admin -role -_id -projectName ");
                let people2 = await Student.findById(project.intrestedPeople[j]).select("-password -seckey -is_banned -is_admin -role -_id -projectName -partner -token -__v");
                const partner = await Student.findById(people.partner);
                people2.partner_name = partner.name;
                people2.project_name = project.title;
                result.push(people2);
            }
        }
    }

    return result;
}

const newproject = async (req, res) => {

    const user_email = req.user.id;

    const isvaliD = await User.findOne({ email: user_email });

    if (!isvaliD) {
        res.status(400).json({ msg: "Not Allowed" });
    }

    else {
        var today = new Date();
        const d = new Date();


        function addZero(i) {
            if (i < 10) { i = "0" + i }
            return i;
        }


        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
        let s = addZero(d.getSeconds());
        let time = h + ":" + m + ":" + s;
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var full = (today.getMonth() + 1) + " " + today.getDate() + ", " + today.getFullYear() + " " + time;
        let co_supervisor = "";
        if (req.body.co_supervisor) {
            co_supervisor = req.body.co_supervisor;
        }

        const newItem = await Project.create({
            title: req.body.title,
            brief_abstract: req.body.brief_abstract,
            co_supervisor: co_supervisor,
            specialization: req.body.specialization,
            ownerDetails: isvaliD._id,
            creation_date: date,
            creation_time: time,
            updation_date: "",
            updation_time: "",
            getfull: full,
        })

        const addProject = await User.findByIdAndUpdate(isvaliD._id, { $push: { projects_posted: newItem._id } })   // Push the intrestedPeople array in the Items.

        res.status(200).json({ msg: "Success" });
    }

}


const updateProjectDetails = async (req, res) => {
    const project_id = req.params.id;
    const isProject = await Project.findById(project_id);

    if (!isProject) {
        res.status(400).json({ "msg": "failure" });
    }

    else {
        const user = req.user.id;
        const isUser = await User.findOne({ email: user });

        if (!isUser) {
            res.status(401).json({ msg: "User Not Exist" });
        }

        else if (String(isProject.ownerDetails) !== String(isUser._id)) {               // If Item found but doesn't belongs to the logged in user.
            res.status(403).send("This Item Doesn't Belongs This You.");
        }
        else {
            let title = isProject.title;
            let brief_abstract = isProject.brief_abstract;
            let co_supervisor = "";
            let specialization = isProject.specialization;

            if (isProject.co_supervisor) {
                co_supervisor = isProject.co_supervisor;
            }


            if (req.body.title) {
                title = req.body.title;
            }
            if (req.body.brief_abstract) {
                brief_abstract = req.body.brief_abstract
            }
            if (req.body.co_supervisor) {
                co_supervisor = req.body.co_supervisor;
            }
            if (req.body.specialization) {
                specialization = req.body.specialization;
            }

            var today = new Date();
            const d = new Date();


            function addZero(i) {
                if (i < 10) { i = "0" + i }
                return i;
            }


            let h = addZero(d.getHours());
            let m = addZero(d.getMinutes());
            let s = addZero(d.getSeconds());
            let time = h + ":" + m + ":" + s;
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            var full = (today.getMonth() + 1) + " " + today.getDate() + ", " + today.getFullYear() + " " + time;

            let updation_date = date;
            let updation_time = time;

            const updation_project = await Project.findByIdAndUpdate(isProject._id, {
                title: title,
                brief_abstract: brief_abstract,
                co_supervisor: co_supervisor,
                specialization: specialization,
                updation_date: updation_date,
                updation_time: updation_time,
            })

            res.status(200).json({ msg: "success" });
        }

    }
}



const deleteProject = async (req, res) => {
    const user = await User.findOne({ email: req.user.id });
    const pId = req.params.id;
    const project = await Project.findById(pId);

    if (!project) {
        res.status(404).json({ msg: "Not Found" });
    }
    else if (String(project.ownerDetails) !== String(user._id)) {               // If Item found but doesn't belongs to the logged in user.
        res.status(403).send("This Item Doesn't Belongs This You.");
    }

    else {

        if (project.intrestedPeople.length !== 0) {
            const partner = await Student.findById(project.intrestedPeople[0]);
            const deltostudu1 = await Student.findByIdAndUpdate(project.intrestedPeople[0], { projectName: "000000000000000000000000", partner: "000000000000000000000000" })
            const deltostudu2 = await Student.findByIdAndUpdate(project.intrestedPeople[1], { projectName: "000000000000000000000000", partner: "000000000000000000000000" })
            const deltointrestedpeople = await Project.findByIdAndUpdate(project._id, { $pull: { intrestedPeople: user._id } })
            const deltointrestedpeople2 = await Project.findByIdAndUpdate(project._id, { $pull: { intrestedPeople: partner._id } })
        }

        const isDeleted = await Project.findByIdAndDelete(pId);
        const delProject = await User.findByIdAndUpdate(user._id, { $pull: { projects_posted: project._id } })   // Push the intrestedPeople array in the Items.
        res.status(200).json({ msg: "Success" });



    }
}

const getOwnerDeltails = async (req, res) => {
    const id = req.params.id;

    const project = await Project.findById(id);

    if (!project) {
        res.status(404).json({ msg: "Not Found" });
    }

    else {
        const user = await User.findById(project.ownerDetails);
        if (!user) {
            res.status(403).json({ msg: "Owner Not Found" });
        }
        else {
            res.status(200).json(user);
        }
    }
}


const getAllItems = async (req, res) => {
    const projects = await Project.find();
    res.status(200).json(projects);
}


const selectProject = async (req, res) => {
    const pId = req.params.id;
    const project = await Project.findById(pId);

    const partner_email = req.params.email;

    if (!req.params.email) {
        res.status(350).json({ "msg": "Please Select A Partner" })
    }

    if (project.intrestedPeople.length !== 0) {
        res.status(400).json({ msg: "Projected Already Alloted." });
    }


    else {
        const user = req.user;
        const User = await Student.findById(user._id);
        const other_user = partner_email;
        const isValidUser = await Student.findOne({ email: other_user });

        if (String(User.projectName) !== ("000000000000000000000000")) {
            res.status(401).json({ msg: "Project Already Alloted To You." })
        }
        else if (isValidUser) {
            if (String(isValidUser.projectName) !== "000000000000000000000000") {
                res.status(401).json({ msg: "Project Already Alloted To Partner." })
            }
            else {

                const addtostudu1 = await Student.findByIdAndUpdate(user._id, { projectName: project._id, partner: isValidUser._id })
                const addtostudu2 = await Student.findByIdAndUpdate(isValidUser._id, { projectName: project._id, partner: user._id })
                const addtointrestedpeople = await Project.findByIdAndUpdate(project._id, { $push: { intrestedPeople: user._id } })
                const addtointrestedpeople2 = await Project.findByIdAndUpdate(project._id, { $push: { intrestedPeople: isValidUser._id } })
                res.status(200).json({ msg: "Success" });
            }
        }
        else {
            res.status(403).json({ msg: "Partner Not Exists" });
        }

    }
}

const deselectProject = async (req, res) => {

    const pId = req.params.id;
    const project = await Project.findById(pId);

    if (project) {
        if (project.intrestedPeople.length === 0) {
            res.status(400).json({ msg: "No Project Alloted Yet." });
        }


        else {
            const User = req.user;
            const user = await Student.findById(User._id)



            if (String(user.projectName) !== String(project._id)) {
                res.status(401).json({ msg: "This Project is not alloted to you." })
            }


            else {
                const partner = await Student.findById(user.partner);
                const deltostudu1 = await Student.findByIdAndUpdate(user._id, { projectName: "000000000000000000000000", partner: "000000000000000000000000" })
                const deltostudu2 = await Student.findByIdAndUpdate(partner._id, { projectName: "000000000000000000000000", partner: "000000000000000000000000" })
                const deltointrestedpeople = await Project.findByIdAndUpdate(project._id, { $pull: { intrestedPeople: user._id } })
                const deltointrestedpeople2 = await Project.findByIdAndUpdate(project._id, { $pull: { intrestedPeople: partner._id } })
                res.status(200).json({ msg: "Success" });
            }


        }
    }

    else{
        res.status(405).json({msg:"Failure"});
    }


}


const getPostedProjects = async (req, res) => {
    const email = req.user.id;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(200).json({ msg: "User Not Found" });
    }

    else {
        const projects = user.projects_posted;
        const projects_array = await extract_projects(projects);
        res.status(200).json(projects_array);
    }
}



const downLoadDetails = async (req, res, next) => {
    var wb = XLSX.utils.book_new();
    const user = req.params.email;
    const isValidUser = await User.findOne({ email: user });

    const arrayOfProjects = isValidUser.projects_posted;


    var details = await intrestedPeople(arrayOfProjects);
    var temp = JSON.stringify(details);
    temp = JSON.parse(temp);
    var ws = XLSX.utils.json_to_sheet(temp);

    var down = __dirname + `/public/student_data.xlsx`;
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, down);
    res.download(down);
    // res.status(200).send(details);
}




export { newproject, updateProjectDetails, deleteProject, getOwnerDeltails, getAllItems, selectProject, deselectProject, getPostedProjects, downLoadDetails };