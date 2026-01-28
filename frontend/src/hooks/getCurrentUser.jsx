import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

export const getCurrentUser = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        serverUrl + '/api/user/current',
        { withCredentials: true }
      )

      dispatch(setUserData(res.data))
      console.log(res.data)
    }

    fetchUser()
  }, [])
}


export default getCurrentUser