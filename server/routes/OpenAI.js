import { Router } from 'express'
import { openAIForBio, openAIForSkill } from '../utils/ai.js';

const aiRoutes = Router();

aiRoutes.post('/bio',openAIForBio);
aiRoutes.post('/skill',openAIForSkill);

export default aiRoutes;