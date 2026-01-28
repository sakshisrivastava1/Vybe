import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function SenderMessage({message}) {
    const {userData} = useSelector(state=>state.user)
    const scroll = useRef()
    const navigate = useNavigate

    useEffect(()=>{
        scroll.current.scrollIntoView({behaviour:'smooth'})
    },[message.message,message.image])

  return (
    <div ref={scroll} className='w-fit max-w-[60%] bg-pink-200 rounded-t-2xl text-black
     rounded-bl-2xl rounded-br-0 px-[10px] py-[10px] ml-auto right-0 relative gap-[10px] flex flex-col'>
      
       {message.image && 
          <img src={message.image} alt="" className='h-[200px] object-cover rounded-full'/>
       }
       { message.message && 
        <div className='text-[18px] wrap-break-word'>
           {message.message}
        </div>
        }
        <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute right-[-25px] bottom-[-40px]'>
            <img src={userData?.profileImage} alt="" 
            className='object-cover w-full'
            onClick={()=>navigate(`/profile/${userData?.username}`)}/>
        </div>
    </div>
  )
}

export default SenderMessage