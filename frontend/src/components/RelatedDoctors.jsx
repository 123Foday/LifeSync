import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId, hospitalId }) => {

    const { doctors, hospitals } = useContext(AppContext);
    const navigate = useNavigate();

    const [relDoc, setRelDocs] = useState([]);

    useEffect(() => {
        if (doctors.length > 0) {
            let filtered = [];
            if (hospitalId) {
                // If hospitalId is provided, show doctors from that hospital
                filtered = doctors.filter(doc => doc.hospitalId === hospitalId && doc._id !== docId);
            } else if (speciality) {
                // Otherwise fallback to speciality matching
                filtered = doctors.filter(doc => doc.speciality === speciality && doc._id !== docId);
            }
            setRelDocs(filtered);
        }
    }, [doctors, speciality, docId, hospitalId]);

    const findHospitalName = (hId) => {
        if (!hId) return null;
        const hosp = hospitals.find(h => h._id === hId);
        return hosp ? hosp.name : null;
    }

    if (relDoc.length === 0) return null;

    return (
        <div className='flex flex-col items-center gap-6 my-16 text-gray-900 dark:text-gray-100 transition-all duration-300'>
            <div className="text-center">
                <h1 className='text-3xl font-bold tracking-tight mb-2'>
                    {hospitalId ? "Recommended Specialists" : "Related Doctors"}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                    {hospitalId ? "Trusted medical staff from this facility ready to assist you." : "Explore specialists who can help with your specific medical needs."}
                </p>
            </div>

            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5 px-3 sm:px-0'>
                {relDoc.slice(0, 4).map((item, index) => (
                    <div 
                        onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }} 
                        className='group border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#5f6FFF]/10 transition-all duration-500 bg-white dark:bg-black' 
                        key={index}
                    >
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <img className='w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110' src={item.image} alt={item.name} />
                            <div className="absolute top-4 left-4">
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-lg border border-white/20 shadow-lg ${item.available ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></span>
                                    {item.available ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                        
                        <div className='p-5'>
                            <div className="flex items-center justify-between mb-1">
                                <p className='text-xs font-black text-[#5f6FFF] uppercase tracking-tighter'>
                                    {item.speciality}
                                </p>
                                {item.hospitalId ? (
                                    <span title={`Affiliated with ${findHospitalName(item.hospitalId)}`} className="text-[10px] text-blue-500 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                                        INST
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">PRIV</span>
                                )}
                            </div>
                            
                            <p className='text-gray-900 dark:text-gray-100 text-lg font-bold group-hover:text-[#5f6FFF] transition-colors mb-1'>{item.name}</p>
                            
                            {item.hospitalId && (
                                <p className="text-[10px] text-gray-400 font-medium truncate mb-3 italic">
                                    At {findHospitalName(item.hospitalId)}
                                </p>
                            )}
                            
                            <div className="flex items-center gap-3 pt-3 border-t border-gray-50 dark:border-gray-900">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.experience} EXPERIENCE</p>
                                <div className="ml-auto p-2 rounded-lg bg-gray-50 dark:bg-gray-900 group-hover:bg-[#5f6FFF] group-hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }} 
                className='mt-10 px-12 py-4 rounded-2xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl'
            >
                Connect With More Experts
            </button>
        </div>
    )
}

export default RelatedDoctors
