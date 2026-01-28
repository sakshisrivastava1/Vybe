import React, { useState } from 'react'
import axios from 'axios'
import {IoIosEye,IoIosEyeOff} from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'

function ForgotPassword() {
    const navigate = useNavigate()

     const [inputClicked, setInputClicked] = useState({
        email:false,
        otp:false,
        newPassword:false,
        confirmPassword:false
    })
   
     const [step,setStep] = useState(1)
     const [email, setEmail] = useState('')
     const [otp,setOtp] = useState('')
     const [newPassword, setNewPassword] = useState('')
     const [confirmPassword,setConfirmPassword] = useState('')
     const [showPassword, setShowPassword] = useState(false)
     const [loading, setLoading] = useState(false)
     const [err,setErr] = useState('')

    const sendOtp = async(e)=>{
       setLoading(true)
       e.preventDefault()
       setErr('')
      try {
        const response = await axios.post(serverUrl + '/api/auth/sendOtp',{email})
        setLoading(false)
        console.log(response.data)
        toast.success('OTP Sent')
        setStep(2)
      } catch (error) {
        setLoading(false)
        setErr(error.response?.data?.message)
        console.log(error)
        toast.error('Failed to send OTP')
      }
    }

    const verifyOtp = async(e)=>{
       setLoading(true)
       e.preventDefault()
       setErr('')
      try {
        const response = await axios.post(serverUrl + '/api/auth/verifyOtp',
        {email,otp:otp.toString()})
         setLoading(false)
         console.log(response.data)
         toast.success('OTP Verified')
         setStep(3)
      } catch (error) {
        setLoading(false)
        setErr(error.response?.data?.message)
        console.log(error)
        toast.error('Failed to verify OTP')
      }
    }

    const resetPassword = async(e)=>{
      setLoading(true)
      e.preventDefault()
      setErr('')
      try {
        const response = await axios.post(serverUrl + '/api/auth/resetPassword',
        {email,newPassword,confirmPassword})
         setLoading(false)
         console.log(response.data)
         toast.success('Password changed')
         navigate('/')

      } catch (error) {
        setLoading(false)
        setErr(error.response?.data?.message)
        console.log(error)
        toast.error('Failed to Change Password')
      }
    }

  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center '>
       
     { step==1 && //sendOtp
      <div className='w-[90%] max-w-[500px] h-[500px] bg-white border-[#1a1f23] rounded-2xl flex flex-col items-center justify-center '>
          <h2 className='text-[30px] font-semibold'>
              Fogot Password
          </h2>

          <div onClick={()=>setInputClicked({...inputClicked,email:true})} className='w-[90%] h-[50px] mt-[30px] relative rounded-2xl flex items-center justify-start border-2 border-black'>
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

           {err && <p className='text-red-500'>{err}</p> }
            
            <button type='submit' disabled={loading} onClick={sendOtp} className='px-[20px] py-[10px] h-[50px] w-[90%] text-white bg-black font-semibold rounded-2xl cursor-pointer mt-[35px]'>
               {loading ? <ClipLoader size={30} color='white'/> : 'Send OTP'}
            </button>
       </div>
      }
      
      {step==2 && //verifyOtp
       <div className='w-[90%] max-w-[500px] h-[500px] bg-white border-[#1a1f23] rounded-2xl flex flex-col items-center justify-center '>
          <h2 className='text-[30px] font-semibold'>
              Fogot Password
          </h2>

          <div onClick={()=>setInputClicked({...inputClicked,otp:true})} className='w-[90%] h-[50px] mt-[30px] relative rounded-2xl flex items-center justify-start border-2 border-black'>
              <label htmlFor="otp" className={`text-gray-700 ${inputClicked.otp ? 'top-[-15px]' : ''} absolute left-[20px] p-[5px] bg-white text-[15px]`}>
                Enter Otp 
              </label>
              <input 
              type="text" 
              id='otp' 
              required
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              className='w-[100%] h-[100%] px-[20px] outline-none border-0 rounded-2xl'/>        
           </div>

           {err && <p className='text-red-500'>{err}</p> }
            
            <button type='submit' disabled={loading} onClick={verifyOtp} className='px-[20px] py-[10px] h-[50px] w-[90%] text-white bg-black font-semibold rounded-2xl cursor-pointer mt-[35px]'>
                {loading ? <ClipLoader size={30} color='white'/> : 'Submit'}
            </button>
       </div>
      }

      {step==3 && //resetPassword
       <div className='w-[90%] max-w-[500px] h-[500px] bg-white border-[#1a1f23] rounded-2xl flex flex-col items-center justify-center '>
          <h2 className='text-[30px] font-semibold'>
              Reset Password
          </h2>

          <div onClick={()=>setInputClicked({...inputClicked,newPassword:true})} className='w-[90%] h-[50px] mt-[30px] relative rounded-2xl flex items-center justify-start border-2 border-black'>
             <label htmlFor="newPassword" className={`text-gray-700 ${inputClicked.newPassword ? 'top-[-15px]' : ''} absolute left-[20px] p-[5px] bg-white text-[15px]`}>
                  Enter Password
             </label>
             <input 
             type={showPassword ? "text" : "password"} 
             id='newPassword'
             value={newPassword}
             onChange={(e)=>setNewPassword(e.target.value)} 
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
            
          <div onClick={()=>setInputClicked({...inputClicked,confirmPassword:true})} className='w-[90%] h-[50px] mt-[30px] relative rounded-2xl flex items-center justify-start border-2 border-black'>
             <label htmlFor="confirmPassword" className={`text-gray-700 ${inputClicked.confirmPassword ? 'top-[-15px]' : ''} absolute left-[20px] p-[5px] bg-white text-[15px]`}>
                Confirm Password
             </label>
             <input 
             type={showPassword ? "text" : "password"} 
             id='confirmPassword'
             value={confirmPassword}
             onChange={(e)=>setConfirmPassword(e.target.value)} 
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

          {err && <p className='text-red-500'>{err}</p> }         

          <button type='submit' disabled={loading} onClick={resetPassword} className='px-[20px] py-[10px] h-[50px] w-[90%] text-white bg-black font-semibold rounded-2xl cursor-pointer mt-[35px]'>
              {loading ? <ClipLoader size={30} color='white'/> : 'Reset Password'}
          </button>
       </div>
      }
    </div>
  )
}

export default ForgotPassword