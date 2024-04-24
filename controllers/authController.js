const User=require('../models/User');
const jwt=require('jsonwebtoken');
require("dotenv").config();

const errorHandler=(err)=>{
    const errors={email:"",password:""};
    if(err.message.includes("User validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message
        })
    }
    if(err.message=='incorrect email'){
        errors.email="this email is not registered"
    }
    if(err.message=='incorrect password')
        errors.password="this password is incorrect"
    if(err.code===11000)
        errors.email="This Email Is Already Exist"
    return errors;
}
const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},process.env.SECRET_TOKEN,{expiresIn:maxAge})
}
const signup_get=(req,res)=>{
    res.render('signup');
}

const login_get=(req,res)=>{
    res.render('login');
}

const signup_post=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await User.create({email,password});
        const token=createToken(user._id)
        res.cookie("jwt",token,{httpOnly:true,maxAge:maxAge*1000})
        res.status(201).json(user._id);
    } catch (error) {
        const errors=errorHandler(error)
        res.status(400).json({errors})
    }
}

const login_post=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await User.login(email,password)
        const token=createToken(user);
        res.cookie("jwt",token,{httpOnly:true,maxAge:maxAge*1000})
        res.status(200).json({user:user._id})
    } catch (error) {
        const errors=errorHandler(error);
        res.status(404).json({errors});
    }
}

const logout_get=(req,res)=>{
    res.cookie("jwt","",{maxAge:1});
    res.redirect("/")
}
module.exports={
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
}