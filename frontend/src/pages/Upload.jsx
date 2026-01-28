import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { FiPlusSquare } from 'react-icons/fi'
import { ClipLoader } from 'react-spinners';
import VideoPlayer from '../components/VideoPlayer'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'
import { setLoopData } from '../redux/loopSlice'
import { setCurrentUserStory, setStoryData } from '../redux/storySlice'
import { toast } from 'react-toastify';


function Upload() {

    const navigate = useNavigate() 
    const mediaInput = useRef()
    const dispatch = useDispatch()

    const {postData} = useSelector(state => state.post)
    const {storyData} = useSelector(state => state.story)
    const {loopData} = useSelector(state => state.loop)

    const [uploadType, setUploadType] = useState('post')
    const [frontendMedia,setFrontendMedia] = useState(null)
    const [backendMedia,setBackendMedia] = useState(null)
    const [mediaType,setMediaType] = useState('')
    const [caption, setCaption] = useState('')
    const [loading,setLoading]=useState(false)


    const handleMedia = async(e) =>{
      setLoading(true)
        try {
           const file = e.target.files[0]  
           console.log(file)
           if(file.type.includes('image')){
             setMediaType('image')
           }
           else{
             setMediaType('video')
           }
           setBackendMedia(file)
           setFrontendMedia(URL.createObjectURL(file))
           setLoading(false)
        } catch (error) {
           console.log(error)
           setLoading(false) 
        }
    }

    const uploadPost = async() =>{
        setLoading(true)
       try {
         const formData = new FormData()
         formData.append('caption',caption)
         formData.append('mediaType',mediaType)
         formData.append('media',backendMedia)

         const response = await axios.post(serverUrl + '/api/post/upload',
            formData,{withCredentials:true})
         setLoading(false)
         console.log(response.data)
         dispatch(setPostData([...postData,response.data]))
         navigate('/')
         toast.success('Post Uploaded') 

       } catch (error) {
        setLoading(false)
        console.log(error)
        toast.error('Failed To Upload Post')  
       }
    }

    const uploadStory = async() =>{
        setLoading(true)
       try {
         const formData = new FormData()
         formData.append('mediaType',mediaType)
         formData.append('media',backendMedia)

         const response = await axios.post(serverUrl + '/api/story/upload',formData,{withCredentials:true})
         setLoading(false)
         console.log(response.data)
         dispatch(setStoryData([...storyData,response.data]))
         dispatch(setCurrentUserStory(response.data))
         toast.success('Story Uploaded')
         navigate('/')

       } catch (error) {
        setLoading(false)
        console.log(error)
        toast.error('Failed To Upload Story')
       }
    }

    const uploadLoop = async() =>{
        setLoading(true)
       try {
         const formData = new FormData()
         formData.append('caption',caption)
         formData.append('media',backendMedia)

         const response = await axios.post(serverUrl + '/api/loop/upload',formData,{withCredentials:true})
         setLoading(false)
         console.log(response.data)
         dispatch(setLoopData([...loopData,response.data]))         
         toast.success('Loop Uploaded')
         navigate('/')
         
       } catch (error) {
          setLoading(false)
          console.log(error)
          toast.error('Failed To Upload Loop')
       }
    }

    const handleUpload = () =>{
      if(uploadType=='post'){
        uploadPost()
      }
      else if(uploadType=='story'){
        uploadStory()
      }
      else{
        uploadLoop()
      }
    }
    
  return (
  <div className='w-full h-[100vh] bg-black flex flex-col items-center'>
        
    <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]' >
       <MdOutlineKeyboardBackspace onClick={()=>navigate('/')}
         className='text-white h-[25px] w-[25px] cursor-pointer'/>
       <h1 className='text-white text-[20px] font-semibold'>Upload Media</h1>
    </div>    
 
      {/*Nav*/}
    <div 
      className='w-[80%] max-w-[600px] h-[80px] gap-[10px] bg-white rounded-full flex items-center justify-around'>  
       
        <div onClick={()=>setUploadType('post')}
        className={`${uploadType === 'post' ? 'bg-black text-white' : 'hover:bg-black hover:text-white hover:shadow-black hover:shadow-2xl'} w-[28%] h-[80%] text-[19px] flex items-center justify-center font-semibold rounded-full cursor-pointer`}>
            Post
        </div>

        <div onClick={()=>setUploadType('story')}
        className={`${uploadType === 'story' ? 'bg-black text-white' : 'hover:bg-black hover:text-white hover:shadow-black hover:shadow-2xl'} w-[28%] h-[80%] text-[19px] flex items-center justify-center font-semibold rounded-full cursor-pointer`}>
            Story
        </div>

        <div onClick={()=>setUploadType('loop')}
        className={`${uploadType === 'loop' ? 'bg-black text-white' : 'hover:bg-black hover:text-white hover:shadow-black hover:shadow-2xl'} w-[28%] h-[80%] text-[19px] flex items-center justify-center font-semibold rounded-full cursor-pointer`}>
            Loop
        </div>
    </div>

        {/*Upload div*/}
    {!frontendMedia &&
    <div onClick={()=>mediaInput.current.click()}
    className='w-[80%] max-w-[500px] h-[250px] gap-[8px] mt-[15vh] hover:bg-gray-900 bg-gray-800 rounded-2xl cursor-pointer flex flex-col items-center justify-center'>      
        <input 
        type="file"
        accept={uploadType == 'loop' ? 'video/*' : ''} 
        hidden 
        ref={mediaInput} 
        onChange={handleMedia}/> 
             
        <FiPlusSquare className='text-white w-[25px] h-[25px] cursor-pointer'/>
        <div className='text-[19px] text-white font-semibold'>
          Upload {uploadType}
        </div>    
    </div>}

       {/*Photo video*/}
    {frontendMedia &&
    <div className='w-[80%] max-w-[500px] h-[250px] mt-[15vh] flex flex-col items-center justify-center'>
     {
     mediaType=='image' && 
        <div className='w-[80%] max-w-[500px] h-[250px] mt-[5vh] flex flex-col items-center justify-center'>
            <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl'/>
            {uploadType!='story' &&
            <input 
            type="text" 
            placeholder='Caption...'
            value={caption}
            onChange={(e)=>setCaption(e.target.value)}
            className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]' />}
        </div>
     }
     {
     mediaType=='video' && 
        <div className='w-[80%] max-w-[500px] h-[250px] mt-[5vh] flex flex-col items-center justify-center'>
            <VideoPlayer media={frontendMedia}/>
            {uploadType!='story' &&
            <input 
            type="text" 
            placeholder='Caption...'
            value={caption}
            onChange={(e)=>setCaption(e.target.value)}
            className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]' />}
        </div>
     }
    </div>} 

    {
    frontendMedia && 
      <button onClick={handleUpload} disabled={loading}
      className='w-[60%] max-w-[400px] px-[10px] py-[5px] bg-pink-800 text-white mt-[50px] cursor-pointer rounded-2xl'>
         {loading ? <ClipLoader size={30} color="white" /> : `Upload ${uploadType}`}
      </button>
    }

  </div>
  )
}

export default Upload