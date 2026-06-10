import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import Routes from "./routes/index.js"

const app = express()

app.use( cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, mobile apps, Postman)
    if (!origin) return callback(null, true)
    
    // Allow all Vercel preview/production URLs for our frontend
    if (origin.includes("banking-system-front-end") && origin.includes("vercel.app")) {
      return callback(null, true)
    }
    
    // Allow localhost for development
    if (origin.includes("localhost")) {
      return callback(null, true)
    }
    
    // Allow custom FRONTEND_URL from env
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true)
    }

    callback(new Error("Not allowed by CORS"))
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}) )

app.use( express.json() )

// Ensure DB is connected before every request (required for serverless)
app.use(async (req, res, next) => {
  await connectDB()
  next()
})

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ server: "running", status: "ok" })
})

app.use("/api", Routes)

// Local development server (Vercel uses export default app)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app