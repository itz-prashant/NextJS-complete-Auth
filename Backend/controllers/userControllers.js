import UserModel from "../models/User.js";
import bcrypt from "bcrypt" 
import sendEmailVarificationOTP from "../utils/sendEmailVarificationOTP.js";
import EmailVerificationModel from "../models/EmailVerification.js";

class UserController{

    // User Registration
    static userRegistration = async(req, res)=>{
        try {
            const {name, email, password, password_confirmation} = req.body

            if(!name || !email || !password || !password_confirmation){
                return res.status(400).json({
                    status: "failed",
                    message: 'All fields are required'
                });
            }

            if(password !== password_confirmation){
                return res.status(400).json({
                    status: "failed",
                    message: "Password and Confirm password don't match"
                });
            }

            const existingUser = await UserModel.findOne({email})
                if(existingUser){
                    return res.status(409).json({
                        status: "failed",
                        message: "Email already exist"
                });
            }
            
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = await new UserModel({
                name,
                email,
                password: hashPassword
            }).save()

            sendEmailVarificationOTP(req, newUser)

            res.status(201).json({
                status: "success",
                message: "Registration Success",
                user: {id: newUser._id, email: newUser.email}
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "failed",
                message: 'Unable to register, please try again later'
            })
        }
    }

    // User Email Verification

    static verifyEmail = async (req,res)=>{
        try {
            const {email, otp} = req.body;
            if( !email || !otp){
                return res.status(400).json({
                    status: "failed",
                    message: 'All fields are required'
                });
            }

            const existingUser = await UserModel.findOne({email})
                if(!existingUser){
                    return res.status(409).json({
                        status: "failed",
                        message: "Email does not exist"
                });
            }

            if(existingUser.isVarified){
                return res.status(400).json({
                    status: "failed",
                    message: "Email is already verified"
                });
            }

            const emailVerification = await EmailVerificationModel.findOne({
                userId: existingUser._id, otp
            })

            if(!emailVerification){
                if(!existingUser.isVarified){
                    await sendEmailVarificationOTP(req, existingUser)
                    return res.status(400).json({
                        status: "failed",
                        message: "Invalid OTP , new OTP sent to your email"
                    });

                }
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid OTP"
                });
            }

            const currentTime = new Date()
            const expireTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000)

            if(currentTime > expireTime){
                await sendEmailVarificationOTP(req, existingUser)
                return res.status(400).json({
                    status: "failed",
                    message: "OTP expire , new OTP sent to your email"
                });
            }

            existingUser.isVarified = true;
            await existingUser.save()

            await EmailVerificationModel.deleteMany({userId: existingUser._id})

            res.status(202).json({
                status: "success",
                message: "Email Verified successfully",
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "failed",
                message: 'Unable to verify email'
            })
        }
    } 
}

export default UserController;