import React, { useEffect, useState } from 'react'
import {MdOutlineKeyboardBackspace} from 'react-icons/md'
import {serverUrl} from '../App';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { setSearchData } from '../redux/userSlice';
import dp from '../assets/profile.webp'
import Nav from '../components/Nav';

function Search() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {searchData} = useSelector(state=>state.user)
    const [input, setInput] = useState('')

    const handleSearch = async() => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/search?keyword=${input}`, {withCredentials:true})
        dispatch(setSearchData(response.data))
        console.log(response.data)

      } catch (error) {
        console.log(error)
      }
    }

   useEffect(()=>{
     handleSearch()
   },[input])

  return (
    <div className='w-full min-h-[100vh] bg-black flex flex-col items-center gap-[20px] absolute top-0'>
       
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] ' >
           <MdOutlineKeyboardBackspace onClick={()=>navigate('/')}
             className='text-white h-[25px] w-[25px] cursor-pointer'/>
        </div>

        <div className='w-full h-[80px] flex items-center justify-center mt-[30px]'>
           <form className='w-[90%] max-w-[800px] h-[80%] px-[20px] rounded-full bg-gray-800 flex items-center'>
              <FiSearch className='w-[20px] h-[20px] text-white'/>
              <input 
              type="text" 
              placeholder='Search...'
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              className='w-full h-full rounded-full outline-0 px-[20px] text-[16px] text-white'/>
           </form>
        </div>

        {input && 
        searchData?.map((userr)=>(
            <div onClick={()=>navigate(`/profile/${userr.username}`)} className='w-[90vw] h-[80px] max-w-[700px] px-[15px] rounded-full bg-white hover:bg-gray-200 cursor-pointer flex items-center gap-[20px]'>
               <div className='w-[50px] h-[50px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
                   <img src={userr?.profileImage || dp} alt="" className='w-full object-cover'/> 
               </div> 
               <div className='text-[16px] font-semibold text-black'>
                   <div>@{userr?.username}</div>
                   <div className='text-[14px] text-gray-400'>{userr?.name}</div>
               </div>
            </div>
          ))
        }

        {!input && 
        <div className='text-[30px] text-gray-400 font-bold mt-[30px]'>Search Here...</div> }
        <Nav/>
    </div>
  )
}

export default Search