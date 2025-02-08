import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http'

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],  // FrontEnd URL
        methods: ['GET','POST'],
    }
});

const userSocketMap = new Map(); //This is for checking which user is online



io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId != undefined){
        userSocketMap.set(userId.toString(), socket.id)
    }else{
        console.log('User ID is not coming');
    }
    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

    socket.on('disconnect', () => {
        if(userId){
            userSocketMap.delete(userId.toString());
        }
        io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

    });

});

const getReceiverSocketId = (receiverId) => {
    return userSocketMap.get(receiverId?.toString());
}

export { app,io,server,getReceiverSocketId,userSocketMap };
