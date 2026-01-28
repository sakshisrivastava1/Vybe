import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setPrevChatUsers } from '../redux/messageSlice'

function getPrevChats() {
   const dispatch = useDispatch()   
   useEffect(()=>{
    const fetchPrevChats = async() => {
       try {
        const response = await axios.get(serverUrl + '/api/message/prevChats',{withCredentials:true})
        dispatch(setPrevChatUsers(response.data))

       } catch (error) {
        console.log(error)
       }
    }
    fetchPrevChats()
  },[])
}

export default getPrevChats