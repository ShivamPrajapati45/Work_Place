import { Router } from 'express'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { getSellerData } from '../controllers/DashBoardControllers.js';
const dashBoardRoutes = Router();

dashBoardRoutes.get('/seller',verifyToken,getSellerData);

export default dashBoardRoutes;
