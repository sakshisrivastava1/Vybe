import React from 'react'
import logo from '../assets/whitelogo.png'
import { FaRegHeart } from 'react-icons/fa6'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import Post from './Post'
import { BiMessageAltDetail } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import StoryDp from './StoryDp'

function Feed() {
  const {postData} = useSelector(state => state.post)
  const {userData,notificationData} = useSelector(state => state.user)
  const {storyList} = useSelector(state => state.story)
  const myStory = storyList.find(
  sto => sto.author._id === userData._id
)

  const navigate = useNavigate()
  
  return (
    <div className='w-full lg:w-[50%] lg:h-[100vh] min-h-[100vh] bg-black relative lg:overflow-y-auto'>
       
       <div className='w-full h-[70px] lg:hidden flex items-center justify-between p-[20px]'>
          <img src={logo} alt="" className='w-[80px]'/>
          <div className='flex items-center gap-[10px]'>
              <div className='relative' onClick={()=>navigate('/notifications')}> 
                  <FaRegHeart className='text-white w-[25px] h-[25px]'/>
                       
                  {(notificationData?.length > 0 && 
                    notificationData.some((noti)=>noti.isRead==false)) &&
                    <div className='w-[10px] h-[10px] rounded-full bg-red-600 absolute top-0 right-[-5px]'></div>
                  }
               </div>   
            <BiMessageAltDetail className='text-white w-[25px] h-[25px]' onClick={()=>navigate('/messages')}/>
          </div>
        </div>

        <div className='flex items-center w-full overflow-auto lg:p-[20px] pl-[10px] gap-[2px] md:gap-[10px]'>
          
          <StoryDp 
          profileImage={userData.profileImage}
           username={'Your Story'}
           story={myStory}/>

          
          {
            storyList
            .filter(sto => sto.author._id !== userData._id)
            .map((sto,index)=>(
                <StoryDp 
                key={index}
                username={sto.author.username} 
                profileImage={sto.author.profileImage} 
                story={sto}/>
            ))
          }
        </div>

        <div className='w-full min-h-[100vh] flex flex-col items-center bg-pink-200 gap-[20px] p-[10px] pb-[120px] pt-[20px] relative'>
           <Nav/>
           {
            postData?.map((post,index)=>(
              <Post key={index} post={post} />
            ))
           }
        </div>

    </div>
  )
}

export default Feed