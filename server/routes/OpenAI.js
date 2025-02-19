import { Router } from 'express'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { openAI, openAIForBio } from '../utils/ai.js';

const aiRoutes = Router();

aiRoutes.post('/bio',openAIForBio);
aiRoutes.post('/suggestion',openAI);

export default aiRoutes;