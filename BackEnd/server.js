import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
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