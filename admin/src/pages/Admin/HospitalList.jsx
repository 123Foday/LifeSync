import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const HospitalList = () => {
  const { hospitals, aToken, getAllHospitals, changeHospitalAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllHospitals()
    }
  }, [aToken, getAllHospitals])

  return (
    <div className='p-6 bg-gray-50 dark:bg-black min-h-screen transition-all duration-300'>
      <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6'>Hospitals List</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {hospitals.map((hospital) => (
          <div key={hospital._id} className='bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-zinc-800 overflow-hidden'>
            <div className='relative'>
              <img 
                className='w-full h-48 object-cover' 
                src={hospital.image} 
                alt={hospital.name} 
              />
              <div 
                onClick={() => changeHospitalAvailability(hospital._id)}
                className={`absolute top-4 right-4 p-2 rounded-full cursor-pointer ${
                  hospital.available ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                <img src={assets.tick_icon} alt="" className='w-4 h-4 invert'/>
              </div>
            </div>

            <div className='p-6'>
              <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2'>{hospital.name}</h2>
              
              <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2'>
                <span className='font-medium dark:text-gray-300'>Speciality:</span>
                <span>{hospital.speciality}</span>
              </div>

              <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2'>
                <span className='font-medium dark:text-gray-300'>Experience:</span>
                <span>{hospital.experience}</span>
              </div>


              <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
                <span className='font-medium dark:text-gray-300'>Address:</span>
                <span>{hospital.address.line1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HospitalList
