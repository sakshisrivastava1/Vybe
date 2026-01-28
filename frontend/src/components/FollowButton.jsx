import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import {serverUrl} from '../App'
import { toggleFollow } from '../redux/userSlice'

function FollowButton({targetUserId,tailwind,onFollowChange}) {

    const {following} = useSelector(state => state.user)
    const isFollowing = following.some(f =>
  f?._id
    ? f._id.toString() === targetUserId
    : f.toString() === targetUserId
)


    const dispatch = useDispatch()

    const handleFollow = async() => {
       try {
        const response = await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`,{withCredentials:true})
        if(onFollowChange){
            onFollowChange()
        }
          dispatch(toggleFollow(targetUserId))      

        console.log(response.data)

       } catch (error) {
        console.log(error)
       }
    }

  return (
    <button className={tailwind} onClick={handleFollow}>
        {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}

export default FollowButton