import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import Routes from "./routes/index.js"

const app = express()
app.use( cors() )
app.use( express.json() )

app.use("/api", Routes)

const PORT = 4000 ;

app.listen(PORT, () => {
    console.log(`Server Is Running On Port ${PORT} `)
})

connectDB()

