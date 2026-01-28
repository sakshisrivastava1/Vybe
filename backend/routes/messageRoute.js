import express from "express";
import { getAllMessages, getPrevUserChats, sendMessage } from "../controllers/messageController.js";
import { isAuth } from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router()

router.post('/send/:receiverId',isAuth,upload.single('image'), sendMessage)
router.get('/getAll/:receiverId',isAuth, getAllMessages)
router.get('/prevChats',isAuth, getPrevUserChats)

export default router