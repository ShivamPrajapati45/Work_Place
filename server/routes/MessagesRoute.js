import { Router } from 'express'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { addMessage, getMessages } from '../controllers/MessagesController.js';

const messageRoutes = Router();

messageRoutes.post('/add-messages/:orderId', verifyToken, addMessage);
messageRoutes.get('/get-messages/:orderId', verifyToken, getMessages);
export default messageRoutes
