import { Router } from 'express'
import multer from 'multer';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { addGig, editGig, getGigData, getGigs, searchGig } from '../controllers/GigsControllers.js';

const gigsRoutes = Router();
const upload = multer({ dest: 'uploads/' });

gigsRoutes.post('/add', verifyToken,upload.array("images"), addGig);
gigsRoutes.get('/get-user-gigs',verifyToken, getGigs);
gigsRoutes.get('/get-gig-data/:gigId',verifyToken, getGigData);
gigsRoutes.put('/edit-gig/:gigId',verifyToken,upload.array("images"),editGig);
gigsRoutes.get('/search',searchGig);

export default gigsRoutes