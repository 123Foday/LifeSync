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

      {/* Latest Bookings Section */}
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => {
              // Safely get provider data based on appointment type
              const providerData = item.providerType === 'hospital' 
                ? item.hospitalData 
                : item.docData;
              
              // Fallback if provider data is missing
              if (!providerData) {
                return (
                  <div 
                    className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' 
                    key={index}
                  >
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                      <span className='text-gray-500 text-xs'>N/A</span>
                    </div>
                    <div className='flex-1 text-sm'>
                      <p className='text-gray-800 font-medium'>Provider data unavailable</p>
                      <p className='text-gray-600'>
                        {item.slotDate} | {item.slotTime}
                      </p>
                    </div>
                    <span className='text-xs text-gray-400'>
                      {item.providerType || 'doctor'}
                    </span>
                  </div>
                );
              }

              return (
                <div 
                  className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' 
                  key={index}
                >
                  <img 
                    className='rounded-full w-10' 
                    src={providerData.image} 
                    alt={providerData.name || "Provider"} 
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14">?</text></svg>';
                    }}
                  />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium flex items-center gap-2'>
                      {providerData.name}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.providerType === 'hospital'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.providerType === 'hospital' ? '🏥' : '👨‍⚕️'}
                      </span>
                    </p>
                    <p className='text-gray-600'>
                      {item.slotDate} | {item.slotTime}
                    </p>
                  </div>
                  {item.cancelled ? (
                    <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className='text-green-500 text-xs font-medium'>Completed</p>
                  ) : (
                    <p className='text-blue-500 text-xs font-medium'>Scheduled</p>
                  )}
                </div>
              );
            })
          ) : (
            <div className='px-6 py-8 text-center text-gray-400'>
              No recent bookings
            </div>
          )}
        </div>
      </div>
    </div>
    )
  }


export default Dashboard
