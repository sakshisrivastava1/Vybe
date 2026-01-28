import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js"
import storyModel from "../models/storyModel.js"
import userModel from "../models/userModel.js";

export const uploadStory = async(req,res) => {
    try {
      const {mediaType} = req.body

      let media;
      if (req.file) {
       media  = await uploadOnCloudinary(req.file.path)
      } 
    const story = await storyModel.create({
        author:req.userId,
        mediaType,
        media,
    })

    const user = await userModel.findById(req.userId)
    user.story.push(story._id)
    await user.save()

    const populateStory = await storyModel.findById(story._id)
    .populate('author','name username profileImage')
    .populate('viewers','name username profileImage')

    return res.status(200).json(populateStory)

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false,message:error.message})
    }
}

export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params
    const userId = req.userId

    if (!userId) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ success: false, message: "Invalid story ID" })
    }

    const story = await storyModel.findById(storyId)
    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" })
    }

    // 🚫 IMPORTANT: Ignore author view
    if (story.author.toString() === userId.toString()) {
      await story.populate('author viewers', 'name username profileImage')
      return res.status(200).json(story)
    }

    // ✅ Add viewer only if not already present
    if (!story.viewers.some(id => id.toString() === userId.toString())) {
      story.viewers.push(userId)
      await story.save()
    }

    await story.populate('author viewers', 'name username profileImage')
    return res.status(200).json(story)

  } catch (error) {
    console.error("viewStory error:", error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getStoryByUsername = async(req,res) => {
  try {
    const username = req.params.username
    
    const user = await userModel.findOne({username}).sort({ createdAt: 1 })

    if(!user){
      return res.status(400).json({success: false,message:'getStoryByUsername User not found'})
    }
    const story = await storyModel.find({author:user._id}).populate([
       { path: "author", select: "name username profileImage" },
      { path: "viewers", select: "name username profileImage" }
    ])

    return res.status(200).json(story)

  } catch (error) {
      console.log(error)
      return res.status(500).json({success: false,message:error.message})
  }
}

{/*export const getAllStories = async(req,res) => {
  try {
  
    const currentUser = await userModel.findById(req.userId)

    if(!currentUser){
      return res.status(400).json({success: false,message:'User not found'})
    }

    const followingIds = currentUser.following
    const stories = await storyModel.find({
      author:{$in: followingIds}
    }).populate([
       { path: "author", select: "name username profileImage" },
      { path: "viewers", select: "name username profileImage" }
    ]).sort({createdAt :-1})

    return res.status(200).json(stories)
    
 }catch (error) {
      console.log(error)
      return res.status(500).json({success: false,message:error.message})
  }
}*/}

export const getAllStories = async (req, res) => {
  try {
    const currentUser = await userModel.findById(req.userId)

    if (!currentUser) {
      return res.status(400).json({ success: false, message: 'User not found' })
    }

    const followingIds = currentUser.following

    const stories = await storyModel.find({
      author: { $in: [...followingIds, req.userId] }
    })
    .populate([
      { path: "author", select: "name username profileImage" },
      { path: "viewers", select: "name username profileImage" }
    ])
    .sort({ createdAt: -1 })

    return res.status(200).json(stories)

  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}
