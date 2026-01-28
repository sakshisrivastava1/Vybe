import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { uploadOnCloudinary } from "../config/cloudinary.js"
import { getSocketId, io } from "../socket.js";
import notificationModel from "../models/notificationModel.js";


export const uploadPost = async(req,res) => {
  try {
    const {mediaType,caption} = req.body

    let media;
    if (req.file) {
       media  = await uploadOnCloudinary(req.file.path)
    } 
    const post = await postModel.create({
        author:req.userId,
        media,
        mediaType,
        caption
    })

    const user = await userModel.findById(req.userId)
    user.posts.push(post._id)
    await user.save()

    const populatePost = await postModel.findById(post._id)
    .populate('author','name username profileImage')
    
    return res.status(200).json(populatePost)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({success: false,message:`uploadPost error${error}`})
  }
}

export const getPosts = async(req,res) => {
  try {
    const posts = await postModel
    .find({})
    .populate('author','name username profileImage')
    .populate('comments.author', 'name username profileImage')
    .sort({createdAt:-1})
    
    if(posts.length === 0){
       return res.status(404).json({success: false,message:'Posts not found'})
    }
    return res.status(200).json(posts)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({success: false,message:`getAllPosts error${error}`})
  }
}

export const like = async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.userId
    console.log(postId)

    const post = await postModel.findById(postId)
    .populate('author','name username profileImage')
    .populate('comments.author', 'username profileImage')

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    const alreadyLiked = post.likes.some(
      id => id.toString() === userId.toString()
    )

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        id => id.toString() !== userId.toString()
      )

    } else {
      post.likes.push(userId)

      if(post.author._id != userId){
        const notification = await notificationModel.create({
          sender:userId,
          receiver:post.author._id,
          type:'like',
          post:post._id,
          message:'liked your post'
        })
        const populatedNotification = await notificationModel.findById(notification._id)
        .populate('sender receiver post')

        const receiverSocketId = getSocketId(post.author._id)
        
        if(receiverSocketId){
          io.to(receiverSocketId).emit('newNotification',populatedNotification)
        }
      }
    }

    await post.save()

    const updatedPost = await postModel
      .findById(postId)
      .populate('author','name username profileImage')
      .populate('comments.author','name username profileImage')

      io.emit('likedPost',{
        postId:updatedPost._id,
        likes:updatedPost.likes
      })

    return res.status(200).json(updatedPost)

  } catch (error) {
    console.error('LIKE ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'like post failed'
    })
  }
}

export const comment = async (req, res) => {
  try {
    const { message } = req.body || {}
    const postId = req.params.postId
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

    const post = await postModel.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    post.comments.push({
      author: userId,
      message: message.trim()
    })
    
    if(post.author._id != userId){
        const notification = await notificationModel.create({
          sender:userId,
          receiver:post.author._id,
          type:'comment',
          post:post._id,
          message:'commented on your post'
        })
        const populatedNotification = await notificationModel.findById(notification._id)
        .populate('sender receiver post')

        const receiverSocketId = getSocketId(post.author._id)
        
        if(receiverSocketId){
          io.to(receiverSocketId).emit('newNotification',populatedNotification)
        }
      }

    await post.save()

    const updatedPost = await postModel
      .findById(postId)
      .populate('author', 'name username profileImage')
      .populate('comments.author', 'username profileImage')

      io.emit('commentedPost',{
        postId:updatedPost._id,
        comments:updatedPost.comments
      })

    return res.status(200).json(updatedPost)

  } catch (error) {
    console.error('COMMENT ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Comment failed'
    })
  }
}

export const save = async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const post = await postModel.findById(postId)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    const user = await userModel.findById(userId)

    const alreadySaved = user.savedPosts.some(
      id => id.toString() === postId.toString()
    )

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(
        id => id.toString() !== postId.toString()
      )
    } else {
      user.savedPosts.push(postId)
    }

    await user.save()

    const populatedUser = await userModel.findById(userId).populate('savedPosts')

    return res.status(200).json(populatedUser)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Save post failed' })
  }
}
