import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setFollowing } from '../redux/userSlice'


function getFollowing() {

   const dispatch = useDispatch()

   useEffect(()=>{
    const fetchFollowing = async() => {
       try {
        const response = await axios.get(serverUrl + '/api/user/following',{withCredentials:true})
        dispatch(setFollowing(response.data))

       } catch (error) {
        console.log(error)
       }
    }
    fetchFollowing()
  },[])
}

export default getFollowing