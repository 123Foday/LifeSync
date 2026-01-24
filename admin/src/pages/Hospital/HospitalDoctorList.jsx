import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { HospitalContext } from '../../context/HospitalContext'

const HospitalDoctorList = () => {
  const { doctors, hToken, backendUrl, getDoctors } = useContext(HospitalContext)

  useEffect(() => {
    if (hToken) {
      getDoctors()
    }
  }, [hToken])

  const removeDoctor = async (doctorId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/hospital/remove-doctor',
        { doctorId },
        { headers: { Authorization: `Bearer ${hToken}` } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll no-scrollbar transition-all duration-300'>
      <h1 className='text-lg font-medium text-gray-800 dark:text-gray-100'>Hospital Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors && doctors.length > 0 ? (
            doctors.map((item, index) => (
              <div className='border border-indigo-200 dark:border-zinc-800 rounded-xl max-w-56 overflow-hidden cursor-pointer group bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-900/50' key={index}>
                <img className='bg-indigo-50 dark:bg-zinc-950 transition-all duration-500 transform group-hover:bg-primary dark:group-hover:bg-[#4a58e6] w-full h-40 object-cover' src={item.image} alt="" />
                <div className='p-4'>
                  <p className='text-neutral-800 dark:text-gray-100 text-lg font-bold truncate'>{item.name}</p>
                  <p className='text-zinc-600 dark:text-gray-400 text-sm'>{item.speciality}</p>
                  <div className='mt-4 flex gap-2'>
                    <button
                      onClick={() => removeDoctor(item._id)}
                      className='flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 px-3 rounded-full transition-all shadow-md hover:shadow-red-500/20'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='w-full text-center py-20 text-gray-500 dark:text-gray-400'>
              <p>No doctors assigned yet. <a href='/hospital-add-doctor' className='text-primary font-medium hover:underline'>Add your first doctor</a></p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default HospitalDoctorList
