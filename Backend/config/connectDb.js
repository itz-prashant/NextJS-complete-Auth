import mongoose from "mongoose";

const connectDb = async(MONGODB_URI)=>{
    
    try {
       await mongoose.connect(MONGODB_URI).then(()=>console.log('Database Connected Successfully'))
    } catch (error) {
        console.log(error);   
    }
}

export default connectDb