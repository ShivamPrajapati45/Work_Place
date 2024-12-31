import { Router } from 'express'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { addMessage, getMessages, getUnreadMessages, markAsRead } from '../controllers/MessagesController.js';

const messageRoutes = Router();

messageRoutes.post('/add-messages/:orderId', verifyToken, addMessage);
messageRoutes.get('/get-messages/:orderId', verifyToken, getMessages);
messageRoutes.get('/unread-messages',verifyToken,getUnreadMessages);
messageRoutes.put('/mark-as-read/:messageId',verifyToken,markAsRead)
export default messageRoutes
