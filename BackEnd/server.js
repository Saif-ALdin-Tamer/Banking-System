import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import Routes from "./routes/index.js"

const app = express()

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true)
    if (origin.includes("localhost")) return callback(null, true)
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true)
    }
    if (/^https:\/\/banking-system[\w-]*\.vercel\.app$/.test(origin)) {
      return callback(null, true)
    }
    callback(null, false)
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))
app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({ server: "running", status: "ok" })
})

app.get("/api/health/db", async (req, res) => {
  try {
    await connectDB()
    res.json({ db: "connected", status: "ok" })
  } catch (error) {
    res.status(503).json({ db: "failed", status: "error", message: error.message })
  }
})

app.use("/api", async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error("Database unavailable:", error.message)
    res.status(503).json({
      message: "Database connection failed. Set MONGO_URL in Vercel environment variables.",
    })
  }
}, Routes)

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app
