import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setSuggestedUsers } from '../redux/userSlice'


function getSuggestedUsers() {
   const dispatch = useDispatch()
   useEffect(()=>{
    const fetchUser = async() => {
       try {
        const response = await axios.get(serverUrl + '/api/user/suggested',{withCredentials:true})
        dispatch(setSuggestedUsers(response.data))

       } catch (error) {
        console.log(error)
       }
    }
    fetchUser()
  },[])
}

export default getSuggestedUsers