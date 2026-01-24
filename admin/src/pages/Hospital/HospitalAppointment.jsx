import { useEffect, useContext, useState } from 'react'
import { HospitalContext } from '../../context/HospitalContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'

const HospitalAppointments = () => {

  const { hToken, appointments, getAppointments, cancelAppointment, completeAppointment, doctors, getDoctors, assignDoctor } = useContext(HospitalContext)
  const { calculateAge, slotDateFormat } = useContext(AppContext)
  
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    if (hToken) {
      getAppointments()
      getDoctors()
    }
  }, [hToken, getAppointments, getDoctors])

  const handleAssignClick = (appointment) => {
    setSelectedAppointment(appointment)
    setShowAssignModal(true)
  }

  const handleDoctorSelect = async (doctorId) => {
    if (selectedAppointment && doctorId) {
      await assignDoctor(selectedAppointment._id, doctorId)
      setShowAssignModal(false)
      setSelectedAppointment(null)
    }
  }

  return (
    <div className='w-full max-w-7xl m-5 transition-all duration-300 px-4'>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
            Hospital Appointments
            <span className="text-xs font-normal bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest">
              Institutional
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and assign doctors to incoming patient requests.</p>
        </div>
      </div>

      <div className='bg-white dark:bg-[#121212] border dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden'>
        <div className='hidden lg:grid grid-cols-[0.5fr_2fr_1fr_2.5fr_1.5fr_1fr] gap-4 py-5 px-8 border-b dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 font-black text-[11px] uppercase tracking-widest text-gray-400/80'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Assigned Doctor</p>
          <p className="text-right">Actions</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
          {appointments.length > 0 ? (
            [...appointments].reverse().map((item, index) => (
              <div 
                className='flex flex-col gap-4 lg:grid lg:grid-cols-[0.5fr_2fr_1fr_2.5fr_1.5fr_1fr] items-start lg:items-center text-gray-600 dark:text-gray-300 py-6 px-8 border-b dark:border-zinc-800/50 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all duration-300 group' 
                key={index}
              >
                <p className='hidden lg:block text-gray-400 font-mono text-xs'>{index + 1}</p>
                
                <div className='flex items-center gap-4 w-full lg:w-auto'>
                  <div className="relative">
                    <img className='w-12 h-12 rounded-2xl object-cover border-2 border-indigo-50 dark:border-indigo-900/20 shadow-sm' src={item.userData.image} alt={item.userData.name} />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#121212] bg-indigo-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <p className='font-bold text-gray-900 dark:text-gray-100 text-base mb-0.5'>{item.userData.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="lg:hidden text-[10px] font-black uppercase text-gray-400">ID: {item._id.slice(-6)}</span>
                      <span className="lg:hidden text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 px-1 rounded">Age: {calculateAge(item.userData.dob)}</span>
                    </div>
                  </div>
                </div>

                <p className='hidden lg:block font-medium dark:text-gray-200'>{calculateAge(item.userData.dob)}</p>
                
                <div className="w-full lg:w-auto">
                   <div className="flex items-center gap-2 mb-1 lg:mb-0">
                      <div className="p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg lg:hidden">
                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </div>
                      <p className="font-semibold lg:font-medium text-gray-800 dark:text-gray-200">
                        {slotDateFormat(item.slotDate)}, <span className="text-indigo-600 dark:text-indigo-400">{item.slotTime}</span>
                      </p>
                   </div>
                </div>

                <div className="w-full lg:w-auto">
                  {item.docId ? (
                    <div className="flex items-center gap-3 p-2 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100/50 dark:border-indigo-800/20">
                      <img className="w-8 h-8 rounded-lg object-cover" src={item.docData?.image} alt="" />
                      <div>
                        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Dr. {item.docData?.name.split(' ')[0]}</p>
                        <p className="text-[10px] text-indigo-500/70 dark:text-indigo-400/50 uppercase font-black">{item.docData?.speciality}</p>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAssignClick(item)}
                      disabled={item.cancelled || item.status === 'rejected' || item.isCompleted}
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border-2 border-dashed ${
                        item.cancelled || item.status === 'rejected' || item.isCompleted
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                        : 'border-indigo-200 text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 transition-all'
                      }`}
                    >
                      Assign Provider
                    </button>
                  )}
                </div>

                <div className='flex justify-end gap-3 w-full lg:w-auto'>
                  {item.status === 'rejected' ? (
                    <p className='text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-xl'>Rejected</p>
                  ) : item.cancelled ? (
                    <div className="flex flex-col items-end">
                       <p className='text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-xl'>Cancelled</p>
                       {item.cancelledBy && <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold">By {item.cancelledBy}</span>}
                    </div>
                  ) : (item.status === 'booked' || item.isCompleted) ? (
                    <p className='text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-xl border border-green-100/50'>Completed</p>
                  ) : (
                    <div className='flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300'>
                      <div 
                        onClick={() => cancelAppointment(item._id)} 
                        className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl cursor-pointer hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Cancel Appointment"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </div>
                      <div 
                        onClick={() => completeAppointment(item._id)} 
                        className="p-2 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-xl cursor-pointer hover:bg-green-500 hover:text-white transition-all shadow-sm"
                        title="Mark Completed"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-zinc-700">
               <div className="w-20 h-20 bg-gray-50 dark:bg-black rounded-full flex items-center justify-center mb-4 transition-all hover:scale-110">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
               </div>
               <p className="text-xl font-bold dark:text-gray-500">Wait list is clear</p>
               <p className="text-sm">New appointments will appear here automatically.</p>
            </div>
          )}
        </div>
      </div>

      {/*---------- Doctor Assignment Modal ----------*/}
      {showAssignModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-fade-in'>
          <div className='bg-white dark:bg-[#121212] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-zinc-800 transform animate-scale-in'>
            <div className='p-8 relative'>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              
              <h2 className='text-2xl font-black text-gray-900 dark:text-gray-100 mb-2'>Assign Specialist</h2>
              <p className='text-gray-500 dark:text-gray-400 mb-8 text-sm'>Select an available doctor from your medical staff to handle {selectedAppointment?.userData.name}'s appointment.</p>
              
              <div className='space-y-3 max-h-[350px] overflow-y-auto no-scrollbar pr-1'>
                {doctors.filter(d => d.available).length > 0 ? (
                  doctors.filter(d => d.available).map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => handleDoctorSelect(item._id)}
                      className='flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 hover:bg-indigo-500 hover:scale-[1.02] dark:hover:bg-indigo-600 transition-all cursor-pointer group'
                    >
                      <img className='w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-zinc-800' src={item.image} alt="" />
                      <div className="flex-1">
                        <p className='font-bold text-gray-900 dark:text-gray-100 group-hover:text-white transition-colors'>Dr. {item.name}</p>
                        <p className='text-xs text-indigo-500 dark:text-indigo-400 font-black uppercase tracking-tighter group-hover:text-indigo-100 transition-colors'>{item.speciality}</p>
                      </div>
                      <div className="bg-white/20 dark:bg-zinc-800 p-2 rounded-lg group-hover:bg-white group-hover:text-indigo-600 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                     <p className="text-gray-400 font-bold">No available doctors found</p>
                     <p className="text-xs text-gray-500 mt-1">Add doctors to your hospital or ensure they are marked as available.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-950 p-6 flex justify-end">
               <button 
                onClick={() => setShowAssignModal(false)}
                className="px-6 py-2 rounded-xl font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all text-sm uppercase tracking-widest"
               >
                 Maybe later
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospitalAppointments