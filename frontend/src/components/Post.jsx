import React, { useState } from 'react'
import dp from '../assets/profile.webp'
import VideoPlayer from './VideoPlayer'
import {FaRegHeart} from 'react-icons/fa6'
import { FcLike } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { BiCommentDetail } from "react-icons/bi";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { GoBookmarkFill, GoHeartFill } from "react-icons/go";
import { LuSendHorizontal  } from "react-icons/lu";
import axios from 'axios'
import {serverUrl} from '../App'
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';
import { setPostData } from '../redux/postSlice';
import { useEffect } from 'react';

function Post({post}) {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {userData} = useSelector(state=>state.user)
  const {postData} = useSelector(state=>state.post)
  const {socket} = useSelector(state=>state.socket)
 
  const [showComment, setShowComment] = useState(false)
  const [message ,setMessage] = useState('')

  const isSaved = userData?.savedPosts?.some(saved =>
  saved?._id
    ? saved._id.toString() === post._id.toString()
    : saved.toString() === post._id.toString())
  
  const handleLike = async() => {
    try {
      const response = await axios.get(`${serverUrl}/api/post/like/${post._id}`,{withCredentials:true} )
      console.log('Liked',response.data)
      const updatedPost = response.data
      const updatedPosts = postData.map(p=>p._id == post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))

    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async() => { 
    try {
      const response = await axios.post(`${serverUrl}/api/post/comment/${post._id}`,{message},{withCredentials:true} )
      console.log('Commented',response.data)
      const updatedPost = response.data
      const updatedPosts = postData.map(p=>p._id == post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))

    } catch (error) {
      console.log(error)
    }
  }

  const handleSaved = async() => {
    try {
      const response = await axios.get(`${serverUrl}/api/post/saved/${post._id}`,{withCredentials:true} )
      dispatch(setUserData(response.data))
      console.log('Saved',response.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
   socket?.on('likedPost',(updatedData)=>{
      const updatedPosts = postData.map(p => p._id == updatedData.postId?
        {...p,likes:updatedData.likes}:p)
        dispatch(setPostData(updatedPosts))
   })
   socket?.on('commentedPost',(updatedData)=>{
      const updatedPosts = postData.map(p => p._id == updatedData.postId?
        {...p,comments:updatedData.comments}:p)
        dispatch(setPostData(updatedPosts))
   })
   return ()=>{socket?.off('likedPost');socket?.off('commentedPost')}
  }, [postData,dispatch])
  

  return (
    <div className=' text-black bg-white w-[90%] min-h-[450px] flex flex-col items-center gap-[10px] shadow-2xl shadow-2xl shadow-[#00000058] rounded-2xl'>     

      {/*Dp/username/follow button */}
      <div className='w-full h-[80px] flex items-center justify-between px-[10px]'>

        <div onClick={()=>navigate(`/profile/${post?.author?.username}`)}
        className='flex items-center gap-[10px] max-w-[70%]'>
           <div className='md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
             <img src={post?.author?.profileImage || dp} alt="" className='w-full object-cover'/> 
           </div> 
           <div className='text-[16px] font-semibold'>
              @{post?.author?.username}
           </div>
        </div> 

        {userData?._id?.toString() !== post?.author?._id?.toString() && 
  <FollowButton
    targetUserId={post?.author?._id}
    tailwind="relative z-20 rounded-xl px-[10px] py-[5px] h-[30px] md:h-[40px]
            w-[80px] md:w-[100px] bg-black text-white
            text-[14px] md:text-[16px]"/>
}


      </div>

         {/*Photo video*/}
    <div className='w-[80%] h-[250px] flex items-center justify-center'>
     {
     post?.mediaType=='image' && 
        <div className='w-[100%] h-[480px] flex flex-col items-center justify-center'>
            <img src={post?.media} className='h-[60%] rounded-lg max-w-full object-cover'/>
        </div>
     }
     {
     post?.mediaType=='video' && 
        <div className='w-[100%] h-[480px] flex flex-col items-center justify-center'>
            <VideoPlayer media={post?.media}/>
        </div>
     }
    </div> 

    {post?.caption && 
    <div className='flex items-start justify-start gap-[10px] mt-[20px]'>
       <h1 className='text-[15px] font-semibold'>
          @{post?.author?.username}
        </h1>
       <div>{post?.caption}</div>
    </div>}

          {/*Like comment save*/}
    <div className='w-full h-[60px] flex items-center justify-between px-[20px] mt-[10px]'>
       
       {/*Like comment*/}
      <div className='flex items-center justify-center gap-[10px]'>
          <div className='flex items-center justify-center gap-[5px]' onClick={handleLike}>
             {!post?.likes?.includes(userData?._id) && <FaRegHeart className='h-[25px] w-[20px]'/>}
             {post?.likes?.includes(userData?._id) && <FcLike className='h-[25px] w-[25px] cursor-pointer'/>}
             <span>{post?.likes?.length}</span>
         </div>

         <div onClick={()=>setShowComment(prev => !prev)}
         className='flex items-center justify-center gap-[5px]'>
            <BiCommentDetail className='h-[25px] w-[20px] cursor-pointer' />
            <span>{post?.comments?.length}</span>
         </div>
      </div>

      {/*Save*/}
      <div className='flex items-center justify-center gap-[10px]'>
         <div className='flex items-center justify-center gap-[5px] cursor-pointer'>
          
         {!isSaved && <MdOutlineBookmarkBorder className='h-[25px] w-[20px]' onClick={handleSaved} />}
         {isSaved && <GoBookmarkFill className='h-[25px] w-[25px]' onClick={handleSaved} />}
        </div>
      </div>


    </div> 

    {showComment && 
      <div className='w-full flex flex-col gap-[5px] pb-[20px]'>
          
        <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>           
           <div className='md:w-[40px] md:h-[40px] w-[20px] h-[20px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
             <img src={userData.profileImage || dp} alt="" className='w-full object-cover'/> 
           </div> 
           
           <input 
           type="text" 
           value={message}
           onChange={(e)=>setMessage(e.target.value)}
           placeholder='Write comment...'
           className='w-[90%] h-[40px] px-[10px] border-b-2 border-b-gray-500 outline-none'/>
           
           <button onClick={handleComment}
           className='cursor-pointer right-[5%] absolute' >
              <LuSendHorizontal className='h-[25px] w-[25px]'/>
           </button>       
        </div> 

        <div className='w-full max-h-[300px] overflow-auto'>
       {
        post?.comments?.map((com,index)=>(
          <div key={index} className='w-full gap-[10px] flex items-center px-[20px] py-[8px] border-b-2 border-b-gray-200'>

              <div onClick={()=>navigate(`/profile/${com?.author?.username}`)}
              className='md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
                  <img src={com?.author?.profileImage || dp} alt="" className='w-full object-cover'/> 
              </div>

              <p className="text-sm text-black font-semibold" onClick={()=>navigate(`/profile/${com?.author?.username}`)}>
                        @{com?.author?.username}
               </p>

              <div>
                 {com?.message}
              </div>

          </div>
        ))
       }
     </div>
      
      </div>
    }


     
    </div>
  )
}

export default Post