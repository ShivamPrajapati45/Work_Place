import { Router } from 'express'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { openAI } from '../utils/ai.js';

const aiRoutes = Router();

aiRoutes.post('/suggestion',openAI);

export default aiRoutes;