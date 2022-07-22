const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "please tell us your name"]
    },
    email : {
        type : String,
        required : [true, "please tell us your email"],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, "please provide a valid email"]
    },
    photo : String,
    password : {
        type : String,
        required : [true, "please tell us your password"],
        minLength : 7,
    },
    passwordConfirm : {
        type : String,
        required : [true, "please confirm your password"],
        // this only works when we create and save the request data
        validate : {
            validator :  function(el){
                return el === this.password
            },
            message : "Password are not the same"
        }
    }
},
{
    timestamps : true,
    versionKey : false,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    var hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.comaprepass = function (password, userPassword) {
    return bcrypt.compare(password, userPassword);
  };
module.exports = mongoose.model("User" , userSchema);