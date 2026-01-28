import express from 'express' 
import { isAuth } from '../middleware/isAuth.js'
import { upload } from '../middleware/multer.js'
import { getAllStories, getStoryByUsername, uploadStory, viewStory } from '../controllers/storyController.js'

const router = express.Router()

router.post('/upload',isAuth,upload.single('media'),uploadStory)
router.get('/getByUsername/:username',isAuth,getStoryByUsername)
router.get('/getAll',isAuth,getAllStories)
router.get('/view/:storyId',isAuth,viewStory)

export default router