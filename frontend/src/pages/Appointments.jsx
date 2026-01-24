import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import RelatedHospitals from '../components/RelatedHospitals'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointments = () => {
    const { id } = useParams()
    const { doctors, hospitals, backendUrl, token, getDoctorsData, getHospitalsData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [info, setInfo] = useState(null)
    const [type, setType] = useState(null) // 'doctor' or 'hospital'
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const navigate = useNavigate()

    const fetchInfo = async () => {
        // Try to find in doctors first
        const docInfo = doctors.find(doc => doc._id === id)
        if (docInfo) {
            setInfo(docInfo)
            setType('doctor')
            return
        }

        // Then try hospitals
        const hospitalInfo = hospitals.find(h => h._id === id)
        if (hospitalInfo) {
            setInfo(hospitalInfo)
            setType('hospital')
            return
        }
    }

    const getAvailableSlots = async () => {
        if (!info) return;

        setDocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = info.slots_booked[slotDate] && info.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to book appointment')
            return navigate('/login')
        }

        try {
            const date = docSlots[slotIndex][0].datetime

            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            const slotDate = day + "_" + month + "_" + year

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { 
                providerId: info._id, 
                providerType: type,
                slotDate, 
                slotTime 
            }, { headers: { Authorization: `Bearer ${token}` } })
            
            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                getHospitalsData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchInfo()
    }, [doctors, hospitals, id])

    useEffect(() => {
        getAvailableSlots()
    }, [info])

    useEffect(() => {
        console.log(docSlots)
    }, [docSlots])

    return info && (
        <div className='transition-all duration-300'>
            {/* ---------- Provider Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-8 mt-4'>
                <div className="relative group self-start">
                    <img className='bg-[#5f6FFF] w-full sm:w-60 rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-[1.02]' src={info.image} alt={info.name} />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10"></div>
                </div>

                <div className='flex-1 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 py-6 bg-white dark:bg-[#0a0a0a] shadow-sm relative overflow-hidden'>
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] dark:opacity-[0.04] pointer-events-none">
                        <img className="w-32 h-32" src={assets.verified_icon} alt="" />
                    </div>

                    {/* Badge System */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-100 dark:border-green-800/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Verified
                        </div>
                        {type === 'doctor' && (
                            <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                info.hospitalId 
                                ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-100/30' 
                                : 'bg-orange-50/50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 border-orange-100/30'
                            }`}>
                                {info.hospitalId ? 'Institutional Staff' : 'Private Clinic'}
                            </div>
                        )}
                        {type === 'hospital' && (
                            <div className="px-2.5 py-1 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100/30">
                                Global Facility
                            </div>
                        )}
                    </div>

                    {/* Name & Title */}
                    <h1 className='text-2xl font-black text-gray-900 dark:text-white mb-0.5 tracking-tight'>
                        {info.name}
                    </h1>
                    <div className='flex items-center gap-2 text-xs text-gray-400 font-bold mb-5'>
                        <span className="uppercase tracking-tighter">{info.degree}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="uppercase tracking-tighter">{info.speciality}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-[#5f6FFF] tracking-tighter">{info.experience} EXP</span>
                    </div>

                    {/* About Section */}
                    <div className='mb-6'>
                        <h3 className='flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2'>
                            Professional Profile
                        </h3>
                        <p className='text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-[600px]'>
                            {info.about}
                        </p>
                    </div>

                    {/* Institutional Context - Compact Mini Card */}
                    {type === 'doctor' && info.hospitalId && (
                        <div 
                            onClick={() => navigate(`/hospital/${info.hospitalId}`)}
                            className='group px-3 py-1.5 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/30 cursor-pointer hover:bg-blue-500 hover:border-transparent transition-all flex items-center justify-between mb-6 w-fit min-w-[220px]'
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300 group-hover:bg-white/20 group-hover:text-white transition-all">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                                </div>
                                <div className="max-w-[150px]">
                                    <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest group-hover:text-blue-100 transition-all">Affiliated At</p>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 text-[11px] truncate group-hover:text-white transition-all">
                                        {hospitals.find(h => h._id === info.hospitalId)?.name || 'Facility Name'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-gray-400 group-hover:text-white transition-all">
                                <svg className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                            </div>
                        </div>
                    )}

                    {/* Pricing removal - verified status instead */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active & Available</p>
                        </div>
                        {type === 'hospital' && (
                            <div className="max-w-[180px] text-right">
                                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Queue Sync Active</p>
                                <p className="text-[9px] text-gray-400 leading-tight italic">Administrators will assign a specialist upon check-in.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --------- Booking slots --------- */}
            <div className='sm:ml-60 sm:pl-8 mt-4 font-medium text-gray-700 dark:text-gray-300'>
                <p className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4">Availability</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll no-scrollbar'>
                    {
                        docSlots.length && docSlots.map((item, index) => (
                            <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all ${slotIndex === index ? 'bg-[#5f6FFF] text-white' : 'border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-900'}`} key={index}>
                                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                        ))
                    }
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 no-scrollbar'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all ${item.time === slotTime ? 'bg-[#5f6FFF] text-white' : 'text-gray-400 border border-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-900'}`} key={index}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>
                <button onClick={bookAppointment} className='bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6 hover:scale-105 transition-all shadow-lg active:scale-95'>Book an appointment</button>
            </div>

            {/* Listing Related Providers */}
            {type === 'doctor' ? (
                <RelatedDoctors docId={id} speciality={info.speciality} hospitalId={info.hospitalId} />
            ) : (
                <RelatedHospitals hospitalId={id} speciality={info.speciality} />
            )}
        </div>
    )
}

export default Appointments
