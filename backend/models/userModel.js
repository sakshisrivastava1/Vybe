import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
      name:{
        type:String,
        required:true,
        trim:true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },    
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String
    },
    followers:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'
    }],
    following:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'
    }],
    bio:{
        type:String
    },
    profession:{
        type:String
    },
    gender:{
        type:String,
        enum:['male','female']
    },
    posts:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Post'
    }],
    savedPosts:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Post'
    }],
    loops:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Loop'
    }],
    story:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Story'
    }],
    resetOtp:{
        type:String
    },
    otpExpires:{
        type:Date
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    }
       
},{timestamps:true,minimize:false})


export default mongoose.model('User',userSchema)