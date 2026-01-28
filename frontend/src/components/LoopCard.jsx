import React, { useEffect, useRef, useState } from 'react'
import { FaVolumeUp } from "react-icons/fa";
import { IoVolumeMute } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import dp from '../assets/profile.webp'
import { useDispatch, useSelector } from 'react-redux';
import FollowButton from './FollowButton';
import {FaRegHeart} from 'react-icons/fa6'
import { FcLike } from "react-icons/fc";
import { BiCommentDetail } from 'react-icons/bi'
import axios from 'axios';
import { serverUrl } from '../App';
import { setLoopData } from '../redux/loopSlice';
import { GoHeartFill } from 'react-icons/go';
import {LuSendHorizontal} from 'react-icons/lu'

function LoopCard({loop}) {
    const videoRef = useRef()
    const commentRef = useRef()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {userData} = useSelector(state=>state.user)
    const {socket} = useSelector(state=>state.socket)
    const {loopData} = useSelector(state=>state.loop)

    const [isPlaying, setIsPlaying] = useState(true)
    const [isMute, setIsMute] = useState(true)
    const [progress, setProgress] = useState(0)
    const [showHeart, setShowHeart] = useState(false)
    const [showComment, setShowComment] = useState(false)
    const [message ,setMessage] = useState('')

    const handleClick = () =>{
      if(isPlaying){
        videoRef.current.pause()
        setIsPlaying(false)
      }
      else{
        videoRef.current.play()
        setIsPlaying(true)
      }
    }

    const handleLikeDoubleClick = () => {
        setShowHeart(true)
        setTimeout(()=>setShowHeart(false),6000)
        {
          !loop.likes?.includes(userData._id) && handleLike()
        }
    }

    const handleTimeUpdate = () => {
      const video = videoRef.current
      if(video){
        const progressPercent = (video.currentTime / video.duration) * 100
        setProgress(progressPercent)
      }
    }

    const handleLike = async() => {
      const response = await axios.get( `${serverUrl}/api/loop/like/${loop._id}`,{withCredentials:true})
      console.log(response.data)
      const updatedLoop = response.data
      
      const updatedLoops = loopData.map(p => p._id == loop._id ? updatedLoop : p)
      dispatch(setLoopData(updatedLoops))
      console.log(updatedLoops)
    }   
    
    const handleComment = async() => {
        try {
          const response = await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`,{message},{withCredentials:true} )
          const updatedLoop = response.data

          const updatedLoops = loopData.map(p => p._id == loop._id ? updatedLoop : p)
          dispatch(setLoopData(updatedLoops))
          console.log(updatedLoops)
          setMessage('')

        } catch (error) {
          console.log(error)
        }
      }

    useEffect(() => { 
       const video = videoRef.current
      const observer = new IntersectionObserver(([entry])=>{
        
          if(entry.isIntersecting){
             video.play()
          }
          else{
             video.pause()
            
          }
     },{threshold:0.6})

      observer.observe(video)
      
      return()=>{
        observer.unobserve(video)
        observer.disconnect()
      }
    }, [])

    useEffect(()=>{
      const handleClickOutside = (e) => {
       if(commentRef && !commentRef.current.contains(e.target)){
        setShowComment(false)
       }
      }
      if(showComment){
        document.addEventListener('mousedown',handleClickOutside)
      }
      else{
        document.removeEventListener('mousedown',handleClickOutside)
      }
    },[showComment])

    useEffect(() => { 
       socket?.on('likedLoop',(updatedData)=>{
          const updatedLoops = loopData.map(p => p._id == updatedData.loopId?
            {...p,likes:updatedData.likes}:p)
            dispatch(setLoopData(updatedLoops))
       })
       socket?.on('commentedLoop',(updatedData)=>{
          const updatedLoops = loopData.map(p => p._id == updatedData.loopId?
            {...p,comments:updatedData.comments}:p)
            dispatch(setLoopData(updatedLoops))
       })
       return ()=>{socket?.off('likedLoop');socket?.off('commentedLoop')}
      }, [socket,loopData,dispatch])

  return (
    <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden'>
       
       {/*Double tap like */}
        {showHeart &&  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50'>
          <GoHeartFill className='h-[80px] w-[80px] drop-shadow-2xl text-white'/>
        </div>}
        
        {/*Comment*/}
        <div ref={commentRef} className={`absolute z-[200] bottom-0 left-0 w-full h-[500px] p-[10px] rounded-t-4xl 
        bg-white transition-transform duration-500 ease-in-out  
        ${showComment ? 'translate-y-0' : 'translate-y-[100%] '}`}>
            <h2 className='text-black text-[20px] font-semibold text-center'>Comments</h2>

            <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>
              {loop.comments?.length === 0 && 
                <div className='w-full h-full flex items-center justify-center text-gray-500'>
                   No comments yet. Add comment!
                </div>
              }
              {
                loop?.comments?.map((cmt,index)=>(
                  <div key={index} className='w-full flex flex-col gap-[5px] border-b-[1px] border-gray-500 justify-center pb-[10px]'>
                     <div className='flex items-center justify-start md:gap-[10px] gap-[5px]'>
                         <div onClick={()=>navigate(`/profile/${cmt.author.username}`)}
                         className='md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
                           <img src={cmt.author.profileImage || dp} alt="" className='w-full object-cover'/> 
                         </div>

                         <p className="text-sm text-black font-semibold" onClick={()=>navigate(`/profile/${cmt.author.username}`)}>
                             @{cmt.author.username}
                         </p>

                         <div>
                             {cmt.message}
                         </div>
                     </div>
                </div>
                ))
              }
            </div>
             {/*Add comment */}
            <div className='w-full h-[80px] bottom-0 fixed flex items-center justify-between px-[20px] py-[20px]'>           
                 <div className='md:w-[40px] md:h-[40px] w-[20px] h-[20px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
                   <img src={userData?.profileImage || dp} alt="" className='w-full object-cover'/> 
                 </div> 
                       
                 <input 
                 type="text" 
                 value={message}
                 onChange={(e)=>setMessage(e.target.value)}
                 placeholder='Write comment...'
                 className='w-[90%] h-[40px] px-[10px] border-b-2 border-b-gray-500 outline-none'/>
                       
                 {message &&<button onClick={handleComment}
                 className='cursor-pointer right-[5%] absolute' >
                   <LuSendHorizontal className='h-[25px] w-[25px]'/>
                 </button> }      
            </div> 

        </div>
        
        <video 
        ref={videoRef} 
        autoPlay 
        muted={isMute}
        loop  
        src={loop.media} 
        className='w-full max-h-full'
        onClick={handleClick}
        onDoubleClick={handleLikeDoubleClick}
        onTimeUpdate={handleTimeUpdate}/>

          {/*Mute/Unmute */}
        <div onClick={()=>setIsMute(prev=>!prev)}
        className='top-[20px] right-[20px] absolute cursor-pointer z-[100]'>
           {!isMute ? 
            <FaVolumeUp className='w-[20px] h-[20px] text-white font-semibold'/> : 
            <IoVolumeMute className='w-[20px] h-[20px] text-white font-semibold'/>}
        </div>

        {/*Progress Bar */}
        <div className='absolute w-full h-[3px] left-0 bottom-0 bg-gray-900'>          
           <div className='h-full w-[200px] bg-white tansition-all duration-200 ease-linear' 
           style={{width: `${progress}%`}}></div>
        </div>

          {/*Loop Info & Actions */}
        <div className='absolute w-full h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[10px]'>

           <div onClick={()=>navigate(`/profile/${loop?.author?.username}`)}
              className='flex items-center gap-[10px] text-white'>
               
                <div className='w-[40px] h-[40px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
                    <img src={loop?.author?.profileImage || dp} alt="" className='w-full object-cover'/> 
                </div> 
                
                <div className='text-[16px] truncate w-[150px] font-semibold'>
                    @{loop?.author?.username}         
                </div>

                 
                <FollowButton targetUserId={loop?.author?._id}
                 tailwind={'rounded-md px-[10px] py-[5px] border border-white border-2'}/>
           </div> 

           <div className='text-white px-[10px]'>
             {loop?.caption}
           </div>

           <div className='absolute right-0 bottom-[150px] flex flex-col justify-center px-[10px] gap-[20px] text-white'>
              
              <div className='flex flex-col items-center cursor-pointer'>
                  <div onClick={handleLike}>
                     {!loop?.likes?.includes(userData._id) && 
                     <FaRegHeart className='h-[25px] w-[20px]'/>}
                     {loop?.likes?.includes(userData._id) && 
                     <FcLike className='h-[25px] w-[25px] cursor-pointer'/>}
                  </div>
                  <div>{loop?.likes?.length}</div>
              </div>
              
              
              <div onClick={()=>setShowComment(prev => !prev)}
              className='flex flex-col items-center cursor-pointer'>
                  <BiCommentDetail className='h-[25px] w-[20px] cursor-pointer' />
                  <div>{loop?.comments?.length}</div>
              </div>

          </div>
        
        </div>

    </div>
  )
}

export default LoopCard