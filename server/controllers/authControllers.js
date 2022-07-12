require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("./catchAsync");


const signToken = (id) =>{
   return  jwt.sign({id}, process.env.JWT_SECRET);
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return reject(err);
  
        resolve(user);
      });
  
    });
  };


const register = catchAsync (async (req,res) => {
    let user = await User.findOne({ email: req.body.email }).lean().exec();
    if(user){
        return res.status(400).send({ message: "Please try another email or password" });
    }

    user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });

    const token = signToken(user._id)

    res.status(201).json({
        status : 'success',
        token,
        data : user
    })
});


const login = catchAsync (async (req,res) => {
    const {email , password} = req.body;

    if(!email || !password) {
        return res.status(400).json({message: 'Please provide your email or password'})
    }
    let user = await User.findOne({ email: req.body.email }).select('+password');

    if(!user || !(await user.comaprepass(password ,user.password))){
        return res.status(401).send({ message: "Incorrect email or password" });
    }

    const token = signToken(user._id);

    res.status(201).json({
        status : 'success',
        token,
        data : user
    })
})

const isAuthenticate = catchAsync(async (req,res,next) => {
    let token ;
    if(req.headers.authorization && req.headers.authorization.startswith('Bearer ')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return res.status(401).json({ message : "You are not authorize to access this resource"})
    }

    let decodedUser = await verifyToken(token);

    let user = await User.findById(decodedUser.id);

    if(!user){
        return res.status(401).json({ message : "Token is not authorized"})
    }

    req.user = user;
    next();
})

module.exports = {register, login};