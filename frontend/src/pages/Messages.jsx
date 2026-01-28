import React from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OnlineUser from '../components/OnlineUser'
import { setSelectedUser } from '../redux/messageSlice'
import dp from '../assets/profile.webp'

function Messages() {
  const navigate = useNavigate() 
  const dispatch = useDispatch()
  const {userData} = useSelector(state => state.user)
  const {onlineUsers} = useSelector(state => state.socket)
  const { prevChatUsers } = useSelector(state => state.message)

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-[20px] p-[10px] bg-black'>
      
      {/*Navbar */}
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]' >
            <MdOutlineKeyboardBackspace onClick={()=>navigate('/')}
            className='text-white h-[25px] w-[25px] cursor-pointer md:hidden'/>
            <h1 className='text-white text-[20px] font-semibold'>Messages</h1>
      </div>

      {/*Online Users */}
      {onlineUsers ? 
      <div className='w-full h-[80px] flex items-center justify-start gap-[20px] overflow-x-auto p-[20px] border-b-2 border-gray-900'>        
        {userData?.following?.map((user,index)=>(
          onlineUsers?.includes(user?._id) && 
          <OnlineUser key={index} user={user}/>
        ))}
      </div> :
      <div className='text-red-500 w-full h-[80px] flex items-center justify-start gap-[20px] overflow-x-auto p-[20px] border-b-2 border-gray-900'>        
          No Active Users
      </div>
      }

      {/*Previous chats */}
      <div className='w-full h-full flex flex-col gap-[20px] overflow-auto'>
       
        {prevChatUsers?.map((user,index)=>(
          
          <div key={index} onClick={()=>{dispatch(setSelectedUser(user));navigate('/messagearea')}}
          className='w-full flex items-center gap-[10px] text-white cursor-pointer'>
            {
             onlineUsers?.includes(user._id) ? 
             <OnlineUser user={user}/> :
             <div className='w-[50px] h-[50px] rounded-full cursor-pointer overflow-hidden'>
                  <img src={user?.profileImage || dp} alt="" className='w-full object-cover'/> 
             </div>                             
            }
            <div className='flex flex-col'>
              <div className='text-white text-[15px] font-semibold'>{user.name}</div>
              <div className='text-white text-[12px] font-semibold'>@{user.username}</div>             
              {
                onlineUsers?.includes(user._id) && 
                <div className='text-[#22c55e]'>Active Now</div>
              }
            </div>
            
          </div>
        ))}

    
      </div>

    </div>
  )
}

export default Messages