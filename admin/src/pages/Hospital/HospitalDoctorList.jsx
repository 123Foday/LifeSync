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
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>Hospital Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors && doctors.length > 0 ? (
            doctors.map((item, index) => (
              <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                <img className='bg-indigo-50 transition-all duration-500 transform group-hover:bg-primary group-hover:brightness-90 w-full h-40 object-cover' src={item.image} alt="" />
                <div className='p-4'>
                  <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                  <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                  <div className='mt-4 flex gap-2'>
                    <button
                      onClick={() => removeDoctor(item._id)}
                      className='flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 px-2 rounded transition-all'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='w-full text-center py-10 text-gray-500'>
              <p>No doctors assigned yet. <a href='/hospital-add-doctor' className='text-primary font-medium'>Add your first doctor</a></p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default HospitalDoctorList
