import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET;

const saltRounds = 10;

import User from "../Models/User.js";

import { google } from 'googleapis';
import Student from "../Models/Student.js";



const oAuthClient = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuthClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })




async function sendEmail(email, body, subject) {

    try {
        const accessToken = await oAuthClient.getAccessToken();
        // console.log("access token =",accessToken);
        var transporter = nodemailer.createTransport({        // function to send mail to register user
            service: 'gmail',     // mail sending platform
            auth: {
                type: 'OAuth2',
                user: 'innovatorsolx@gmail.com',    // Sender Mail Address
                pass: process.env.EMAIL_PASSWORD,   // Sender Mail Password
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        var mailOptions = {
            from: 'innovatorsolx@gmail.com',             // Sender Email
            to: email,                             // Email requested by user
            subject: subject,         // Subject Of The Mail
            text: body,
            //Custom Mail Message With the link to confirm email address (The link contain the user id and token corresponding)
        };


        transporter.sendMail(mailOptions, function (error, info, req, res) {  // Reciving Conformation Of Sent Mail
            if (error) {
                console.log({ error });
            } else {
                console.log("Success");
            }
        });


    } catch (err) {
        console.log("err = ", err);
    }



}


const createUser = async (req, res) => {
    const email = req.body.email;

    const isExist = await User.findOne({ email: email });
    const isStud = await Student.findOne({ email: email });

    if (isExist || isStud) {
        res.status(400).send("Email Already Exisited ");
    }
    else {
        const token2 = jwt.sign({                           // Create A JWT with the payload and the JWT_SECRET
            data: {
                name: req.body.name,
                email: req.body.email,
            }
        }, JWT_SECRET);

        const body = `Hello ${req.body.name}, Thank you for showing intrest in https://campus-olx.in . To finish signing up, you just need to confirm your email by clicking the link below.\n\nhttp://localhost:3000/set-password/${token2} `
        const email = req.body.email;
        const subject = 'Email Confirmation Mail'
        sendEmail(email, body, subject)
        res.status(200).send("Email Sent SuccessFully")
    }
}

const confirmEmail = async (req, res) => {



    const token2 = req.params.token;               // Recive token from url parameter
    const user = jwt.verify(token2, JWT_SECRET);   // decode token in recived for retreiving the information.
    const token = jwt.sign({ user: { id: user.data.email, role: "prof" } }, JWT_SECRET);   // Create A JWT with the payload and the JWT_SECRET for user id.

    let usexr = await User.findOne({ email: user.data.email });

    if (usexr) {
        res.status(400).json({ "msg": "User Already Existed" });

    }
    else {
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {            // Helps to hash password 

            if (err) {
                res.status(401).json({ "msg": "Error" });       // If any error then send error
            }

            const users = await User.create({           // Create User and save user in the Database
                name: user.data.name,
                email: user.data.email,
                password: hash,
                token: token,
                id: user.data.email,
            });
            res.status(200).json({ "msg": token })
            // In the response sent the token.

        })
    }
}


const login = async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
        res.status(402).send({ err: "User Not Exisited" });
    }
    else if (user.is_banned) {
        res.status(401).send({ err: "Banned" });
    }
    else {
        const token = jwt.sign({ user: { id: user.email, role: "prof" } }, JWT_SECRET);   // Create A JWT with the payload and the JWT_SECRET for user id.
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                res.status(200).send({ token: token });
            }
            else {
                res.status(403).send({ msg: "Invalid password" });
            }
        })
    }
}


const resetPassword = async (req, res) => {

    const isStud = await Student.findOne({ email: req.body.email });

    if (isStud) {
        res.status(404).send("Cannot Change Password For This Email");
    }
    else {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send({ "msg": "User Not Exisited" });
        }
        else {

            const body = `Hello ${user.name}, Somebody requested a new password for the https://campus-olx.com account associated with ${user.email}.\n\n No changes have been made to your account yet.\n\nYou can reset your password by clicking the link below:\nhttp://localhost:3000/reset-set-password/${user.email}/${user.token}  \n\nIf you did not request a new password, please let us know immediately by replying to this email.\n\n Yours, \nThe Campus Olx Team`
            const email = req.body.email;
            const subject = 'Password Change Request'
            sendEmail(email, body, subject)
            res.send("Email Sent SuccessFully")
        }
    }
}


const resettingPassword = async (req, res) => {

    const token = req.params.token;
    const email = req.params.email;
    const m = await User.findOne({ email: email });


    try {
        const decode = jwt.verify(token, m.seckey);

        const user = await User.findOne({ email: decode.user.id });
        if (!user) {
            res.status(400).send("User Doesn't Exists");
        }

        else {
            const seckey = user.seckey + req.body.password;
            const newtoken = jwt.sign({ user: { id: user.email } }, seckey);
            bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
                if (err) {
                    res.status(400).send({ err })
                }
                else {
                    const x = await User.findByIdAndUpdate(user._id, { password: hash, token: newtoken, seckey: seckey });
                    res.status(200).send({ msg: "Password Reset Successfully" })
                }
            })
        }
    } catch (err) {
        res.status(404).send("Link Expired");
    }
}


export { createUser, confirmEmail, login, resetPassword, resettingPassword };