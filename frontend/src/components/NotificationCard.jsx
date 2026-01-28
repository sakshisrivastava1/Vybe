import React from 'react'
import { useNavigate } from 'react-router-dom'
import dp from '../assets/profile.webp'

function NotificationCard({noti}) {
    const navigate = useNavigate()

  return (
    <div className='w-full min-h-[50px] bg-gray-800 rounded-md flex items-center justify-between p-[5px]'>
       
        <div className='flex items-center gap-[10px]'>                     
            <div onClick={()=>navigate(`/profile/${noti?.sender?.username}`)} 
            className='w-[50px] h-[50px] rounded-full cursor-pointer overflow-hidden'>
                <img src={noti?.sender?.profileImage || dp} alt="" className='w-full object-cover'/> 
            </div> 
                      
            <div className='flex flex-col'>
                <h1 className='text-[16px] text-white font-semibold'>{noti?.sender?.name}</h1>
                <h1 className='text-[14px] text-gray-200'>{noti?.message}</h1>
            </div>                 
        </div>

        <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
            {noti?.loop 
            ?
            <video src={noti?.loop?.media} muted loop 
            className='w-full h-full object-cover'/>
            :
            noti?.post?.mediaType == 'image' ? 
            <img src={noti?.post?.media} className='h-full object-cover'/> 
            : 
            noti?.post 
            ?
            <video src={noti?.post?.media} muted loop 
            className='h-full object-cover'/>
            :
            null
            }
        </div>
        
    </div>
  )
}

export default NotificationCard