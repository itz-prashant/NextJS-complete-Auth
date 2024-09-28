import transporter from "../config/emailConfig.js";
import EmailVerificationModel from "../models/EmailVerification.js";


const sendEmailVarificationOTP = async (req, user) => {
    // Generate random 4-digit number
    const otp = Math.floor(1000 + Math.random()*9000);

    await new EmailVerificationModel({userId: user._id, otp: otp}).save();
    
    // OTP varification Link
    const otpVerificationLink = `${process.env.FRONTED_HOST}/account/verifi-email`;

    await transporter.sendMail({
        form: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'OTP - Varify your account',
        html: `<p>Dear ${user.name},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP):${otpVerificationLink} </p>
        <h2>OTP: ${otp}</h2>
        <p>This OTP is valid for 15 minutes. If you didn't request this OTP, please ignore this email.</p>`
    })
    return otp
}

export default sendEmailVarificationOTP