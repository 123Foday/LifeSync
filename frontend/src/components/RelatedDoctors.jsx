import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({speciality, docId}) => {

  const {doctors} = useContext(AppContext);
  const navigate = useNavigate();

  const [relDoc, setRelDocs] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(doc => doc.speciality === speciality && doc._id !== docId);
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className='container flex flex-col items-center gap-4 my-16 text-gray-900 dark:text-gray-100 transition-all duration-300'>
      <h1 className='text-3xl font-medium'>Related Doctors</h1>
      <p className='sm:w-1/3 text-center text-sm text-gray-600 dark:text-gray-400'>Simply browse through our extensive list of trusted doctors.</p>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relDoc.slice(0,5).map((item, index) => (
          <div onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0, 0)}} className='border border-blue-200 dark:border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-black shadow-sm' key={index}>
            <img className='w-full h-44 object-cover bg-blue-50 dark:bg-zinc-950' src={item.image} alt="" />
            <div className='p-4'>
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'} `}>
                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
              <p className='text-gray-900 dark:text-gray-100 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>{ navigate('/doctors'); scrollTo(0,0) }} className='bg-blue-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-300 px-6 md:px-12 py-3 rounded-full mt-10 hover:scale-105 transition-all'>View More</button>
    </div>
  )
}

export default RelatedDoctors
