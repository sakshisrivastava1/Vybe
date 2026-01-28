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

function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch() 

    const [inputClicked, setInputClicked] = useState({
        username:false,
        password:false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [err,setErr] = useState('')

    const handleLogin = async(e)=>{ 
      setLoading(true)
      e.preventDefault()
      setErr('')
      try {
        const response = await axios.post(serverUrl +'/api/auth/login',{username,password},{withCredentials:true})
        setLoading(false)
        dispatch(setUserData(response.data))
        console.log(response.data)
        toast.success('Login successful')
        navigate('/')
        
      } catch (error) {
        setLoading(false)
        setErr(error.response?.data?.message)
        console.log(error)
        toast.error('Login failed')
      }    
    }
    
  return(
  <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center '>
        
      <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex items-center justify-center overflow-hidden'>
          
          {/*FORM*/ }
         <form onSubmit={handleLogin} className='w-full h-full lg:w-[50%] bg-white flex flex-col items-center justify-center gap-[20px] p-[10px]'>
            
             <div className='flex items-center text-[20px] font-semibold gap-[10px] mt-[40px]'>
               <span>Log In to </span>
               <img src={logo} alt="" className='w-[70px]'/>
             </div>
  
             <div onClick={()=>setInputClicked({...inputClicked,username:true})} className='w-[90%] h-[50px] relative rounded-2xl flex items-center justify-start mt-[30px] border-2 border-black'>
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

             <div onClick={()=>setInputClicked({...inputClicked,password:true})} className='w-[90%] h-[50px] relative rounded-2xl flex items-center justify-start border-2 border-black'>
                <label htmlFor="password" className={`text-gray-700 ${inputClicked.password ? 'top-[-15px]' : ''} absolute left-[20px] p-[5px] bg-white text-[15px]`}>
                  Enter Password
                </label>
                <input 
                type={showPassword ? "text" : "password"} 
                id='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
                required 
                className='w-[100%] h-[100%] px-[20px] outline-none border-0 rounded-2xl'/>        
                {
                  !showPassword ? 
                  
                  <IoIosEye className='h-[25px] w-[25px] right-[20px] absolute cursor-pointer'
                  onClick={()=>setShowPassword(true)}/>:
  
                  <IoIosEyeOff className='h-[25px] w-[25px] right-[20px] absolute cursor-pointer'
                  onClick={()=>setShowPassword(false)}/>
                }
             </div>

             <div className='w-[90%] px-[20px]' onClick={()=>navigate('/forgotpassword')}>
                Fogot Password?
             </div>

             {err && <p className='text-red-500'>{err}</p> }      
             
           <button className='px-[20px] py-[10px] h-[50px] w-[70%] text-white bg-black font-semibold rounded-2xl cursor-pointer mt-[35px]' disabled={loading} >
              {loading ? <ClipLoader size={30} color='white' /> : 'Log In'}
           </button>

           <p className='cursor-pointer text-gray-800 '>
             Do not Have an account? 
             <span className='text-blue-600' onClick={()=>navigate('/signup')}> Sign Up</span>
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

export default Login