import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { connectToDb } from './config/db.js'
connectToDb()
import cookieParser from "cookie-parser";
import cors from 'cors'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import loopRoute from './routes/loopRoute.js'
import storyRoute from './routes/storyRoute.js';
import messageRoute from './routes/messageRoute.js';
import { app, server } from './socket.js'


const port = process.env.PORT || 4000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'https://vybe-frontend-08a9.onrender.com',
  credentials: true   
}))


app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)
app.use('/api/post',postRoute)
app.use('/api/loop',loopRoute)
app.use('/api/story',storyRoute)
app.use('/api/message',messageRoute)

app.get('/', (req, res) => res.send('Hello World!'))


server.listen(port, () => console.log(`App listening on port ${port}!`))
