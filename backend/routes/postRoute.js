import express from 'express' 
import { isAuth } from '../middleware/isAuth.js'
import { comment, like, save, getPosts, uploadPost } from '../controllers/postController.js'
import { upload } from '../middleware/multer.js'

const router = express.Router()

router.post('/upload',isAuth,upload.single('media'),uploadPost)
router.get('/getAll',isAuth,getPosts)
router.get('/like/:postId',isAuth,like)
router.get('/saved/:postId',isAuth,save)
router.post('/comment/:postId',isAuth,comment)


export default router