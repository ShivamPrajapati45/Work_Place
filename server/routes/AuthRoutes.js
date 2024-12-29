import { Router } from 'express'
import { getUserInfo, login, setUserImage, setUserInfo, signup } from '../controllers/AuthControllers.js';
import multer from 'multer';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const authRoutes = Router();
const upload = multer({ dest: 'uploads/profiles/' });


authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/get-user-info',verifyToken,getUserInfo);
authRoutes.post('/set-user-info',verifyToken,setUserInfo);
authRoutes.post('/set-user-image',verifyToken,upload.single('profileImage'),setUserImage);

export default authRoutes