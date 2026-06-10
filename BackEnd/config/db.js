import mongoose from "mongoose"

let cachedConnection = null

const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection
    }

    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI
    if (!mongoUrl) {
        throw new Error("MONGO_URL environment variable is not set")
    }

    try {
        cachedConnection = await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 10000,
            maxPoolSize: 10,
        })
        console.log("Database connected successfully")
        return cachedConnection
    } catch (error) {
        cachedConnection = null
        console.error("MongoDB connection failed:", error.message)
        throw error
    }
}

export default connectDB
