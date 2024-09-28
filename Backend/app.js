import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();

const PORT = process.env.PORT;

const corsOption = {
    origin: process.env.FRONTED_HOST ,
    Credential: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOption));

app.use(express.json());


app.listen(PORT, ()=>{
    console.log(`Serevr listening at http://localhost:${PORT}`);
});