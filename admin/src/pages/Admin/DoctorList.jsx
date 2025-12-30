import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'


const DoctorList = () => {

  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(()=>{
    if (aToken) {
      getAllDoctors()
    }
  },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll no-scrollbar transition-all duration-300'>
      <h1 className='text-lg font-medium text-gray-800 dark:text-gray-100'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item, index)=>(
             <div className='border border-indigo-200 dark:border-zinc-800 rounded-xl max-w-56 overflow-hidden cursor-pointer group bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-900/50' key={index}>
              <img className='bg-indigo-50 dark:bg-zinc-950 transition-all duration-500 transform group-hover:bg-primary dark:group-hover:bg-[#4a58e6]' src={item.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-800 dark:text-gray-100 text-lg font-bold truncate'>{item.name}</p>
                <p className='text-zinc-600 dark:text-gray-400 text-sm'>{item.speciality}</p>
                <div className='mt-3 flex items-center gap-2 text-sm'>
                  <input 
                    className='accent-primary cursor-pointer' 
                    onChange={()=>changeAvailability(item._id)} 
                    type="checkbox" 
                    checked={item.available}
                    id={`avail-${item._id}`}
                  />
                  <label htmlFor={`avail-${item._id}`} className='cursor-pointer text-gray-700 dark:text-gray-300'>Available</label>
                </div>
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default DoctorList
