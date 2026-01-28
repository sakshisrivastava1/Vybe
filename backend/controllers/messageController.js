import { uploadOnCloudinary } from "../config/cloudinary.js";
import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";
import { getSocketId, io } from "../socket.js";

import mongoose from "mongoose"

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId
    const receiverId = req.params.receiverId
    const { message } = req.body

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiverId"
      })
    }

    let image
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path)
    }

    const newMessage = await messageModel.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image
    })

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] }
    })

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id]
      })
    } else {
      conversation.messages.push(newMessage._id)
      await conversation.save()
    }

    const receiverSocketId = getSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    return res.status(200).json(newMessage)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Message sending failed"
    })
  }
}

export const getAllMessages = async(req,res) => {
    try {
        const senderId = req.userId
        const receiverId = req.params.receiverId

        const conversation = await conversationModel.findOne({
        participants:{ $all: [senderId, receiverId]}
       }).populate('messages')

       if(!conversation){
        return res.status(200).json([])
       }
        return res.status(200).json(conversation.messages)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,message:'Failed to get messages'})
    }
}

export const getPrevUserChats = async(req,res) => {
    try {
      const currentUserId = req.userId  

      const conversations = await conversationModel.find({
        participants:currentUserId
      }).populate('participants').sort({updatedAt:-1})

      const userMap = {}

      conversations.forEach(conversation => {
        conversation.participants.forEach(user =>{
            if(user._id.toString() !== currentUserId){
               userMap[user._id] = user
            }
        })
      })

      const prevUsers = Object.values(userMap)

      return res.status(200).json(prevUsers)
      
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:'Failed to get messages'})
    }
}