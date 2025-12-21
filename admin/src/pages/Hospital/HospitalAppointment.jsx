import { useEffect, useContext } from 'react'
import { HospitalContext } from '../../context/HospitalContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const HospitalAppointments = () => {

  const { hToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(HospitalContext)

  const { calculateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (hToken) {
      getAppointments()
    }
  }, [hToken, getAppointments])

  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_3fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Action</p>
        </div>

        {
          appointments.reverse().map((item, index) => (
            <div className='flex flex-col gap-3 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_3fr_1fr] items-start sm:items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='hidden sm:block'>{index + 1}</p>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <div className='flex items-center gap-2'>
                  <img className='w-8 rounded-full' src={item.userData.image} alt="" />
                  <p className='font-medium'>{item.userData.name}</p>
                </div>
                <p className='text-xs text-gray-500 sm:hidden'>Age: {calculateAge(item.userData.dob)}</p>
              </div>
              <p className='hidden sm:block'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              {
                item.status === 'rejected' ? (
                  <p className='text-red-400 text-xs font-medium'>Rejected</p>
                ) : item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : (item.status === 'booked' || item.isCompleted) ? (
                  <p className='text-green-500 text-xs font-medium'>Booked</p>
                ) : (
                  <div className='flex gap-2'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
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

export default HospitalAppointments