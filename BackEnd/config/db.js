import mongoose from "mongoose" 
import dotenv from "dotenv"

dotenv.config()

let cachedConnection = null

const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection
    }
    try {
        cachedConnection = await mongoose.connect( process.env.MONGO_URL )
        console.log("database connected successfully") ;
        return cachedConnection
    } catch( error ) {
        cachedConnection = null
        console.error("MongoDB connection failed:", error.message) ;
    }
}




export default connectDB