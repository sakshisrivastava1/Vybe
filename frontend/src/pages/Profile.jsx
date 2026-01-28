import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import dp from '../assets/profile.webp'
import Nav from '../components/Nav'
import { setProfileData, setUserData } from '../redux/userSlice'
import Post from '../components/Post'
import FollowButton from '../components/FollowButton'
import { setSelectedUser } from '../redux/messageSlice'


function Profile() {
  const navigate = useNavigate()
  const {username} = useParams()
  const dispatch = useDispatch()
  const {profileData,userData} = useSelector(state => state.user)
  const {postData} = useSelector(state => state.post)
  const [postType, setPostType] = useState('posts')

  const handleProfile = async() => {
    try {
      const response = await axios.get(`${serverUrl}/api/user/getProfile/${username}`,{withCredentials:true}) 
      dispatch(setProfileData(response.data[0])) 
      console.log(response.data)
      
    } catch (error) {
       console.log(error) 
    }
  }

  const handleLogout = async() => {
        try {
           const response = await axios.get(serverUrl + '/api/auth/logout', {withCredentials:true}) 
           dispatch(setProfileData(null))
           dispatch(setUserData(null))
           localStorage.removeItem("token")
           navigate('/login')
           console.log(response)

        } catch (error) {
           console.log(error) 
        }
  }

  useEffect(() => {
    handleProfile()
  }, [username])
  
  return (
    <div className='w-full min-h-screen bg-black'>
           
       {/*Navbar of Profile Page */}
       <div className='w-full h-[80px] flex items-center justify-between px-[30px] text-white'>
         <MdOutlineKeyboardBackspace className='h-[25px] w-[25px] cursor-pointer' onClick={()=>navigate('/')}/>
              
         <div className='font-semibold text-[18px]'>{profileData?.username}</div>
              
         <button onClick={handleLogout}
         className='font-semibold w-[80px] h-[25px] rounded-lg cursor-pointer text-[15px] bg-pink-800'>
             Logout
         </button>
       </div>

       {/*Profiledata*/}
      <div className='w-full h-[150px] md:pt-[20px] px-[10px] flex items-center justify-center gap-[20px] lg:gap-[50px] '>
          <div className='w-[70px] h-[70px] md:w-[140px] md:h-[140px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
            <img src={profileData?.profileImage || dp} alt="" className='w-full object-cover'/> 
         </div> 
           
          <div>
            <div className='font-semibold text-[22px] text-white'>{profileData?.name}</div>
            <div className='text-[16px] text-white'>{profileData?.profession || 'New User'}</div>
            <div className='text-[16px] text-white'>{profileData?.bio || 'Bio'}</div>
          </div>
      </div>

      {/*Body*/ }
      <div className='w-full h-[100px] text-white flex items-center justify-center gap-[40px] md:gap-[60px] pt-[30px] px-[20%]'>
                    
      {/*Posts*/ }
      <div>
          <div>{profileData?.posts.length}</div>
          <div>Posts</div>
      </div>
      
      {/*Followers*/ }
      <div>
          <div className="flex items-center justify-center gap-[20px]">
              <div className="relative flex h-[30px]">
                {
                profileData?.followers?.slice(0, 3).map((user, index) => (
                  <div key={index}
                  className="w-[30px] h-[30px] rounded-full border-2 border-black cursor-pointer overflow-hidden absolute"
                  style={{ left: `${index * 9}px`, zIndex: 10 - index }}>
                    <img src={user?.profileImage || dp} alt="" className="w-full h-full object-cover" />
                </div>
                ))}
              </div>
      
              <div className="text-white ml-[30px]">
                  {profileData?.followers?.length}
              </div>
          </div>
          <div>Followers</div>
      </div>
      
      {/*Following*/ }
      <div>
            <div className="flex items-center justify-center gap-[20px]">
                <div className="relative flex h-[30px]">
                  {
                   profileData?.following?.slice(0, 3).map((user, index) => (
                    <div key={index}
                    className="w-[30px] h-[30px] rounded-full border-2 border-black cursor-pointer overflow-hidden absolute"
                     style={{ left: `${index * 9}px`, zIndex: 10 - index }}>
                        <img src={user?.profileImage || dp} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
      
                <div className="text-white ml-[30px]">
                    {profileData?.following?.length}                    
                </div>
             </div>

             <div>Following</div>
      </div>
      
    </div>

    <div className='w-full h-[80px] text-white flex items-center justify-center gap-[20px]'>
         {
           profileData?._id == userData?._id && 
           <button onClick={()=>navigate('/editprofile')} className='px-[10px] py-[5px] min-w-[150px] h-[40px] bg-white text-black cursor-pointer rounded-2xl'>
              Edit Profile
           </button>
         }
         {
           profileData?._id != userData?._id && 
           <>
            <FollowButton targetUserId={profileData?._id} onFollowChange={handleProfile}
            tailwind={'px-[10px] py-[5px] min-w-[150px] h-[40px] bg-white text-black cursor-pointer rounded-2xl'}/>
           
           <button onClick={()=>{dispatch(setSelectedUser(profileData));navigate('/messagearea')}}
           className='px-[10px] py-[5px] min-w-[150px] h-[40px] bg-white text-black cursor-pointer rounded-2xl'>
              Message
           </button>
           </>
         }
       </div>

       {/*Posts/ Saved Posts */}
       <div className='w-full min-h-[100vh] flex justify-center'>
           <div className='w-full max-w-[900px] bg-white flex flex-col items-center rounded-t-[30px] relative gap-[20px] pt-[30px]'>
              
              {profileData?._id == userData?._id && 
               <div className='w-[80%] max-w-[400px] h-[60px] gap-[10px] bg-white rounded-full flex items-center justify-around'>  
       
                   <div onClick={()=>setPostType('posts')}
                   className={`${postType == 'posts' ? 'bg-black text-white' : 'hover:bg-black hover:text-white hover:shadow-black hover:shadow-2xl'} w-[28%] h-[80%] text-[19px] flex items-center justify-center font-semibold rounded-full cursor-pointer`}>
                     Post
                   </div>

                   <div onClick={()=>setPostType('saved')}
                   className={`${postType == 'saved' ? 'bg-black text-white' : 'hover:bg-black hover:text-white hover:shadow-black hover:shadow-2xl'} w-[28%] h-[80%] text-[19px] flex items-center justify-center font-semibold rounded-full cursor-pointer`}>
                       Saved
                   </div>

               </div>}
                  
              <Nav/>

             {profileData?._id == userData?._id && 
              <>
                   { postType == 'posts' &&
                      postData.map((post,index) => (
                      post.author._id == profileData?._id &&
                          <Post key={index} post={post} />
                       ))
                  }
                  { postType =='saved' &&
                       postData.map((post, index) => (
                       userData.savedPosts?.some(
                        p => p?._id?.toString() == post?._id?.toString()) && 
                            <Post key={index} post={post} />
                        ))
                  }
              </>}

              {profileData?._id != userData?._id && 
              <>
                 { postType == 'posts' &&
                    postData.map((post,index) => (
                     post.author._id == profileData?._id &&
                      <Post key={index} post={post} />
                   ))
                  }
              </>}

           </div>
       </div>
  </div>
  )
}

export default Profile