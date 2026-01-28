import express from 'express'
import { isAuth } from '../middleware/isAuth.js'
import { upload } from '../middleware/multer.js'
import { comment, getAllLoops, like, uploadLoop } from '../controllers/loopcontroller.js'

const loopRoute = express.Router()


loopRoute.post('/upload',isAuth,upload.single('media'),uploadLoop)
loopRoute.get('/getAll',isAuth,getAllLoops)
loopRoute.get('/like/:loopId',isAuth,like)
loopRoute.post('/comment/:loopId',isAuth,comment)


export default loopRoute