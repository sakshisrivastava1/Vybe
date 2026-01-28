import loopModel from "../models/loopModel.js";
import userModel from "../models/userModel.js"
import { uploadOnCloudinary } from "../config/cloudinary.js"
import { getSocketId, io } from "../socket.js";
import notificationModel from "../models/notificationModel.js";

export const uploadLoop = async(req,res) => {
  try {
    const {caption} = req.body

    let media;
    if (req.file) {
       media  = await uploadOnCloudinary(req.file.path)
    } 
    const loop = await loopModel.create({
        author:req.userId,
        media,
        caption
    })

    const user = await userModel.findById(req.userId)
    user.loops.push(loop._id)
    await user.save()

    const populateLoop = await loopModel
    .findById(loop._id)
    .populate('author','name username profileImage')

    return res.status(201).json(populateLoop)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({success: false,message:`uploadLoop error${error}`})
  }
}

export const getAllLoops = async (req, res) => {
  try {
    const loops = await loopModel.find({})
      .populate({
        path: 'comments.author',
        select: 'username profileImage'
      })
      .populate({
        path: 'author',
        select: 'username profileImage'
      })
      .sort({ createdAt: -1 })

      if(loops.length === 0){
       return res.status(404).json({success: false,message:'Loops not found'})
    }

    return res.status(200).json(loops)

  } catch (error) {
    return res.status(500).json({ success: false })
  }
}

export const like = async(req,res) => {
     try {
    const loopId = req.params.loopId
    const userId = req.userId
    const loop = await loopModel.findById(loopId)
    
    if(!loop){
       return res.status(404).json({success: false,message:'Loop not found'})
    }
    const alreadyLiked = loop.likes.some(id => id.toString() === userId.toString())

    if(alreadyLiked){
       loop.likes = loop.likes.filter(id=>id.toString() !== userId.toString()) 
    }
    else{
       loop.likes.push(userId)
       if(loop.author._id != userId){
               const notification = await notificationModel.create({
                 sender:userId,
                 receiver:loop.author._id,
                 type:'like',
                 loop:loop._id,
                 message:'liked your loop'
               })
               const populatedNotification = await notificationModel.findById(notification._id)
               .populate('sender receiver loop')
       
               const receiverSocketId = getSocketId(loop.author._id)
               
               if(receiverSocketId){
                 io.to(receiverSocketId).emit('newNotification',populatedNotification)
               }
             }
    }

    await loop.save()
    await loop.populate('author comments.author','name username profileImage')

    io.emit('likedLoop',{
      loopId:loop._id,
      likes:loop.likes
    })

    return res.status(200).json(loop)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({success: false,message:error.message})
  }
}

export const comment = async (req, res) => {
  try {
    const { message } = req.body
    const loopId = req.params.loopId
    const userId = req.userId

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      })
    }

    if (message.length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Comment too long'
      })
    }

    const loop = await loopModel.findById(loopId)

    if (!loop) {
      return res.status(404).json({
        success: false,
        message: 'Loop not found'
      })
    }

    loop.comments.push({
      author: userId,
      message: message.trim()
    })
    if(loop.author._id != userId){
            const notification = await notificationModel.create({
              sender:userId,
              receiver:loop.author._id,
              type:'comment',
              loop:loop._id,
              message:'commented on your loop' 
            })
            const populatedNotification = await notificationModel.findById(notification._id)
            .populate('sender receiver loop')
    
            const receiverSocketId = getSocketId(loop.author._id)
            
            if(receiverSocketId){
              io.to(receiverSocketId).emit('newNotification',populatedNotification)
            }
          }

    await loop.save()

    await loop.populate({
      path: 'comments.author',
      select: 'username profileImage'
    })

    io.emit('commentedLoop',{
      loopId:loop._id,
      comments:loop.comments
    })

    return res.status(200).json(loop)

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}