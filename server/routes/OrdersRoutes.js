import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { addOrder, confirmOrder } from '../controllers/OrdersControllers.js';
const orderRoutes = Router();

orderRoutes.post('/create',verifyToken,addOrder);
orderRoutes.post('/success',verifyToken,confirmOrder);


export default orderRoutes;
