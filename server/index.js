import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoutes.js';
import gigsRoutes from './routes/GigsRoutes.js';
import orderRoutes from './routes/OrdersRoutes.js';
import messageRoutes from './routes/MessagesRoute.js'
import dashBoardRoutes from './routes/DashBoardRoutes.js';
import aiRoutes from './routes/OpenAI.js';
import {app, server} from './socket/socket.js'
import prisma from './connection.js';

dotenv.config();
const port = process.env.PORT || 4009

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET','POST','PUT','DELETE','PATCH'],
    credentials: true
}));

app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigsRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/message',messageRoutes);
app.use('/api/dashboard',dashBoardRoutes);
app.use('/api/ai',aiRoutes);


server.listen(port,()=> {
    console.log(`server is running on port:${port}`)
});


// Prisma ko server shutdown hone se pahle disconnect karega
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});