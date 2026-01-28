import React from 'react'
import dp from '../assets/profile.webp'
import { FiPlusCircle } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { serverUrl } from '../App';

function StoryDp({ profileImage, username, story }) {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)

  const hasStory = !!story?._id

  const isViewed =
    story?.viewers?.some((v) => v?._id?.toString() === userData?._id?.toString())

    const isMyStory = username === "Your Story"

    const ringClass = !hasStory
     ? "" 
     : isMyStory || isViewed
     ? "bg-gradient-to-l from-gray-500 to-gray-950"
     : "bg-gradient-to-b from-pink-500 to-pink-950"


  const handleViewers = async () => {
    if (!hasStory) return console.log('No story id')
    try {
      await axios.get(
        `${serverUrl}/api/story/view/${story._id}`,
        { withCredentials: true }
      )
    } catch (err) {
      console.error(err.message)
    }
  }

  const handleClick = () => {
    if (!hasStory && username === "Your Story") {
      navigate("/upload")
      return
    }

    if (hasStory) {
      handleViewers()
      navigate(
        username === "Your Story"
          ? `/story/${userData.username}`
          : `/story/${username}`
      )
    }
  }

  return (
    <div className="flex flex-col w-[80px]">
      <div
        className={`relative w-[60px] h-[60px] rounded-full flex items-center justify-center
        ${ringClass}`}
      >
        <div
          onClick={handleClick}
          className="w-[50px] h-[50px] rounded-full border-2 overflow-hidden cursor-pointer">
          <img src={profileImage || dp} alt="" />
          {!hasStory && isMyStory && <div>
          <FiPlusCircle className='absolute bottom-[2px] right-[5px] 
           text-white bg-black rounded-full w-[18px] h-[18px]' />
            </div>}
               
        </div>
      </div>

      <div className="text-[14px] text-center text-white truncate">
        {username}
      </div>
    </div>
  )
}

export default StoryDp
{/*
   import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
function StoryDp({ProfileImage,userName,story}) {
  
const navigate=useNavigate()
const{ userData}=useSelector(state=>state.user)
const{ storyData,storyList}=useSelector(state=>state.story)
const [viewed,setViewed]=useState(false)

useEffect(()=>{
  if(story?.viewers?.some((viewer)=>
  viewer?._id?.toString()===userData._id.toString() || viewer?.toString()==userData._id.toString()
)){
  setViewed(true)
}else{
  setViewed(false)
}


},[story,userData,storyData,storyList])
const handleViewers=async ()=>{
  try {
    const result=await axios.get(`${serverUrl}/api/story/view/${story._id}`,{withCredentials:true})
    
  } catch (error) {
    console.log(error)
  }
}


const handleClick=()=>{
  if(!story && userName=="Your Story"){
    navigate("/upload")
  }else if(story && userName=="Your Story"){
      handleViewers()
    navigate(`/story/${userData?.userName}`)
 
  }else {
     handleViewers()
navigate(`/story/${userName}`)
  }
}
  return (
    <div className='flex flex-col w-[80px]'>
      <div className={`w-[80px] h-[80px] ${!story?null:!viewed?"bg-gradient-to-b  from-blue-500 to-blue-950":"bg-gradient-to-r from-gray-500 to-black-800"}  rounded-full flex items-center justify-center relative`}  onClick={handleClick}>
      <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden '>
          <img src={ProfileImage ||  dp} alt="" className='w-full object-cover'/>
          {!story && userName=="Your Story" && <div>
       <FiPlusCircle className='text-black absolute bottom-[8px] bg-white  right-[10px] rounded-full w-[22px] h-[22px]' />
            </div>}
               
      </div>
      </div>
      <div className='text-[14px] text-center truncate w-full text-white'>{userName}</div>
    </div>
  )
}

export default StoryDp
 */}