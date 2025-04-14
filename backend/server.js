import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDb from "./configs/mongodb.js"
import { clerkWebHooks, stripeWebhooks } from "./controllers/webhooks.js"
import educatorRouter from "./routes/educatorRoutes.js"

import { clerkMiddleware, requireAuth } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js"
import courseRouter from "./routes/courseRoutes.js"
import userRouter from "./routes/userRoutes.js"

const app=express()
const PORT=process.env.PORT 

await connectDb()
await connectCloudinary()

app.use(cors())
app.use(clerkMiddleware())

app.get("/",(req,res)=>{
    res.send("api working")
})

app.post("/clerk",express.json(),clerkWebHooks)

app.use("/api/educator",express.json(),educatorRouter)
app.use("/api/course",express.json(),courseRouter)
app.use("/api/user",express.json(),userRouter)
app.post("/stripe",express.raw({type:"application/json"}),stripeWebhooks)

app.listen(PORT,(req,res)=>{
    console.log("server started")
})