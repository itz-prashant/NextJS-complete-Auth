import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465 false for other ports
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

export default transporter