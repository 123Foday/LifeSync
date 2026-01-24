import { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { HospitalContext } from '../../context/HospitalContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../context/ThemeContext';


const HospitalDashboard = () => {

  const { hToken, dashData, getDashData, completeAppointment, cancelAppointment, doctors, getDoctors } = useContext(HospitalContext)
  const { currency, slotDateFormat } = useContext(AppContext)
  const { theme } = useTheme()


  useEffect(() => {
    if (hToken) {
      getDashData()
      getDoctors()
      const interval = setInterval(() => {
        getDashData()
        getDoctors()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [hToken])

  if (!dashData) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background dark:bg-zinc-950'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
          <p className='text-gray-500 dark:text-gray-400 font-medium animate-pulse'>Loading Hospital Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='m-5 transition-all duration-300'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white dark:bg-zinc-900 p-4 min-w-52 rounded-xl border border-gray-100 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-all'>
          <img className='w-14' src={assets.people_icon} alt="" />
          <div>
            <p className='text-xl font-bold text-gray-800 dark:text-gray-100'>{doctors.length}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white dark:bg-zinc-900 p-4 min-w-52 rounded-xl border border-gray-100 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-bold text-gray-800 dark:text-gray-100'>{dashData.appointments}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Total Appts</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white dark:bg-zinc-900 p-4 min-w-52 rounded-xl border border-gray-100 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-bold text-gray-800 dark:text-gray-100'>{dashData.bookedCount}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Booked</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white dark:bg-zinc-900 p-4 min-w-52 rounded-xl border border-gray-100 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-bold text-gray-800 dark:text-gray-100'>{dashData.patients}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Total Patients</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10'>
        {/* Trends Chart */}
        <div className='lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800'>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100 mb-6'>Facility Activity Trends</h2>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashData.trends}>
                <defs>
                  <linearGradient id="hospitalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#333' : '#eee'} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: theme === 'dark' ? '#888' : '#666', fontSize: 12}}
                  tickFormatter={(str) => str.split('-').slice(1).join('/')}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fill: theme === 'dark' ? '#888' : '#666', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none'}}
                />
                <Area type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#hospitalColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className='bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800'>
          <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100 mb-6'>Appointment Status</h2>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashData.statusDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#F87171" />
                  <Cell fill="#5F6FFF" />
                </Pie>
                <Tooltip 
                   contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-wrap justify-center gap-4 mt-4'>
              {['Completed', 'Cancelled', 'Active'].map((label, i) => (
                <div key={label} className='flex items-center gap-1.5'>
                  <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-red-400' : 'bg-primary'}`}></div>
                  <span className='text-[10px] uppercase font-bold text-gray-500'>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div className='bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 mt-10'>

        <div className='flex items-center gap-2.5 px-6 py-4 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold text-gray-800 dark:text-gray-100'>Latest Bookings</p>
        </div>

        <div className='divide-y dark:divide-zinc-800'>
          {
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors' key={index}>
                <img className='rounded-full w-10 border dark:border-zinc-800' src={item.userData.image} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 dark:text-gray-100 font-medium'>{item.userData.name}</p>
                  <p className='text-gray-600 dark:text-gray-400'>{slotDateFormat(item.slotDate)}</p>
                </div>
                {
                  item.status === 'rejected' ? (
                    <p className='text-red-400 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded'>Rejected</p>
                  ) : item.cancelled ? (
                    <p className='text-red-400 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded'>Cancelled</p>
                  ) : (item.status === 'booked' || item.isCompleted) ? (
                    <p className='text-green-500 text-xs font-medium bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded'>Booked</p>
                  ) : (
                    <div className='flex gap-2'>
                      <img onClick={() => cancelAppointment(item._id)} className='w-8 cursor-pointer hover:scale-110 transition-transform' src={assets.cancel_icon} alt="" />
                      <img onClick={() => completeAppointment(item._id)} className='w-8 cursor-pointer hover:scale-110 transition-transform' src={assets.tick_icon} alt="" />
                    </div>
                  )

                }
              </div>
            ))
          }

        </div>
      </div>

      {/* Hospital Doctors Section */}
      <div className='bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 mt-10'>
        <div className='flex items-center gap-2.5 px-6 py-4 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800'>
          <img src={assets.people_icon} alt="" />
          <p className='font-semibold text-gray-800 dark:text-gray-100'>Your Doctors ({doctors.length})</p>
        </div>

        {doctors && doctors.length > 0 ? (
          <div className='divide-y dark:divide-zinc-800'>
            {
              doctors.map((doctor, index) => (
                <div className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors' key={index}>
                  <img className='rounded-full w-10 border dark:border-zinc-800' src={doctor.image} alt="" />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 dark:text-gray-100 font-medium'>{doctor.name}</p>
                    <p className='text-gray-600 dark:text-gray-400'>{doctor.speciality}</p>
                  </div>
                  <p className={`text-xs font-medium px-2 py-1 rounded ${doctor.available ? 'text-green-500 bg-green-50 dark:bg-green-900/10' : 'text-red-500 bg-red-50 dark:bg-red-900/10'}`}>
                    {doctor.available ? 'Available' : 'Not Available'}
                  </p>
                </div>
              ))
            }
          </div>
        ) : (
          <div className='px-6 py-12 text-center text-gray-500 dark:text-gray-400'>
            <p>No doctors assigned to this hospital yet</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default HospitalDashboard
