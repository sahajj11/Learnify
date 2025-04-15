import Stripe from "stripe"
import Purchase from "../models/Purchase.js"
import User from "../models/User.js"
import { courseProgress } from "../models/CourseProgress.js"
import Course from "../models/Course.js"

export const getUserData=async(req,res)=>{
    try{
        const userId=req.auth.userId
        const user=await User.findById(userId)

        if(!user){
            res.json({success:false,message:"user not found"})
        }

        res.json({succes:true,user})

    }catch(err){

        res.json({success:false,message:err.message})

    }

}




export const userEnrolledCourses=async(req,res)=>{
    try{
        const userId=req.auth.userId
        const userData=await User.findById(userId).populate("enrolledCourses")

        res.json({success:true,enrolledCourses:userData.enrolledCourses})

    }catch(err){

        res.json({success:false,message:err.message})


    }
}


//purchase course
export const purchaseCourse=async(req,res)=>{
    try{
        const {courseId}=req.body
        const {origin}=req.headers
        const userId=req.auth.userId
        const userData=await User.findById(userId)
        const courseData=await Course.findById(courseId)

        if(!courseData || !userData){
            return res.json({success:false,message:"data not found"})
        }

        const purchaseData={
            courseId:courseData._id,
            userId,
            amount:(courseData.coursePrice-courseData.discount*courseData.coursePrice/100).toFixed(2)
        }

        const newPurchase=await Purchase.create(purchaseData)

        //STRIPE PATMENT GATEWAY
        const stripeInstance=new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency=process.env.CURRENCY.toLowerCase()

        const line_items=[{
            price_data:{
                currency,
                product_data:{
                    name:courseData.courseTitle
                },
                unit_amount:Math.floor(newPurchase.amount)*100
            },
            quantity:1
        }]

        const session=await stripeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-enrollments`,
            cancel_url:`${origin}/`,
            line_items:line_items,
            mode:"payment",
            metadata:{
                purchaseId:newPurchase._id.toString()
            }
        })

        res.json({success:true,session_url:session.url})



        

    }catch(err){

        res.json({success:false,message:err.message})

    }
}

export const updateUserCourseProgress=async(req,res)=>{
    try{
        const userId=req.auth.userId
        const {courseId,lectureId}=req.body
        const progressData=await courseProgress.findOne({userId,courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:true,message:"lecture already completed"})
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }else{
            await courseProgress.create({
                userId,
                courseId,
                lectureCompleted:[lectureId]
            })
        }

        res.json({success:true,message:"progress updated"})

    }catch(err){

        res.json({success:false,message:err.message})



    }
}


export const getUserCourseProgress=async(req,res)=>{

    try{
        const userId=req.auth.userId
        const {courseId}=req.body
        const progressData=await courseProgress.findOne({userId,courseId})

        res.json({sucess:true,progressData})

    }catch(err){
        res.json({success:false,message:err.message})

    }

   
}



export const addUserRating=async(req,res)=>{
    const userId=req.auth.userId
    const {courseId,rating}=req.body

    if(!courseId || !userId || !rating || rating<1 || rating>5){
        return res.json({message:"invalid details"})
    }


    try{
        const course=await Course.findById(courseId)
        
        if(!course){
            return res.json({message:"course not found"})

        }

        const user=await User.findById(userId)

        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success:false,message:"user has not purchased this course"})
        }

        const existingRatingIndex=course.courseRatings.findIndex(r=>r.userId===userId)

        if(existingRatingIndex>-1){
            course.courseRatings[existingRatingIndex].rating=rating

        }else{
            course.courseRatings.push({userId,rating})
        }

        await course.save()
        res.json({success:true,message:"rating added"})
    }catch(err){

        res.json({success:false,message:err.message})


    }
}