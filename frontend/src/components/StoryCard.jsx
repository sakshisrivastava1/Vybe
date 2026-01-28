import React, { useEffect, useState } from 'react'
import dp from '../assets/profile.webp'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import VideoPlayer from './VideoPlayer'
import { FaEye } from "react-icons/fa";


function StoryCard({storyData}) {
   
    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate()
    const [progress, setProgress] = useState(0)
    const [showViewers, setShowViewers] = useState(false)


    useEffect(()=>{
       const interval = setInterval(()=>{
          setProgress((prev=>{
            if(prev>=100){
               clearInterval(interval)
               navigate('/')
               return 100
            }
           return prev+1}))
       },150)
       return () => clearInterval(interval)
    },[navigate])

  return (
    <div className='w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[20px] relative flex flex-col justify-center'>
      
      <div className='flex items-center gap-[10px] absolute top-[20px] left-[20px] px-[10px]'>

           <MdOutlineKeyboardBackspace onClick={()=>navigate('/')}
            className='text-white h-[25px] w-[25px] cursor-pointer'/>
          
          <div onClick={()=>navigate(`/profile/${storyData?.author?.username}`)} className='w-[40px] h-[40px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
                <img src={storyData?.author?.profileImage || dp} alt="" className='w-full object-cover'/> 
           </div> 
                        
           <div className='text-[16px] truncate w-[150px] font-semibold text-white'>
                @{storyData?.author?.username}         
           </div>

      </div>

      {!showViewers && 
      <>
      <div className='w-full h-[90vh] cursor-pointer flex items-center justify-center' >
          {storyData?.mediaType=='image' && 
             <div className='w-[100%] h-[full] flex flex-col items-center justify-center'>
                 <img src={storyData?.media} className='h-[60%] rounded-lg max-w-full object-cover'/>
             </div>
          }
          {
          storyData?.mediaType=='video' && 
             <div className='w-[100%] h-[95%] flex flex-col items-center justify-center'>
                 <VideoPlayer media={storyData?.media}/>
             </div>
          }
      </div> 

      {/*Progress bar*/}
       <div className='absolute w-full h-[3px] left-0 top-[10px] bg-gray-900'>          
           <div className='h-full w-[200px] bg-white tansition-all duration-200 ease-linear' 
           style={{width: `${progress}%`}}></div>
        </div>

        { storyData?.author?.username === userData?.username &&
        <div onClick={()=>setShowViewers(true)}
        className='absolute bottom-0 left-0 w-full h-[70px] p-2 flex items-center gap-[10px]'>
           
            <div className='text-white flex items-center gap-[5px]'>
                <FaEye/>
                {storyData?.viewers?.length}
            </div>

            <div className="relative flex h-[30px]">
                 {
                 storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                  <div key={index}
                     className="w-[25px] h-[25px] rounded-full border-2 border-black cursor-pointer overflow-hidden absolute"
                     style={{ left: `${index * 9}px`, zIndex: 10 - index }}>
                       <img src={viewer?.profileImage || dp} alt="" 
                       className="w-full h-full object-cover" />
                 </div>
                 ))}
            </div>

        </div>}
     </> }

     {showViewers &&
       <>
         <div onClick={()=>setShowViewers(false)}
         className='w-full h-[30%] cursor-pointer flex items-center justify-center pt-[50px] overflow-hidden' >
          {storyData?.mediaType=='image' && 
             <div className='h-full flex items-center justify-center'>
                 <img src={storyData?.media} className='h-[80%] rounded-lg object-cover'/>
             </div>
          }
          {
          storyData?.mediaType=='video' && 
             <div className='h-full flex flex-col items-center justify-center'>
                 <VideoPlayer media={storyData?.media}/>
             </div>
          }
        </div> 

        <div className='absolute w-full h-[3px] left-0 top-[10px] bg-gray-900'>          
           <div className='h-full w-[200px] bg-white tansition-all duration-200 ease-linear' 
           style={{width: `${progress}%`}}></div>
        </div>

       <div className='w-full h-[70%] border-t-2 border-t-gray-800 p-[20px] text-white'>
          
          <div className='flex items-center gap-[5px]'>
             <FaEye/><span>{storyData?.viewers?.length}</span><span>Viewers</span>
          </div>
          
          <div className='w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px]'>
           {storyData?.viewers?.map((viewer,index)=>(
            <div key={index} className='w-full flex items-center gap-[10px]' onClick={()=>navigate(`/profile/${viewer?.username}`)}>
               <div className='w-[40px] h-[40px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
                  <img src={viewer?.profileImage || dp} alt="" className='w-full object-cover'/> 
               </div> 
                        
               <div className='text-[16px] truncate w-[150px] font-semibold text-white'>
                  @{viewer?.username}         
               </div>
            </div>
           ))}
         </div>

      </div>

       </>}      

    </div>
  )
}

export default StoryCard