import { Router } from 'express'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { addGig, addReview, checkGigOrder, editGig, getAllGigs, getGigData, getGigs, getSellerGigs, searchGig, searchRecommendedGigs } from '../controllers/GigsControllers.js';
import { uploadGigs } from '../middlewares/Multer.js';
const gigsRoutes = Router();

gigsRoutes.post('/add', verifyToken,uploadGigs.array("images",5), addGig);
gigsRoutes.get('/get-user-gigs',verifyToken, getGigs);
gigsRoutes.get('/get-gig-data/:gigId',verifyToken, getGigData);
gigsRoutes.put('/edit-gig/:gigId',verifyToken,uploadGigs.array("images",5),editGig);
gigsRoutes.get('/search',searchGig);
gigsRoutes.get('/check-gig-order/:gigId', verifyToken, checkGigOrder);
gigsRoutes.post('/add-review/:gigId',verifyToken,addReview);
gigsRoutes.get('/get-gigs',getAllGigs);
gigsRoutes.get('/get-recommended-gigs/:gigId',verifyToken,searchRecommendedGigs);
gigsRoutes.get('/get-seller-gigs/:sellerId/:gigId',verifyToken,getSellerGigs);

export default gigsRoutes