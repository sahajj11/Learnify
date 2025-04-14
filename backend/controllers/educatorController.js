import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

export const updateRoleToEducator = async (req, res) => {
  try {
    console.log("Auth object:", req.auth);
   


    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({ success: true, message: "You can publish a course" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong",err });

  }
};


//add new course
export const addCourse=async(req,res)=>{

  try{
    const {courseData}=req.body
    const imageUrl=req.file
    const educatorId=req.auth.userId

    if(!imageUrl){
      return res.json({success:false,message:"thumbnail not attached"})
    }

    const parsedCourseData=await JSON.parse(courseData)
    parsedCourseData.educator=educatorId
    const newCourse=await Course.create(parsedCourseData)
    const imageUpload=await cloudinary.uploader.upload(imageFile.path)
    newCourse.courseThumbnail=imageUpload.secure_url
    await newCourse.save()

    res.json({success:true,message:"course added"})

  }catch(err){
    res.json({success:false,message:err.message})

  }

  
}

//get educator course
export const getEducatorCourses=async(req,res)=>{
  try{
    const educator=req.auth.userId
    const courses=await Course.find({educator})
    res.json({succes:true,courses})


  }catch(err){

    res.json({succes:false,message:err.message})

  }
}

//dashboard
export const educatorDashboardData=async(req,res)=>{

  try{
    const educator=req.auth.userId
    const courses=await Course.find({educator})
    const totalCourses=courses.length

    const courseIds=courses.map(course=>course._id)

    const purchases=await Purchase.find({
      courseId:{$in:courseIds},
      status:"completed"
    })

    const totalEarnings=purchases.reduce((sum,purchase)=>sum+purchase.amount,0)

    const enrolledStudentsData=[]

    for(const course of courses){
      const students=await User.find({
        _id:{$in:course.enrolledStudentsData}
      },"name imageUrl")

      students.forEach(student=>{
        enrolledStudentsData.push({
          courseTitle:course.courseTitle,
          student
        })
      })
    }

    res.json({succes:true,dashboardData:{
      totalEarnings,totalCourses,enrolledStudentsData
    }})

  }catch(err){

    res.json({success:false,message:err.message})

  }

}

//enrolled students data
export const getEnrolledStudentsData=async(req,res)=>{

  try{
    const educator=req.auth.userId
    const courses=await Course.find({educator})
  

    const courseIds=courses.map(course=>course._id)

    const purchase=await Purchase.find({
      courseId:{$in:courseIds},
      status:"completed"
    }).populate("userId","name imageUrl").populate("courseId","courseTitle")

    const enrolledStudents=purchase.map(purchase=>({
      student:purchase.userId,
      courseTitle:purchase.courseId.courseTitle,
      purchaseDate:purchase.createdAt
    }))

    res.json({success:true,enrolledStudents})
  }catch(err){

    res.json({success:false,message:err.message})

  }

}