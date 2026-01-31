import express from 'express' 
import { isAuth } from '../middleware/isAuth.js'
import { login, logout, signup } from '../controllers/authController.js'
const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.get('/logout',isAuth,logout)
router.post('/sendOtp',sendOtp)
router.post('/verifyOtp',verifyOtp)
router.post('/resetPassword',resetPassword)

export default router
