import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function RecieverMessage({message}) {
   const {selectedUser} = useSelector(state=>state.message)
   const scroll = useRef()
   const navigate = useNavigate()
   
   useEffect(()=>{
      scroll.current.scrollIntoView({behaviour:'smooth'})
   },[message.message,message.image])
   
  return (
    <div ref={scroll} className='w-fit max-w-[60%] bg-pink-200 rounded-t-2xl text-black
     rounded-br-2xl rounded-bl-0 px-[10px] py-[10px] left-0 relative gap-[10px] flex flex-col'>
      
       {message.image && 
          <img src={message.image} alt="" className='h-[200px] object-cover rounded-full'/>
       }
       { message.message && 
        <div className='text-[18px] wrap-break-word'>
           {message.message}
        </div>
        }
        <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute left-[-25px] bottom-[-40px]'>
            <img src={selectedUser?.profileImage} alt="" 
            className='object-cover w-full' 
            onClick={()=>navigate(`/profile/${selectedUser.username}`)}/>
        </div>
    </div>
  )
}

export default RecieverMessage