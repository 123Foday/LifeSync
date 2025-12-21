import {assets} from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate();
  const { token, userData } = useContext(AppContext)

  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-[#5f6FFF] rounded-lg px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden'>    
      {/* -------left Side------- */ }
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
        <p className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-semibold leading-tight text-center md:text-left'>
          Book Appointment <br className='hidden sm:block' /> With Trusted Doctors
        </p>
        <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm md:text-base font-light'>
          <img className='w-24 sm:w-28 md:w-32 flex-shrink-0' src={assets.group_profiles} alt="" />
          <p className='text-center sm:text-left'>Simply scroll through our extensive lists of trusted doctors, <br className='hidden sm:block' /> schedule your appointment hassle free</p>
        </div>
        {token && userData ? (
          <button
          onClick={() => navigate("/hospitals")}
          className='w-full sm:w-auto'
          >
            <a className='flex items-center justify-center gap-2 bg-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-gray-600 text-xs sm:text-sm md:text-base hover:scale-105 transition-all duration-300' href="#speciality">
              Book Appointment <img className='w-3' src={assets.arrow_icon} alt=""/>
            </a>
          </button>
          ):(
            <button
            onClick={() => navigate("/login")}
            className='w-full sm:w-auto'
            >
              <a className='flex items-center justify-center gap-2 bg-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-gray-700 text-xs sm:text-sm md:text-base hover:scale-105 transition-all duration-300' href="#speciality">
              Let&apos;s Dive In <img className='w-3' src={assets.arrow_icon} alt="" />
            </a>
          </button>
          )}
      </div>    

      {/* -------Right Side------- */ }
      <div className='md:w-1/2 relative'>
        <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
      </div>
        
    </div>
  )
}

export default Header
