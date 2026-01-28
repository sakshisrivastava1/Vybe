import React from 'react'
import {MdOutlineKeyboardBackspace} from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoopCard from '../components/LoopCard'

function Loops() {
    const {loopData} = useSelector(state=>state.loop)   
    const navigate = useNavigate()

  return (
    <div className='w-screen h-screen bg-black overflow-hidden flex items-center justify-center'>
        
        <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-[100]' >
            <MdOutlineKeyboardBackspace onClick={()=>navigate('/')}
                className='text-white h-[25px] w-[25px] cursor-pointer'/>
            <h1 className='text-white text-[20px] font-semibold'>Loops</h1>
        </div>
        <div className='h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide'>
            
            
            {
                loopData?.map((loop,index)=>(
                    <div className='snap-start h-screen'>
                        <LoopCard key={index} loop={loop}/>
                    </div>
                    
                ))
            }
        </div>
    </div>
  )
}

export default Loops