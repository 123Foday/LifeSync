import React, { useEffect, useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)

  const { calculateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5 transition-all duration-300'>

      <p className='mb-3 text-lg font-medium text-gray-800 dark:text-gray-100'>All Appointments</p>

      <div className='bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll no-scrollbar'>

        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_3fr_1fr] gap-1 py-4 px-6 border-b dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 font-bold text-gray-700 dark:text-gray-200'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Action</p>
        </div>

        {
          appointments.reverse().map((item, index) => (
            <div className='flex flex-col gap-3 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_3fr_1fr] items-start sm:items-center text-gray-600 dark:text-gray-300 py-4 px-6 border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors' key={index}>
              <p className='hidden sm:block text-gray-500 dark:text-gray-400'>{index + 1}</p>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <div className='flex items-center gap-2'>
                  <img className='w-8 rounded-full border dark:border-zinc-800' src={item.userData.image} alt="" />
                  <p className='font-medium text-gray-800 dark:text-gray-100'>{item.userData.name}</p>
                </div>
                <p className='text-xs text-gray-500 dark:text-gray-400 sm:hidden'>Age: {calculateAge(item.userData.dob)}</p>
              </div>
              <p className='hidden sm:block'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              {
                item.status === 'rejected' ? (
                  <p className='text-red-400 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded'>Rejected</p>
                ) : item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded'>Cancelled</p>
                ) : (item.status === 'booked' || item.isCompleted) ? (
                  <p className='text-green-500 text-xs font-medium bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded'>Booked</p>
                ) : (
                  <div className='flex gap-2'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer hover:scale-110 transition-transform' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer hover:scale-110 transition-transform' src={assets.tick_icon} alt="" />
                  </div>
                )
              }
            </div>
          ))
        }

      </div>
    </div>
  )
}

export default DoctorAppointments