import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {sendMail} from '../config/mail.js'

const cookieOptions = {
  httpOnly:true,
  sameSite:'none',
  secure:true,
  path:'/'
}

export const signup = async(req,res) =>{
   try {
     const {name,email,password,username} = req.body

     const findByEmail = await userModel.findOne({email})

     if(findByEmail){
       return res.status(400).json({success:false,message:'Email already exist!'})
     }

     const findByUsername = await userModel.findOne({username})

     if(findByUsername){
       return res.status(400).json({success:false,message:'Username already exist!'})
     }

     const hashedPassword = await bcrypt.hash(password,10)

     const user = await userModel.create({
        name,
        email,
        password:hashedPassword,
        username
     })

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY,{ expiresIn: '7d' })

     res.cookie("token",token,cookieOptions)

     return res.status(200).json(user)

   } catch (error) {
     console.log(error)
     return res.status(500).json({success:false,message:'Signup failed!'})
   }
}

export const login = async(req,res) =>{
   try {
     const {username,password} = req.body

     const user = await userModel.findOne({username})

     if(!user){
       return res.status(400).json({success:false,message:'User do not exist!'})
     }

     const isMatch = await bcrypt.compare(password,user.password)

     if(!isMatch){
        return res.status(400).json({success:false,message:'Incorrect Password!'})
     }

     const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY,{ expiresIn: '7d' })

     res.cookie("token",token,cookieOptions)

     return res.status(200).json(user)

   } catch (error) {
     console.log(error)
     return res.status(500).json({success:false,message:'Login failed!'})
   }
}

export const logout = async(req,res) =>{
    try {
      res.clearCookie("token",cookieOptions)

      return res.status(200).json({success:true,message:'Logout Successful!'})

    } catch (error) {
      console.log(error)
      return res.status(500).json({success:false,message:'Logout failed!'})
    }
}

export const sendOtp = async(req,res) =>{
  try {
     const {email} = req.body

     const user = await userModel.findOne({email})

     if(!user){
       return res.status(400).json({success:false,message:'USER DO NOT EXIST'})
     }

     const otp = Math.floor(1000 + Math.random() * 9000).toString()

     user.resetOtp = await bcrypt.hash(otp, 10);
     user.otpExpires = Date.now() + 5*60*1000
     user.isOtpVerified = false

     await user.save()
     await sendMail(email,otp)

     res.status(200).json({message:'OTP sent successfully',otp})

  } catch (error) {
     console.log(error)
     return res.status(500).json({message:`Reset otp error ${error}`})
  }
}

export const verifyOtp = async(req,res) =>{
    try {
     const {email,otp} = req.body

     if (!email || !otp) {
      return res.status(400).json({success: false,message: "Email and OTP are required"});
    }

     const user = await userModel.findOne({email})

     if (!user || !user.resetOtp || !user.otpExpires) {
       return res.status(400).json({success:false,message:'Invalid or expired OTP'})
     }

     if (user.otpExpires < Date.now()) {
      return res.status(400).json({success: false,message: "OTP has expired"})
     }

      const isOtpValid = await bcrypt.compare(String(otp), user.resetOtp)

    if (!isOtpValid) {
      return res.status(400).json({success: false,message: "Invalid OTP"})
    }
    
     user.isOtpVerified = true
     await user.save()

     res.status(200).json({message:'OTP verified successfully'})

  } catch (error) {
     console.log(error)
     return res.status(500).json({message:`Verify otp error ${error}`})
  }
}

export const resetPassword = async(req,res) =>{
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({message: "All fields are required"})
    }

    const user = await userModel.findOne({email})

    if(!user || !user.isOtpVerified ){
       return res.status(400).json({success:false,message:'OTP verification is required'})
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({success: false,message: "Passwords do not match"});
    }

    if (newPassword.length < 8) {
      return res.status(400).json({success: false,message: "Password must be at least 8 characters",});
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)

    user.password = hashedPassword
    user.isOtpVerified = false
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save()

   res.status(200).json({message:'Password changed successfully'})

  } catch (error) {
     console.log(error)
     return res.status(500).json({message:`Passwords match error ${error}`})
  }
}
