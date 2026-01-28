import React from 'react'
import dp from '../assets/profile.webp'
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'


function OtherUser({user}) {

  const navigate = useNavigate()

  return (
    <div className='w-full h-[80px] flex items-center justify-between '>
        
       <div className='flex items-center justify-between w-full gap-[10px] px-[10px] py-[10px] border-b-2 border-b-gray-800'>
                
          <div className='flex items-center gap-[10px]'>
              
              <div onClick={()=>navigate(`/profile/${user.username}`)} 
              className='w-[50px] h-[50px] rounded-full cursor-pointer overflow-hidden'>
                   <img src={user?.profileImage || dp} alt="" className='w-full object-cover'/> 
              </div> 
              
              <div>
                   <div className='text-[16px] text-white font-semibold'>
                       {user?.name}
                   </div>
                   
                   <div className='text-[13px] text-gray-300 font-semibold'>
                       @{user?.username}
                   </div>
              </div>
          
          </div>

           <FollowButton targetUserId={user?._id}
           tailwind={'px-[10px] w-[100px] py-[5px] h-[40px] bg-pink-900 text-white rounded-xl cursor-pointer'}/>         
       
      </div> 

  </div>
  )
}

export default OtherUser