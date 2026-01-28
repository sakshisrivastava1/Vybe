import React, { useState } from 'react'
import logo from '../assets/colorfulogo.png'
import {IoIosEye,IoIosEyeOff} from 'react-icons/io'
import {ClipLoader} from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import logo2 from '../assets/whitelogo.png'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'


function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch() 

    const [inputClicked, setInputClicked] = useState({
        name:false,
        username:false,
        email:false,
        password:false
    })

    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')

    const handleSignup = async(e)=>{
      setLoading(true)
      e.preventDefault()
      setErr('')
      try {
        const response = await axios.post(serverUrl +'/api/auth/signup',
         {name,email,password,username},{withCredentials:true})
         setLoading(false)
         dispatch(setUserData(response.data))
         console.log(response.data)
         toast.success('Signup successful')
         navigate('/')
        
      } catch (error) {
        setLoading(false)
        setErr(error.response?.data?.message)
        console.log(error)
        toast.error('Signup failed')
      }
      
    }
    
  return (
  <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center '>
      
    <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex items-center justify-center overflow-hidden'>
        
        {/*FORM*/ }
       <form onSubmit={handleSignup} className='w-full h-full lg:w-[50%] bg-white flex flex-col items-center gap-[20px] p-[10px]'>
          
           <div className='flex items-center text-[20px] font-semibold gap-[10px] mt-[40px]'>
             <span>Sign Up to </span>
             <img src={logo} alt="" className='w-[70px]'/>
           </div>

           <div onClick={()=>setInputClicked({...inputClicked,name:true})} className='w-[90%] h-[50px] relative rounded-2xl mt-[30px] flex items-center justify-start border-2 border-black'>
              <label htmlFor="name" className={`text-gray-700 ${inputClicked.name ? 'top-[-15px]' : ''} absolute left-[20px] p-[5px] bg-white text-[15px]`}>
                Enter Your Name 
              </label>
              <input 
              type="text" 
              id='name' 
              required 
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className='w-[100%] h-[100%] px-[20px] outline-none border-0 rounded-2xl'/>        
           </div>

           <div onClick={()=>setInputClicked({...inputClicked,username:true})} className='w-[90%] h-[50px] relative rounded-2xl flex items-center justify-start border-2 border-black'>
              <label htmlFor="username" className={`text-gray-700 ${inputClicked.username ? 'top-[-15px]' : ''} absolute left-[20px] p-[5px] bg-white text-[15px]`}>
                Enter Username 
              </label>
              <input 
              type="text" 
              id='username'
              required 
              value={username}
               onChange={(e)=>setUsername(e.target.value)}
              className='w-[100%] h-[100%] px-[20px] outline-none border-0 rounded-2xl'/>        
           </div>

           <div onClick={()=>setInputClicked({...inputClicked,email:true})} className='w-[90%] h-[50px] relative rounded-2xl flex items-center justify-start border-2 border-black'>
              <label htmlFor="email" className={`text-gray-700 ${inputClicked.email ? 'top-[-15px]' : ''} absolute left-[20px] p-[5px] bg-white text-[15px]`}>
                Enter Email 
              </label>
              <input 
              type="email" 
              id='email' 
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className='w-[100%] h-[100%] px-[20px] outline-none border-0 rounded-2xl'/>        
           </div>

           <div onClick={()=>setInputClicked({...inputClicked,password:true})} className='w-[90%] h-[50px] relative rounded-2xl flex items-center justify-start border-2 border-black'>
              <label htmlFor="password" className={`text-gray-700 ${inputClicked.password ? 'top-[-15px]' : ''} absolute left-[20px] p-[5px] bg-white text-[15px]`}>
                Enter Password
              </label>
              <input 
              type={showPassword ? "text" : "password"} 
              id='password' 
              required 
              value={password}
               onChange={(e)=>setPassword(e.target.value)}
              className='w-[100%] h-[100%] px-[20px] outline-none border-0 rounded-2xl'/>        
              {
                !showPassword ? 

                <IoIosEye className='h-[25px] w-[25px] right-[20px] absolute cursor-pointer'
                onClick={()=>setShowPassword(true)}/>:

                <IoIosEyeOff className='h-[25px] w-[25px] right-[20px] absolute cursor-pointer'
                onClick={()=>setShowPassword(false)}/>
              }
           </div>

           {err && <p className='text-red-500'>{err}</p> }      

           <button className='px-[20px] py-[10px] h-[50px] w-[70%] text-white bg-black font-semibold rounded-2xl cursor-pointer mt-[25px]' disabled={loading}>
              {loading ? <ClipLoader size={30} color='white'/> : 'Sign Up'}
           </button>

           <p className='cursor-pointer text-gray-800 '>
             Already Have an account? 
             <span className='text-blue-600' onClick={()=>navigate('/login')}> Log In</span>
           </p>

       </form>

        {/*LOGO*/ }
       <div className='md:w-[50%] h-full bg-[#000000] text-white text-[16px] font-semibold shadow-2xl shadow-black rounded-l-[30px] hidden lg:flex flex-col justify-center items-center gap-[10px]'>
          <img src={logo2} alt="" className='w-[40%] '/>
          <p>Not Just A Platform, It's A VYBE</p>
       </div>

    </div>

  </div>
  )
}

export default Signup