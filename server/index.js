import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoutes.js';
import gigsRoutes from './routes/GigsRoutes.js';
dotenv.config({
    path: true
});
const app = express();
const port = process.env.PORT || 3001

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}));

app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigsRoutes);


app.listen(port,()=> {
    console.log(`server is running on port:${port}`)
});