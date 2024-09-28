import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import connectDb from './config/connectDb.js';
import passport from 'passport';
import userRoutes from './routes/userRoute.js'

const app = express();

const PORT = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI

const corsOption = {
    origin: process.env.FRONTED_HOST ,
    Credential: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOption));

connectDb(MONGODB_URI)

app.use(express.json());

app.use(passport.initialize())

app.use(cookieParser())

app.use('/api/user', userRoutes)

app.listen(PORT, ()=>{
    console.log(`Serevr listening at http://localhost:${PORT}`);
});