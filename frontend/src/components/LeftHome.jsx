import React, { useState } from 'react'
import logo from '../assets/colorfulogo.png'
import {FaRegHeart} from 'react-icons/fa6'
import profile from '../assets/profile.webp'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import OtherUser from './OtherUser'
import { useNavigate } from 'react-router-dom'
import Notifications from '../pages/Notifications'
import { toast } from 'react-toastify'

function LeftHome() {
    const navigate = useNavigate() 
    const {userData,suggestedUsers,notificationData} = useSelector(state => state.user);
    const [showNotification, setshowNotification] = useState(false)

    const dispatch = useDispatch()

    const handleLogout = async() =>{
        try {
           await axios.get(serverUrl + '/api/auth/logout', {withCredentials:true}) 
           dispatch(setUserData(null))
           localStorage.removeItem("token")
           toast.success('Logout Successful')
           navigate('/login')

        } catch (error) {
           toast.error('Failed to Logout ')
           console.log(error) 
        }
    }

  return (
    <div className={`w-[25%] lg:block hidden h-[100vh] bg-black border-r-2 border-gray-900 ${showNotification ? 'overflow-hidden' : 'overflow-auto'}`}>
       
       <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>
           <img src={logo} alt="" className='w-[80px]'/>
           
           <div className='relative' onClick={()=>setshowNotification(prev => !prev)}> 
            <FaRegHeart className='text-white w-[25px] h-[25px]'/>
           
            {(notificationData?.length>0 && 
            notificationData.some((noti)=>noti.isRead==false)) &&
            <div className='w-[10px] h-[10px] rounded-full bg-red-600 absolute top-0 right-[-5px]'></div>
            }
           </div>
       </div>

       {!showNotification &&
       <>
       <div className='flex items-center justify-between w-full gap-[10px] px-[10px] py-[10px] border-b-2 border-b-gray-800'>
         
         <div  onClick={()=>navigate(`/profile/${userData.username}`)}  className='flex items-center gap-[10px]'>
           <div className='w-[70px] h-[70px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
            <img src={userData.profileImage || profile} alt="" className='w-full object-cover'/> 
           </div> 

           <div>
            <div className='text-[16px] text-white font-semibold'>
                {userData?.name}
            </div>
            <div className='text-[13px] text-gray-300 font-semibold'>
                @{userData?.username}
            </div>
           </div>
         </div>

         <div className='text-blue-500 font-semibold cursor-pointer' onClick={handleLogout}>
            Logout
         </div>
       </div>

       <div className='w-full p-[20px] gap-[20px] flex flex-col'>
          <h1 className='text-white text-[20px]'>Suggested Users</h1>
          <div>
            { 
              suggestedUsers && suggestedUsers.length > 0 && 
              suggestedUsers.slice(0,3).map((user, index) => (
                <OtherUser key={index} user={user}/>
             ))
            }

          </div>
       </div>
       </>}

       {showNotification && <Notifications/>}

    </div>
  )
}

export default LeftHome