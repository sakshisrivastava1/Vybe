import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setNotificationData } from '../redux/userSlice'

export const getAllNotifications = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.get(
        serverUrl + '/api/user/getAllNotifications',
        { withCredentials: true }
      )

      dispatch(setNotificationData(response.data))
    }

    fetchNotifications()
  }, [])
}


export default getAllNotifications