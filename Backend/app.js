import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Serevr listening at http://localhost:${PORT}`);
})