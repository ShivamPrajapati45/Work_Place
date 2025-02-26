import { Router } from 'express'
import { generateDescription, generateFeatures, generateServiceTitle, openAIForBio, openAIForSkill } from '../utils/ai.js';

const aiRoutes = Router();

aiRoutes.post('/bio',openAIForBio);
aiRoutes.post('/skill',openAIForSkill);
aiRoutes.post('/title',generateServiceTitle);
aiRoutes.post('/desc',generateDescription);
aiRoutes.post('/features',generateFeatures);


export default aiRoutes;