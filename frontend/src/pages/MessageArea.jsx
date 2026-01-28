import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import dp from '../assets/profile.webp'
import {LuImage} from 'react-icons/lu'
import {IoMdSend} from 'react-icons/io';
import axios from 'axios'
import { serverUrl } from '../App'
import { setMessages } from '../redux/messageSlice'
import SenderMessage from '../components/SenderMessage'
import RecieverMessage from '../components/RecieverMessage'

function MessageArea() {
    const navigate = useNavigate()
    const {userData} = useSelector(state => state.user)
    const {socket} = useSelector(state => state.socket)
    const {selectedUser,messages} = useSelector(state => state.message)

    const [input, setInput] = useState('')
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)

    const imageInput = useRef()
    const dispatch = useDispatch()

    const handleImage = (e) =>{
      const file = e.target.files[0]
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }

    const handleSendMessage = async(e)=> {
      e.preventDefault()
      try {
        const formData = new FormData()
        formData.append('message',input)
        if(backendImage){
          formData.append('image',backendImage)
        }
        const response = await axios.post(`${serverUrl}/api/message/send/${selectedUser?._id}`,
            formData,{withCredentials:true})

        dispatch(setMessages([...messages,response.data]))
        console.log(response.data)
        setInput('')
        setBackendImage(null)
        setFrontendImage(null)

      } catch (error) {
        console.log(error)
      }
    }

    const getAllMessages = async()=> {
      try {
        const response = await axios.get(`${serverUrl}/api/message/getAll/${selectedUser?._id}`,{withCredentials:true})

        dispatch(setMessages(response.data))
        console.log(response.data)

      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
        getAllMessages()
    },[])

    useEffect(()=>{
      socket?.on('newMessage',(msg)=>{
        dispatch(setMessages([...messages,msg]))
      })
      return ()=>socket?.off('newMessage')
    },[messages,setMessages])

  return (
    <div className='w-full h-[100vh] bg-black relative'>

        {/* Top Bar */}
        <div className='w-full flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-black'>
             <div className=' h-[80px] flex items-center gap-[20px] px-[20px]' >
                <MdOutlineKeyboardBackspace onClick={()=>navigate('/')}
                className='text-white h-[25px] w-[25px] cursor-pointer'/>
             </div>

             <div onClick={()=>navigate(`/profile/${selectedUser.username}`)} 
                className='w-[50px] h-[50px] rounded-full cursor-pointer overflow-hidden'>
                    <img src={selectedUser?.profileImage || dp} alt="" className='w-full object-cover'/> 
             </div> 

             <div className='text-white text-[16px] ' onClick={()=>navigate(`/profile/${selectedUser?.username}`)}>
                <div>{selectedUser?.name}</div>
                <div className='text-[14px]'>@{selectedUser?.username}</div>                
             </div>
                           
        </div>

        {/* Messages */}
        <div className='w-full h-[80%] pt-[100px] px-[40px] gap-[50px] flex flex-col overflow-auto bg-black'>
          {messages && 
           messages.map((msg,index)=>(
             msg.sender == userData?._id ? 
             <SenderMessage message={msg} key={index}/> : 
             <RecieverMessage message={msg} key={index}/>
          ))}
        </div>

        {/*Send Message Input*/}
        <div className='w-full h-[80px] fixed bottom-0 z-[100] flex items-center justify-center bg-black'>
            
            <form onSubmit={handleSendMessage}
            className='w-[90%] h-[80%] max-w-[800px] bg-gray-900 rounded-full mb-[10px] gap-[10px] px-[20px] relative flex items-center'>
                
                {frontendImage && 
                  <div className='w-[100px] h-[100px] rounded-2xl absolute top-[-120px] right-[10px] overflow-hidden'>
                    <img src={frontendImage} alt="" className='h-full object-cover'/>
                  </div>
                }
                
                <input 
                type="file"
                accept='image/*'
                hidden
                ref={imageInput} 
                onChange={handleImage}/>

                <input 
                type="text"
                placeholder='Message...' 
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                className='w-full h-full text-[18px] px-[20px] text-white outline-0'/>

                <div onClick={()=>imageInput.current.click()}>
                    <LuImage className='w-[28px] h-[28px] text-white'/>
                </div>

                {(input || frontendImage) && 
                <button className='w-[60px] h-[40px] cursor-pointer rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-950'>
                    <IoMdSend className='w-[28px] h-[28px] text-white'/>
                </button>}
            </form>
        
        </div>

    </div>
  )
}

export default MessageArea