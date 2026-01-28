import React, { useRef, useState } from 'react'
import { FaVolumeUp } from "react-icons/fa";
import { IoVolumeMute } from "react-icons/io5";

function VideoPlayer({media}) {
    const videoTag = useRef()
    const [mute, setMute] = useState(true)
    const [isPlaying, setIsPlaying] = useState(true)

    const handleClick = async() => {
      if(isPlaying){
        videoTag.current.pause()
        setIsPlaying(false)
      }
      else{
        videoTag.current.play()
        setIsPlaying(true)
      }
    }

  return (
    <div className='max-w-full h-[100%] relative cursor-pointer rounded-2xl overflow-hidden'>
        <video 
        src={media} 
        autoPlay 
        loop 
        muted={mute}
        ref={videoTag}
        onClick={handleClick}
        className='h-[100%] cursor-pointer w-full object-cover rounded-2xl '/> 

        <div onClick={()=>setMute(prev=>!prev)}
        className='absolute bottom-[10px] right-[10px]'>
            {!mute ? 
            <FaVolumeUp className='w-[20px] h-[20px] text-white font-semibold'/> : 
            <IoVolumeMute className='w-[20px] h-[20px] text-white font-semibold'/>}
        </div>
    </div>
  )
}

export default VideoPlayer