import { Router } from 'express'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { addGig, addReview, checkGigOrder, editGig, getGigData, getGigs, searchGig } from '../controllers/GigsControllers.js';
import { uploadGigs } from '../middlewares/Multer.js';
const gigsRoutes = Router();

gigsRoutes.post('/add', verifyToken,uploadGigs.array("images",5), addGig);
gigsRoutes.get('/get-user-gigs',verifyToken, getGigs);
gigsRoutes.get('/get-gig-data/:gigId',verifyToken, getGigData);
gigsRoutes.put('/edit-gig/:gigId',verifyToken,uploadGigs.array("images",5),editGig);
gigsRoutes.get('/search',searchGig);
gigsRoutes.get('/check-gig-order/:gigId', verifyToken, checkGigOrder);
gigsRoutes.post('/add-review/:gigId',verifyToken,addReview);

export default gigsRoutes