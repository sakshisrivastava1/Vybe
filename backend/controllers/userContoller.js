import userModel from "../models/userModel.js"
 import { uploadOnCloudinary } from "../config/cloudinary.js"
 import notificationModel from '../models/notificationModel.js'
 import { getSocketId, io } from "../socket.js";

export const getUser = async(req,res) => {
  try {
    const userId = req.userId
    
    const user = await userModel.findById(userId)
    .select('-password')
    .populate('posts loops story savedPosts following followers')
    

    if(!user){
        return res.status(400).json({success:false,message:'getUser User not found!'})
    }

   return res.status(200).json(user)

   } catch (error) {
     console.log(error)
     return res.status(500).json({message:error.message})
   }
}

export const suggestedUsers = async (req, res) => {
  try {
    const currentUser = await userModel.findById(req.userId);

    const users = await userModel.aggregate([
      {
        $match: {
          _id: {
            $ne: currentUser._id,
            $nin: currentUser.following
          }
        }
      },
      {
        $project: {
          password: 0
        }
      }
    ]);

    return res.status(200).json(users);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suggested users"
    });
  }
}

export const editProfile = async (req, res) => {
  try {
    const { name, username, bio, gender, profession } = req.body

    const user = await userModel.findById(req.userId).select('-password')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const existingUser = await userModel.findOne({ username })

    if (existingUser && existingUser._id.toString() !== req.userId) {
      return res.status(400).json({success: false,message: 'Username already exists'})
    }

    if (req.file) {
      const profileImage = await uploadOnCloudinary(req.file.path)
      user.profileImage = profileImage
    }

    user.name = name
    user.username = username
    user.bio = bio
    user.gender = gender
    user.profession = profession

    await user.save()

    return res.status(200).json(user)

  } catch (error) {
    console.log('EDIT PROFILE ERROR:', error)
    return res.status(500).json({success: false,message: 'Profile updation failed'})
  }
}

export const getProfile = async(req,res) =>{
    try {
    const username = req.params.username
    const user = await userModel.find({username})
    .select('-password')   
    .populate('posts loops story savedPosts following followers')

    if(!user){
       return res.status(400).json({success:false,message:'User not found!'})
     }

     return res.status(201).json(user)

    } catch (error) {
      console.log(error)
      return res.status(500).json({success:false,message:'User not found'})
    }
}

export const follow = async(req,res) =>{
    try {
    const currentUserId = req.userId
    const targetUserId = req.params.targetUserId

    if(!targetUserId){
       return res.status(400).json({success:false,message:'Target user not found!'})
     }

     if(currentUserId === targetUserId){
       return res.status(400).json({success:false,message:'You can not follow yourself!'})
     }

     const currentUser = await userModel.findById(currentUserId)
     const targetUser = await userModel.findById(targetUserId)

     const isFollowing = currentUser.following.includes(targetUserId)

     if(isFollowing){
        currentUser.following = currentUser.following.filter(id=> id.toString() !==
         targetUserId.toString())

        targetUser.followers = targetUser.followers.filter(id=> id.toString() !==
         currentUserId.toString()) 

         await currentUser.save()
         await targetUser.save()

         return res.status(200).json({following:false,message:'Unfollowed Successfully'})
     }
     else{
        currentUser.following.push(targetUserId)
        targetUser.followers.push(currentUserId)
        
        if(currentUser._id != targetUser._id){
         const notification = await notificationModel.create({
           sender:currentUser._id,
           receiver:targetUser._id,
           type:'follow',
           message:'started following you'
         })

         const populatedNotification = await notificationModel.findById(notification._id)
         .populate('sender receiver')
        
         const receiverSocketId = getSocketId(targetUser._id)
                
         if(receiverSocketId){
           io.to(receiverSocketId).emit('newNotification',populatedNotification)
         }
       }

         await currentUser.save()
         await targetUser.save()

         return res.status(200).json({following:true,message:'Followed Successfully'})
     }
    } catch (error) {
      console.log(error)
      return res.status(500).json({success:false,message:'Following failed'})
    }
}

export const followingList = async(req,res) =>{
    try {
    const user = await userModel.findById(req.userId) 
    
    if(!user){
      return res.status(400).json({success:false,message:'User not found'})
    }

     return res.status(201).json(user.following)

    } catch (error) {
      console.log(error)
      return res.status(500).json({success:false,message:error.message})
    }
}

export const search = async(req,res) =>{
  try {
    const keyword = req.query.keyword
    if(!keyword){
       return res.status(400).json({success:false,message:'Keyword is required!'})
    }
    const users = await userModel.find({
        $or:[
          {username:{$regex:keyword,$options:'i'}},
          {name:{$regex:keyword,$options:'i'}}
        ]
      }).select('-password')

      return res.status(200).json(users)

  } catch (error) {
    console.log(error)
     return res.status(500).json({success:false,message:error.message})
  }
}

export const getAllNotifications = async(req,res) =>{
  try {
    const notifications = await notificationModel.find({receiver:req.userId})
    .populate('sender receiver post loop').sort({createdAt:-1})

    return res.status(200).json(notifications)

  } catch (error) {
    console.log(error)
    return res.status(500).json({success:false,message:error.message})
  }
}

export const markAsRead = async(req,res) =>{
  try {
    const {notificationId} = req.body

    if(Array.isArray(notificationId)){
      // mark all as read
      await notificationModel.updateMany(
         { _id: { $in : notificationId }, receiver : req.userId},
        { $set : { isRead:true }}
      )
    }
    else{
      //mark single as read
      await notificationModel.findOneAndUpdate(
        { _id: notificationId, receiver : req.userId},
        { $set : { isRead:true }})
    }

    return res.status(200).json({success:true,message:'Marked As Read'})

  } catch (error) {
    console.log(error)
    return res.status(500).json({success:false,message:error.message})
  }
}