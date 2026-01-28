import React from 'react'
import { useNavigate } from 'react-router-dom'
import dp from '../assets/profile.webp'
import { useDispatch } from 'react-redux'
import { setSelectedUser } from '../redux/messageSlice'

function OnlineUser({user}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
 
    return (
    <div className='w-[50px] h-[50px] gap-[20px] relative flex items-center justify-start'>      
        <div 
        onClick={()=>{
            dispatch(setSelectedUser(user))
            navigate('/messageArea')}} 
           className='w-[50px] h-[50px] rounded-full cursor-pointer overflow-hidden'>
           <img src={user?.profileImage || dp} alt="" className='w-full object-cover'/> 
        </div>

        <div className='w-[10px] h-[10px] bg-[#22c55e] rounded-full absolute top-0 right-0'>
        </div>
    </div>
  )
}

export default OnlineUser