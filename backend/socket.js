import http from 'http';
import express from 'express'
import { Server, Socket } from 'socket.io'

export const app = express()
export const server = http.createServer(app)

export const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})

const userSocketMap = {}

export const getSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId
    if(userId != undefined){
        userSocketMap[userId] = socket.id
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))

    socket.on('disconnect',()=>{
        delete userSocketMap[userId]
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
    })
})