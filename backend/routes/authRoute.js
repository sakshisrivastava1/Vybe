import express from 'express' 
import { isAuth } from '../middleware/isAuth.js'
import { login, logout, signup } from '../controllers/authController.js'
const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.get('/logout',isAuth,logout)

export default router