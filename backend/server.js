import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDb from "./configs/mongodb.js"
import { clerkWebHooks } from "./controllers/webhooks.js"

const app=express()
const PORT=process.env.PORT 

app.use(cors())
await connectDb()

app.get("/",(req,res)=>{
    res.send("api working")
})

app.post("/clerk",express.json(),clerkWebHooks)

app.listen(PORT,(req,res)=>{
    console.log("server started")
})