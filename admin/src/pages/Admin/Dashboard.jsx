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
    <div className='p-6 bg-gray-50 dark:bg-[#121212] min-h-screen transition-all duration-300'>
      <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6'>Dashboard Overview</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-800'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12 dark:brightness-200' src={assets.doctor_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{dashData.doctors}</p>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Doctors</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-800'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12 dark:brightness-200' src={assets.hospital_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{dashData.hospitals}</p>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Hospitals</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-800'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12 dark:brightness-200' src={assets.appointments_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{dashData.appointments}</p>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Appointments</p>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-800'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-inner'>
              <img className='w-12 h-12 dark:brightness-200' src={assets.patients_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{dashData.patients}</p>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Patients</p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 mt-10'>
        <div className='flex items-center gap-2.5 px-6 py-4 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800'>
          <img className='dark:brightness-200' src={assets.list_icon} alt="" />
          <p className='font-semibold text-gray-800 dark:text-gray-100'>Latest Bookings</p>
        </div>

        <div className='divide-y dark:divide-zinc-800'>
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => {
              const providerData = item.providerType === 'hospital' 
                ? item.hospitalData 
                : item.docData;
              
              if (!providerData) {
                return (
                  <div 
                    className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors' 
                    key={index}
                  >
                    <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center'>
                      <span className='text-gray-500 dark:text-gray-400 text-xs'>N/A</span>
                    </div>
                    <div className='flex-1 text-sm'>
                      <p className='text-gray-800 dark:text-gray-100 font-medium'>Provider data unavailable</p>
                      <p className='text-gray-600 dark:text-gray-400'>
                        {item.slotDate} | {item.slotTime}
                      </p>
                    </div>
                    <span className='text-xs text-gray-400 dark:text-gray-500'>
                      {item.providerType || 'doctor'}
                    </span>
                  </div>
                );
              }

              return (
                <div 
                  className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors' 
                  key={index}
                >
                  <img 
                    className='rounded-full w-10 border dark:border-zinc-800' 
                    src={providerData.image} 
                    alt={providerData.name || "Provider"} 
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14">?</text></svg>';
                    }}
                  />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 dark:text-gray-100 font-medium flex items-center gap-2'>
                      {providerData.name}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.providerType === 'hospital'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {item.providerType === 'hospital' ? 'HOSPITAL' : 'DOCTOR'}
                      </span>
                    </p>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {item.slotDate} | {item.slotTime}
                    </p>
                  </div>
                  {item.cancelled ? (
                    <p className='text-red-400 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded'>Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className='text-green-500 text-xs font-medium bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded'>Booked</p>
                  ) : (
                    <p className='text-blue-500 text-xs font-medium bg-blue-50 dark:bg-blue-900/10 px-2 py-1 rounded'>Scheduled</p>
                  )}
                </div>
              );
            })
          ) : (
            <div className='px-6 py-12 text-center text-gray-400 dark:text-gray-500'>
              No recent bookings found
            </div>
          )}
        </div>
      </div>
    </div>
    )
  }


export default Dashboard
