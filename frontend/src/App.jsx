import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import { useDispatch, useSelector } from 'react-redux'
import getCurrentUser from './hooks/getCurrentUser'
import Notifications from './pages/Notifications'
import getSuggestedUsers from './hooks/getSuggestedUsers'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Upload from './pages/Upload'
import getAllPosts from './hooks/getAllPosts'
import Loops from './pages/Loops'
import getAllLoops from './hooks/getAllLoops'
import Story from './pages/Story'
import getAllStories from './hooks/getAllStories'
import Messages from './pages/Messages'
import MessageArea from './pages/MessageArea'
import Search from './pages/Search'
import {io} from 'socket.io-client'
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import getFollowing from './hooks/getFollowing'
import getPrevChats from './hooks/getPrevChats'
import { setNotificationData } from './redux/userSlice'
import getAllNotifications from './hooks/getAllNotifications'
import {ToastContainer} from 'react-toastify'

export const serverUrl = 'https://vybe-backend-ihfq.onrender.com'

function App() {

  const {userData,notificationData} = useSelector(state=>state.user)
  const { socket,onlineUsers } = useSelector(state=>state.socket)

  const dispatch = useDispatch()

  getCurrentUser()
  getSuggestedUsers()
  getAllPosts()
  getAllLoops()
  getAllStories() 
  getFollowing()
  getPrevChats()
  getAllNotifications()

  useEffect(() => {
      if(userData){
       const socketIo = io(serverUrl,{
         query:{ userId:userData._id }
       })
       dispatch(setSocket(socketIo))
  
       socketIo.on('getOnlineUsers',(users)=>{
         dispatch(setOnlineUsers(users))
       })
    
       return ()=> socketIo.close()
      }
      else{
        if(socket){
          socket.close()
          dispatch(setSocket(null))
        }
      }
    }, [userData])

    socket?.on('newNotification',(noti)=>{
          dispatch(setNotificationData([...notificationData,noti]))
        })

  return (
    <>
     <ToastContainer/>
      <Routes>
        <Route path='/' element={userData? <Home/> : <Login/>} />
        {!userData && <Route path='/signup' element={<Signup/>} />}
        {!userData && <Route path='/login' element={<Login/>} />}
        {userData && <Route path='/forgot-password' element={<ForgotPassword/>} />}
        {userData && <Route path='/profile/:username' element={<Profile/>} />}
        {userData && <Route path='/editProfile' element={<EditProfile/>} />}
        {userData && <Route path='/upload' element={<Upload/>} />}
        {userData && <Route path='/loops' element={<Loops/>} />}
        {userData && <Route path='/story/:username' element={<Story/>} />}
        {userData && <Route path='/search' element={<Search/>} />}
        {userData && <Route path='/messages' element={<Messages/>} />}
        {userData && <Route path='/messagearea' element={<MessageArea/>} />}
        {userData && <Route path='/notifications' element={<Notifications/>} />}
      </Routes>
    </>
  )
}

export default App
