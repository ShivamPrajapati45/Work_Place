import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { createOrder, deleteOrder, getBuyerOrders, getOrderDetail, getSellerOrders, updateOrder } from '../controllers/OrdersControllers.js';
const orderRoutes = Router();

orderRoutes.post('/create',verifyToken,createOrder);
orderRoutes.post('/update/:orderId',verifyToken,updateOrder);
orderRoutes.post('/delete/:orderId',verifyToken,deleteOrder);
orderRoutes.get('/get/:orderId',verifyToken,getOrderDetail);

// orderRoutes.post('/success/:orderId',verifyToken,confirmOrder);

orderRoutes.get('/get-buyer-orders',verifyToken,getBuyerOrders);
orderRoutes.get('/get-seller-orders',verifyToken,getSellerOrders);


export default orderRoutes;
