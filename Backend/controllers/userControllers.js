import UserModel from "../models/User.js";
import bcrypt from "bcrypt" 

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
}

export default UserController;