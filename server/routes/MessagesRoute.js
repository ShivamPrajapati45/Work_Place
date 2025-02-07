import { Router } from 'express'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { getUnreadMessages, markAsRead, receiveMessage, sendMessage } from '../controllers/MessagesController.js';

const messageRoutes = Router();

messageRoutes.get('/unread-messages',verifyToken,getUnreadMessages);
messageRoutes.put('/mark-as-read/:messageId',verifyToken,markAsRead);

// Sockets Parts Execution and implementation
messageRoutes.post('/send/:receiverId/:orderId', verifyToken, sendMessage);
messageRoutes.get('/receive/:receiverId', verifyToken, receiveMessage);

export default messageRoutes
