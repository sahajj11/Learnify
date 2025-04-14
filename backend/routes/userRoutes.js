import express from "express"
import { getUserData, purchaseCourse } from "../controllers/userController.js"
import { getEnrolledStudentsData } from "../controllers/educatorController.js"

const userRouter=express.Router()

userRouter.get("/data",getUserData)
userRouter.get("/enrolled-courses",getEnrolledStudentsData)
userRouter.post("/purchase",purchaseCourse)


export default userRouter