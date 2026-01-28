import React from 'react'
import {GoHomeFill} from 'react-icons/go'
import {FiSearch} from 'react-icons/fi'
import {FiPlusCircle} from 'react-icons/fi'
import { MdSlowMotionVideo } from "react-icons/md";
import dp from '../assets/profile.webp'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Nav() {
    const navigate = useNavigate()
    const {userData} = useSelector(state=>state.user)

  return (
    <div className='w-[90%] lg:w-[40%] h-[60px] bg-black flex items-center justify-around fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>
       <div>
           <GoHomeFill onClick={()=>navigate('/')}
           className='text-white w-[25px] h-[25px] cursor-pointer' />
       </div>
       <div>
           <FiSearch onClick={()=>navigate('/search')}
           className='text-white w-[25px] h-[25px] cursor-pointer'/>
       </div>
       <div>
           <FiPlusCircle onClick={()=>navigate('/upload')}
           className='text-white w-[25px] h-[25px] cursor-pointer'/>
       </div>
       <div>
           <MdSlowMotionVideo onClick={()=>navigate('/loops')}
           className='text-white w-[25px] h-[25px] cursor-pointer'/>
       </div>
       <div onClick={()=>navigate(`/profile/${userData?.username}`)} 
       className='w-[40px] h-[40px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
           <img src={userData?.profileImage || dp} alt="" className='w-full object-cover'/> 
       </div> 
       
    </div>
  )
}

export default Nav