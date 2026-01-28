import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setLoopData } from '../redux/loopSlice'

function getAllLoops() {

   const dispatch = useDispatch()
   
   useEffect(()=>{
    const fetchPosts = async() => {
       try {
        const response = await axios.get(serverUrl + '/api/loop/getAll',{withCredentials:true})
        dispatch(setLoopData(response.data))

       } catch (error) {
        console.log(error)
       }
    }
    fetchPosts()
  },[])
}

export default getAllLoops