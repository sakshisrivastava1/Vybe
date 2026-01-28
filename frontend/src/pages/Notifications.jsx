import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {MdOutlineKeyboardBackspace} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import NotificationCard from '../components/NotificationCard';
import axios from 'axios';
import {serverUrl} from '../App';
import { setNotificationData } from '../redux/userSlice';

function Notifications() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {notificationData} = useSelector(state => state.user)

    const ids = notificationData?.map((n)=>n._id)
      

     const getAllNotifications = async() => {
      try {
        const response = await axios.get(
          serverUrl + "/api/user/getAllNotifications",
          { withCredentials: true }
        )
        dispatch(setNotificationData(response.data))
        console.log('getAllNotifications',response.data)
    
      } catch (error) {
        console.log(error)
      }
    }

    const markAsRead = async() =>{
        try {
          const response = await axios.post(`${serverUrl}/api/user/markAsRead`,
            {notificationId:ids},{withCredentials:true})
         console.log('markAsRead',response.data)
         await getAllNotifications()

        } catch (error) {
          console.log(error)  
        }
    }

    useEffect(()=>{
        markAsRead()
    },[])

  return (
    <div className='w-full min-h-[100vh] bg-black overflow-auto flex flex-col items-center gap-[20px]'>
            
       <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden' >
           <MdOutlineKeyboardBackspace onClick={()=>navigate('/')}
           className='text-white h-[25px] w-[25px] cursor-pointer'/>
           <h1 className='text-white text-[20px] font-semibold'>Notifications</h1>
       </div>

       <div className='w-full h-[100%] flex flex-col gap-[20px] px-[10px]'>
        {notificationData?.map((noti,index)=>(
            <NotificationCard noti={noti} key={index}/>
        )) }
       </div>

    </div>
  )
}

export default Notifications