import mongoose from "mongoose" 
import dotenv from "dotenv"

dotenv.config()


const connectDB = async () => {
    try{
        await mongoose.connect( process.env.MONGO_URL )
        console.log("data base connected successfully") ;
    } catch( error ) {
        console.error("MongoDB connection failed:", error.message) ;
    }
}




export default connectDB 