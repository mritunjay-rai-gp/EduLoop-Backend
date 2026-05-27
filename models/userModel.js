const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    fullName:{
        type: String,
        trim: true,
        required:true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default: "user",
    },
    otp:{
        type: String,
    },
    otpExpires:{
        type: Date,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    profilePic:{
        type: String,
        default: "",
    },
    registrationNumber:{
        type:String,
        unique:true,
        required:true,
    },
    bio:{
        type:String,
        maxlength:200,
        default:"",
    },
    course:{
        type:String,
        default:"",
    },
    branch:{
        type:String,
        default:"",
    },
    year:{
        type:Number,
        default:0,
    },
    semester:{
        type:Number,
        default:0,
    },

},{timestamps:true});
module.exports= mongoose.model('User',userSchema);