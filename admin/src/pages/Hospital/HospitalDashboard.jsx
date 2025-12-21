import { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { HospitalContext } from '../../context/HospitalContext'

const HospitalDashboard = () => {

  const { hToken, dashData, getDashData, completeAppointment, cancelAppointment, doctors, getDoctors } = useContext(HospitalContext)
  const { currency, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (hToken) {
      getDashData()
      getDoctors()
    }
  }, [hToken])

  return dashData && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.people_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{doctors.length}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.bookedCount}</p>
            <p className='text-gray-400'>Booked</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>

      </div>


      <div className='bg-white'>

        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.userData.image} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                </div>
                {
                  item.status === 'rejected' ? (
                    <p className='text-red-400 text-xs font-medium'>Rejected</p>
                  ) : item.cancelled ? (
                    <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                  ) : (item.status === 'booked' || item.isCompleted) ? (
                    <p className='text-green-500 text-xs font-medium'>Booked</p>
                  ) : (
                    <div className='flex'>
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

      {/* Hospital Doctors Section */}
      <div className='bg-white mt-10'>
        <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border'>
          <img src={assets.people_icon} alt="" />
          <p className='font-semibold'>Your Doctors ({doctors.length})</p>
        </div>

        {doctors && doctors.length > 0 ? (
          <div className='pt-4 border border-t-0'>
            {
              doctors.map((doctor, index) => (
                <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100 border-b last:border-b-0' key={index}>
                  <img className='rounded-full w-10' src={doctor.image} alt="" />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium'>{doctor.name}</p>
                    <p className='text-gray-600'>{doctor.speciality}</p>
                  </div>
                  <p className={`text-xs font-medium ${doctor.available ? 'text-green-500' : 'text-red-500'}`}>
                    {doctor.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
              ))
            }
          </div>
        ) : (
          <div className='px-6 py-6 text-center text-gray-600'>
            <p>No doctors assigned to this hospital yet</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default HospitalDashboard
