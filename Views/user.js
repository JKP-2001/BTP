import { createUser } from "../Controllers/userController.js";

import dotenv from "dotenv";
dotenv.config();

import express from "express";
const router = express.Router();

router.post("/createuser", createUser);

const User = router;
export default User;