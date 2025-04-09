import React, { useEffect, useRef, useState } from 'react'
import uniqid from "uniqid"
import quill from "quill"
import Quill from 'quill'
import { assets } from '../../assets/assets'

const AddCourse = () => {

  const quillRef=useRef(null)
  const editorRef=useRef(null)

  const [courseTitle,setCourseTitle]=useState("")
  const [coursePrice,setCoursePrice]=useState(0)
  const [discount,setDiscount]=useState(0)
  const [image,setImage]=useState(null)
  const [chapters,setChapters]=useState([])
  const [showPopUp,setShowPopUp]=useState(false)
  const [currentChapterId,setCurrentChapterId]=useState(null)

  const [lectureDetails,setLectureDetails]=useState({
    lectureTitle:"",
    lectureDuration:"",
    lectureUrl:"",
    isPreviewFree:false
  })

  useEffect(()=>{
    if(!quillRef.current && editorRef.current){
      quillRef.current=new Quill(editorRef.current,{
        theme:"snow"
      }
      )
    }
  },[])

  return (
   <>
   <div className='h-screen overflow-hidden flex flex-col items-start justify-betweenmd:p-8 md:pb-0 p-4 pt-8 pb-0'>
    <form className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
      <div className='flex flex-col gap-1'>
        <p>Course Title</p>
        <input className='outline-none py-2 px-3 rounded border border-gray-500  md:py-2.5' onChange={(e)=>setCourseTitle(e.target.value)} placeholder='Type here' value={courseTitle} required />
      </div>
      <div className='flex flex-col gap-1'>
        <p>Course Description</p>
        <div ref={editorRef}></div>
        </div>


        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input type="number" placeholder='0' className='outline-none py-2 px-3 rounded border border-gray-500  md:py-2.5' onChange={(e)=>setCoursePrice(e.target.value)} value={coursePrice}/>
          </div>

          <div className='flex mt-6 md:flex-row flex-col items-center gap-3'>
            <p>Thumbnail</p>
            <label htmlFor='thumbnailImage' className='flex items-center gap-3'>
              <img className='p-3 bg-blue-500 rounded' src={assets.file_upload_icon}/>
              <input type="file" accept='image/*' onChange={(e)=>setImage(e.target.files[0])} id="thumbnailImage" />
              <img className='max-h-10' src={image ? URL.createObjectURL(image) : ""} />
            </label>
          </div>

        </div>


        <div className='flex flex-col gap-1'>
          <p>Discount %</p>
          <input type="number" placeholder='0' className='outline-none py-2 px-3 rounded border border-gray-500  md:py-2.5' min={0} max={100} onChange={(e)=>setDiscount(e.target.value)} value={discount}/>
        </div>

        <div>
          {chapters.map((chapter,index)=>(
            <div key={index} className='bg-white border rounded-lg mb-4'>
              <div className='flex justify-between items-centerp-4 border-b'>
                <div className='flex items-center'>
                  <img className='mr-2 cursor-pointer' width={14} src={assets.down_arrow_icon} />
                  <span className='font-semibold'>{index +1}{chapter.chapterTile}</span>
                </div>
                <span className='text-gray-500'>{chapter.chapterContent.length}Lectures</span>
                <img src={assets.cross_icon} className='cursor-pointer' />
                </div>
                {}
              </div>
          ))}
        </div>



    </form>
   </div>
   </>
  )
}

export default AddCourse