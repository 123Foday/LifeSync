import { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Banner = () => {

    const navigate = useNavigate();
    const { token, userData } = useContext(AppContext)

  return (
    <div className="container flex flex-col md:flex-row bg-[#5f6FFF] rounded-lg px-4 sm:px-6 md:px-10 lg:px-12 mt-8 sm:mt-10 mb-12 sm:mb-16 md:mb-20 overflow-hidden">
      {/*------left side------*/}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 flex flex-col items-center md:items-start">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white text-center md:text-left">
          <p>Book Appointment</p>
          <p className="mt-2 sm:mt-4">With 100+ Trusted Doctors</p>
        </div>
        {token && userData ? (
          <button
          onClick={() => {
            navigate("/hospitals");
            scrollTo(0, 0);
          }}
          className="flex items-center justify-center gap-2 bg-white text-xs sm:text-sm md:text-base text-gray-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full mt-4 sm:mt-6 hover:scale-105 transition-all w-full sm:w-auto"
        >
          Book Appointment
          <img className="w-3" src={assets.arrow_icon} alt="" />
        </button>
        ):(
          <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="flex items-center justify-center gap-2 bg-white text-xs sm:text-sm md:text-base text-gray-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full mt-4 sm:mt-6 hover:scale-105 transition-all w-full sm:w-auto"
        >
          Create Account
          <img className="w-3" src={assets.arrow_icon} alt="" />
        </button>
        )}
      </div>

      {/*------right side position------*/}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative mt-4 md:mt-0">
        <img
          className="w-full absolute bottom-0 right-0 max-w-md object-contain"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
}

export default Banner
