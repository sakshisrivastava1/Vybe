import express from 'express' 
import { isAuth } from '../middleware/isAuth.js'
import { editProfile, follow, followingList, getAllNotifications, getProfile, getUser, markAsRead, search, suggestedUsers } from '../controllers/userContoller.js'
import { upload } from '../middleware/multer.js'


const router = express.Router()


router.get('/current',isAuth,getUser)
router.get('/suggested',isAuth,suggestedUsers)
router.get('/getProfile/:username',isAuth,getProfile)
router.post('/editProfile',isAuth,upload.single('profileImage'),editProfile)
router.get('/follow/:targetUserId',isAuth,follow)
router.get('/following',isAuth,followingList)
router.get('/search',isAuth,search)
router.get('/getAllNotifications',isAuth,getAllNotifications)
router.post('/markAsRead',isAuth,markAsRead)

export default router