import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'


const Doctors = () => {

  const { speciality } = useParams();
  const { doctors, hospitals } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const applyFilter = () => {
    if(speciality){
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className='transition-all duration-300'>
      <p className='text-gray-600 dark:text-gray-400'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button 
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-[#5f6FFF] text-white' : 'dark:border-gray-700 dark:text-gray-300'}`} 
          onClick={()=>setShowFilter(prev => !prev)}
        >
          Filters
        </button>
        <div className={`flex-col gap-4 text-sm text-gray-600 dark:text-gray-400 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>

          <p onClick={()=> speciality ==='General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-full sm:w-auto pl-3 py-1.5 pr-6 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black dark:bg-indigo-900/30 dark:text-gray-100" : "hover:bg-gray-50 dark:hover:bg-gray-800" }`}>General physician</p>

          <p onClick={()=> speciality ==='Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-full sm:w-auto pl-3 py-1.5 pr-6 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black dark:bg-indigo-900/30 dark:text-gray-100" : "hover:bg-gray-50 dark:hover:bg-gray-800" }`}>Gynecologist</p>

          <p onClick={()=> speciality ==='Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-full sm:w-auto pl-3 py-1.5 pr-6 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black dark:bg-indigo-900/30 dark:text-gray-100" : "hover:bg-gray-50 dark:hover:bg-gray-800" }`}>Dermatologist</p>

          <p onClick={()=> speciality ==='Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-full sm:w-auto pl-3 py-1.5 pr-6 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black dark:bg-indigo-900/30 dark:text-gray-100" : "hover:bg-gray-50 dark:hover:bg-gray-800" }`}>Pediatricians</p>

          <p onClick={()=> speciality ==='Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-full sm:w-auto pl-3 py-1.5 pr-6 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black dark:bg-indigo-900/30 dark:text-gray-100" : "hover:bg-gray-50 dark:hover:bg-gray-800" }`}>Neurologist</p>

          <p onClick={()=> speciality ==='Psychologist' ? navigate('/doctors') : navigate('/doctors/Psychologist')} className={`w-full sm:w-auto pl-3 py-1.5 pr-6 border border-gray-300 dark:border-gray-800 rounded transition-all cursor-pointer ${speciality === "Psychologist" ? "bg-indigo-100 text-black dark:bg-indigo-900/30 dark:text-gray-100" : "hover:bg-gray-50 dark:hover:bg-zinc-900" }`}>Psychologist</p>

          <p onClick={()=> speciality ==='Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-full sm:w-auto pl-3 py-1.5 pr-6 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black dark:bg-indigo-900/30 dark:text-gray-100" : "hover:bg-gray-50 dark:hover:bg-gray-800" }`}>Gastroenterologist</p>
        </div>

        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 '>
          {
            filterDoc.map((item, index) => (
          <div onClick={()=>navigate(`/appointment/${item._id}`)} className='border border-blue-200 dark:border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-black shadow-sm' key={index}>
            <img className='bg-blue-50 dark:bg-zinc-950' src={item.image} alt="" />
            <div className='p-4'>
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'} `}>
                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
              <p className='text-gray-900 dark:text-gray-100 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>{item.speciality}</p>
              {item.hospitalId ? (
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Institutional
                    </span>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                      {hospitals.find(h => h._id === item.hospitalId)?.name || 'Hospital'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <span className="text-[9px] bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Private Specialist
                  </span>
                </div>
              )}
            </div>
          </div>
        ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors
