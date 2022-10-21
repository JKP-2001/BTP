import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import Student from "../Models/Student.js";
import jwt from "jsonwebtoken"

import passport from "passport";

import passportMicrosoft from "passport-microsoft";

import Project from "../Models/Project.js";

const MicrosoftStrategy = passportMicrosoft.Strategy;

const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET;







passport.use(new MicrosoftStrategy({
    clientID: process.env.MS_CLIENT_ID,
    clientSecret: process.env.MS_CLIENT_VALUE,
    callbackURL: "http://localhost:5000/auth/microsoft/callback",
    scope: ['user.read'],
    tenant: 'common',
    authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  },
  async function(accessToken, refreshToken, profile, done) {
    const email = profile._json.mail;
    const student = await Student.findOne({email:email}).select("-seckey -token");
    // const token = jwt.sign({ user: { id: profile._json.mail, role:"stud" } }, JWT_SECRET);
    if(!student){
      const newStudent = await Student.create({
        name:profile._json.givenName,
        email:profile._json.mail,
        rollNum:profile._json.surname,

      })
      const student = await Student.findOne({email:email}).select("-seckey -token");
      done(null,student);
    }
    else{
      done(null,student);
    }
    
  }
));


passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((user,done)=>{
  done(null,user);
})

 
router.get("/ms/login",(req,res)=>{
  if(req.user){
    res.redirect("/")
  }
  else{
    res.redirect("/auth/microsoft")
  }
})

router.get('/auth/microsoft',
  passport.authenticate('microsoft', {
    prompt: 'select_account',
  }));

router.get('/auth/microsoft/callback', 
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

  const msRoute = router;
  export default msRoute;

  router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
// const 








