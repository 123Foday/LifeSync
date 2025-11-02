import React from 'react'
import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)

  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])
  console.log("dashData:", dashData)

  return dashData && (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Dashboard Overview</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12' src={assets.doctor_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{dashData.doctors}</p>
              <p className='text-sm font-medium text-gray-500'>Total Doctors</p>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12' src={assets.hospital_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{dashData.hospitals}</p>
              <p className='text-sm font-medium text-gray-500'>Total Hospitals</p>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12' src={assets.appointments_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{dashData.appointments}</p>
              <p className='text-sm font-medium text-gray-500'>Total Appointments</p>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12' src={assets.patients_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{dashData.patients}</p>
              <p className='text-sm font-medium text-gray-500'>Total Patients</p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm mt-6'>
        <div className='flex items-center gap-3 p-6 border-b'>
          <img src={assets.list_icon} alt="" className='w-5 h-5' />
          <h2 className='text-lg font-semibold text-gray-800'>Latest Bookings</h2>
        </div>

        <div className='p-4'>
          {
            dashData.latestAppointments.map((item, index) => (
              <div 
                className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 rounded-lg transition-colors duration-200 group' 
                key={index}
              >
                <img 
                  className='w-12 h-12 rounded-full object-cover border-2 border-gray-100' 
                  src={item.docData.image} 
                  alt={item.docData.name} 
                />
                <div className='flex-1'>
                  <p className='text-gray-800 font-medium mb-1'>{item.docData.name}</p>
                  <p className='text-gray-500 text-sm'>{slotDateFormat(item.slotDate)}</p>
                </div>
                {item.cancelled ? (
                  <span className='px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600'>
                    Cancelled
                  </span>
                ) : item.isComplete ? (
                  <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600'>
                    Completed
                  </span>
                ) : (
                  <button 
                    onClick={() => cancelAppointment(item._id)}
                    className='p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50'
                  >
                    <img className='w-5 h-5' src={assets.cancel_icon} alt="Cancel appointment" />
                  </button>
                )}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
