import React, { useRef, useState } from 'react'
import {MdOutlineKeyboardBackspace} from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dp from '../assets/profile.webp'
import axios from 'axios'
import { serverUrl } from '../App'
import { setProfileData, setUserData } from '../redux/userSlice'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'

function EditProfile() {
    const {userData} = useSelector(state => state.user)
    const navigate = useNavigate()
    const imageInput = useRef()
    const dispatch = useDispatch()

    const [frontendImage, setFrontendImage] = useState(userData?.profileImage || dp)
    const [backendImage, setBackendImage] = useState(null)

    const [name, setName] = useState(userData?.name || '')
    const [username, setUsername] = useState(userData?.username || '')
    const [profession, setProfession] = useState(userData?.profession || '')
    const [bio, setBio] = useState(userData?.bio || '')
    const [gender, setGender] = useState(userData?.gender || '')
    const [loading, setLoading] = useState(false)

    const handleImage = (e) =>{
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleEditProfile = async() => {
      setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name',name)
            formData.append('username',username)
            formData.append('profession',profession)
            formData.append('bio',bio)
            formData.append('gender',gender)
            if(backendImage){
                formData.append('profileImage',backendImage)
            }
           const response = await axios.post(serverUrl + '/api/user/editprofile',
            formData,{
                withCredentials:true,
                 headers: {
                 'Content-Type': 'multipart/form-data',
                },
            } ) 
            setLoading(false)
            dispatch(setProfileData(response.data))
            dispatch(setUserData(response.data))
            console.log(response.data)
            toast.success('Profile Updated')
            navigate(`/profile/${userData.username}`)
            

        } catch (error) {
          setLoading(false)
          console.log(error)
          toast.error('Failed to Update Profile')
        }
    }

  return (
    <div className='w-full min-h-[100vh] bg-black flex flex-col items-center gap-[20px]'>
        
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]' >
            <MdOutlineKeyboardBackspace onClick={()=>navigate(`/profile/${userData.username}`)}
            className='text-white h-[25px] w-[25px] cursor-pointer'/>
            <h1 className='text-white text-[20px] font-semibold'>Edit Profile</h1>
        </div>

       <div onClick={()=>imageInput.current.click()}
       className='w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
           <input 
           type="file" 
           accept='image/*' 
           ref={imageInput} 
           hidden
           onChange={handleImage}/>
           <img src={frontendImage} alt="" className='w-full object-cover'/> 
       </div>

       <div onClick={()=>imageInput.current.click()}
       className='text-blue-500 text-center text-[18px] cursor-pointer font-semibold'>
         Change Your Profile Picture
       </div>

       <input 
       type="text" 
       placeholder='Name'
       value={name}
       onChange={(e)=>setName(e.target.value)}
       className='w-[90%] max-w-[600px] h-[60px] text-white font-semibold bg-slate-800 rounded-2xl border-2 border-gray-700 px-[20px] outline-none'/>

        <input 
       type="text" 
       placeholder='Username'
       value={username}
       onChange={(e)=>setUsername(e.target.value)}
       className='w-[90%] max-w-[600px] h-[60px] text-white font-semibold bg-slate-800 rounded-2xl border-2 border-gray-700 px-[20px] outline-none'/>

        <input 
       type="text" 
       placeholder='Profession'
       value={profession}
       onChange={(e)=>setProfession(e.target.value)}
       className='w-[90%] max-w-[600px] h-[60px] text-white font-semibold bg-slate-800 rounded-2xl border-2 border-gray-700 px-[20px] outline-none'/>

        <input 
       type="text" 
       placeholder='Bio'
       value={bio}
       onChange={(e)=>setBio(e.target.value)}
       className='w-[90%] max-w-[600px] h-[60px] text-white font-semibold bg-slate-800 rounded-2xl border-2 border-gray-700 px-[20px] outline-none'/>

        <input 
       type="text" 
       placeholder='Gender'
       value={gender}
       onChange={(e)=>setGender(e.target.value)}
       className='w-[90%] max-w-[600px] h-[60px] text-white font-semibold bg-slate-800 rounded-2xl border-2 border-gray-700 px-[20px] outline-none'/>

       <button onClick={handleEditProfile} className='w-[60%] max-w-[400px] h-[50px] py-[5px] px-[10px] bg-pink-900 text-white font-semibold rounded-2xl cursor-pointer'>
        {loading ? <ClipLoader size={30} color='white'/> : 'Save Profile'}
       </button>

    </div>
  )
}

export default EditProfile