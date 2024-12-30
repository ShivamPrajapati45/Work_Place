import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { addOrder, confirmOrder, getBuyerOrders, getSellerOrders } from '../controllers/OrdersControllers.js';
const orderRoutes = Router();

orderRoutes.post('/create',verifyToken,addOrder);
orderRoutes.post('/success',verifyToken,confirmOrder);
orderRoutes.get('/get-buyer-orders',verifyToken,getBuyerOrders);
orderRoutes.get('/get-seller-orders',verifyToken,getSellerOrders);


export default orderRoutes;
