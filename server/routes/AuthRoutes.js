import { Router } from 'express'
import { editProfile, getUserInfo, googleAuth, login, logOut, setUserImage, setUserInfo, signup } from '../controllers/AuthControllers.js';
// import multer from 'multer';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { upload } from '../middlewares/Multer.js';

const authRoutes = Router();
// const upload = multer({ dest: 'uploads/profiles/' });


authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/google',googleAuth);
authRoutes.post('/get-user-info',verifyToken,getUserInfo);
authRoutes.post('/set-user-info',verifyToken,setUserInfo);
authRoutes.post('/set-user-image',
    verifyToken,
    upload.single('profileImage'),
    setUserImage
);
authRoutes.post('/logout',verifyToken,logOut);
authRoutes.post('/edit-profile',verifyToken,upload.single('profileImage'),editProfile);

export default authRoutes