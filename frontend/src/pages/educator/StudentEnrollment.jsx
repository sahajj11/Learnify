import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/student/Loading'

const StudentEnrollment = () => {

  const [enrolledStudents,setEnrolledStudents]=useState([])

  const fetchEnrolledStudents=async()=>{
    setEnrolledStudents(dummyDashboardData)
  }

  useEffect(()=>{
    fetchEnrolledStudents()
  },[])


  return enrolledStudents ? (
    <>

    <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-mg bg-white border border-gray-500/20'>

        <table className='md:table-auto table-fixed w-full overflow-hidden pb-4'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
          <tr>
                <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                <th className='px-4 py-3 font-semibold '>Student Name</th>
                <th className='px-4 py-3 font-semibold '>Course Title</th>
                <th className='px-4 py-3 font-semibold  hidden sm:table-cell'>Date</th>
                </tr>
          </thead>

         

          
        </table>

      </div>
    </div>
    </>
  ):<Loading />
}

export default StudentEnrollment