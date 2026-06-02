import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import connectDB from "./config/db.js"
import Routes from "./routes/index.js"

const app = express()

app.use( cors({
  origin: process.env.FRONTEND_URL || "https://banking-system-front-end-git-main-saif-al-din-s-projects.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}) )

app.use( express.json() )


app.use(async (req, res, next) => {
  await connectDB()
  next()
})

/*
// Health check route
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState
  const statusMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" }
  res.json({
    server: "running",
    database: statusMap[dbStatus] || "unknown",
    mongo_url_exists: !!process.env.MONGO_URL,
    jwt_secret_exists: !!process.env.JWT_SECRET,
  })
})
*/
app.use("/api", Routes)

export default app

