import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setStoryList } from '../redux/storySlice'


function getAllStories() {
   //const {userData} = useSelector(state=>state.user)
   //const {storyData} = useSelector(state=>state.story)
   const dispatch = useDispatch()

   useEffect(()=>{
    const fetchStories = async() => {
       try {
        const response = await axios.get(serverUrl + '/api/story/getAll',{withCredentials:true})
        dispatch(setStoryList(response.data))

       } catch (error) {
        console.log(error)
       }
    }
    fetchStories()
  },[])
}

export default getAllStories