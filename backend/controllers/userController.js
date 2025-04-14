import Stripe from "stripe"
import Purchase from "../models/Purchase.js"
import User from "../models/User.js"

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