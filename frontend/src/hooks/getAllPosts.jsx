import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'

function getAllPosts() {
   const dispatch = useDispatch()
   const {userData} = useSelector(state=>state.user)   
   useEffect(()=>{
    const fetchPosts = async() => {
       try {
        const response = await axios.get(serverUrl + '/api/post/getAll',{withCredentials:true})
        dispatch(setPostData(response.data))

       } catch (error) {
        console.log(error)
       }
    }
    fetchPosts()
  },[dispatch,userData])
}

export default getAllPosts