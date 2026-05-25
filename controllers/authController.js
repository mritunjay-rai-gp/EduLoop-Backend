const bcrypt = require('bcrypt');
const generateToken= require('../utils/generateToken');
const User = require('../models/userModel');
const mailSender = require('../utils/mailSender');
module.exports.registerUser = async function (req, res) {
    try {

        const { fullName, email, phoneNumber, password } = req.body;

        // Check existing user
        let existingUser = await User.findOne({ email });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // If verified user already exists
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // If user exists but not verified
        if (existingUser && !existingUser.isVerified) {

            existingUser.otp = otp;
            existingUser.otpExpires = Date.now() + 5 * 60 * 1000;

            await existingUser.save();

            return res.status(200).json({
                message: "OTP resent successfully"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 5 * 60 * 1000,
        });
        await mailSender(
          user.email,
          "Verify your EduLoop account 🔐",
          `
          <div style="font-family:Arial;padding:20px">
           <h2>Welcome to EduLoop 📖</h2>
           <p>Your OTP for account verification is:</p>
           <h1 style="background:#ffb996;padding:10px;width:130px;text-align:center">
             ${otp}
           </h1>
           <p>This OTP will expire in <b>5 minutes</b>.</p>
           <p>Thank you for using EduLoop.<br/><b>EduLoop Team</b></p>
          </div>
          `
       );
        res.status(201).json({
            message: "User registered successfully",
            user,
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};
module.exports.loginUser= async function(req,res){
    try{
        let {email,password} = req.body
        let user = await User.findOne({email})
        if(!user) return res.send("Email or password is not correct");
        if (!user.isVerified) return res.send("User is not verified");
        bcrypt.compare(password,user.password,function(err,result){
            if(result){
                let token = generateToken(user)
                res.cookie("token",token,{httpOnly:true})
                return res.status(200).json({

   message:"Login Successfully",

   token,

   user
});
            }else{
                return res.status(400).json({message:"Invalid credentials"})
            }
        })
    } catch(error){
         res.status(500).json({message:"Something went wrong"})
    }
    
};
module.exports.logoutUser = async function (req, res) {
    try {

        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Something went wrong"
        });

    }
};
module.exports.verifyUser = async function(req,res){
    try{
        const{userId,otp}= req.body;
        const user = await User.findById(userId);
        if(!user) return res.send("User not found");
        if(user.otp!==otp|| user.otpExpires<Date.now()){
            return res.status(400).json({message:"Invalid or expire otp"})
        };
        user.otp = undefined;
        user.otpExpires= undefined;
        user.isVerified = true;
        await user.save();
        return res.status(200).json({message:"Otp verified"})
    } catch (error){
        res.status(500).json({error:error.message})
    }
}
module.exports.getProfile = async function(req,res){
    try{
        const user = await User.findById(req.params.id)
        .select(
            "-password -otp -otpExpires"
        );
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        return res.status(200).json(user);
    } catch(error){
        return res.status(500).json({
            error:error.message
        });
    }
};
module.exports.deleteAccount = async function(req,res){
    try{
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        await user.deleteOne();
        res.clearCookie("token");
        return res.status(200).json({
            message:"Account deleted successfully"
        });
    } catch(error){
        return res.status(500).json({
            error:error.message
        });
    }
};