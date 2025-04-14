import mongoose from "mongoose";

const PurchaseSchema=new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        requitred:true
    },
    userId:{
        type:String,
        ref:"User",
        required:true
    },
    amount:{type:Number,required:true},
    status:{type:String,enum:["pending","completed","failed"]}
},{timestamps:true})

const Purchase=new mongoose.model("Purchase",PurchaseSchema)
export default Purchase