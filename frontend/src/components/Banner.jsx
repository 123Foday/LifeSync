import { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Icons = {
  Calendar: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  ),
  UserPlus: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
  ),
};

const Banner = () => {
    const navigate = useNavigate();
    const { token, userData } = useContext(AppContext)

  return (
    <div className="relative flex flex-col md:flex-row bg-gradient-to-br from-[#5f6FFF] to-[#4c1d95] dark:from-[#1e1e2d] dark:to-[#000000] rounded-[2.5rem] px-8 sm:px-12 md:px-16 lg:px-24 my-24 overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 group">
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>

      {/*------left side------*/}
      <div className="flex-1 py-16 md:py-24 z-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          Ready to start?
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Book Your <span className="text-blue-400 font-black italic">Next</span> <br /> Appointment Today
        </h2>
        
        <p className="mt-6 text-gray-400 text-sm sm:text-base md:text-lg max-w-md leading-relaxed">
          Join thousands of satisfied patients who have found their perfect doctor through LifeSync's seamless booking platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          {token && userData ? (
            <button
              onClick={() => { navigate("/hospitals"); window.scrollTo({top:0, behavior:'smooth'}) }}
              className="flex items-center justify-center gap-3 bg-[#5f6FFF] text-white px-10 py-5 rounded-2xl font-bold transition-all hover:bg-[#4b58e6] hover:shadow-[0_20px_40px_-10px_rgba(95,111,255,0.4)] active:scale-95 w-full sm:w-auto overflow-hidden group/btn"
            >
              Take Action Now
              <Icons.Calendar size={20} className="transition-transform group-hover/btn:rotate-12" />
            </button>
          ) : (
            <button
              onClick={() => { navigate("/login"); window.scrollTo({top:0, behavior:'smooth'}) }}
              className="flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-bold transition-all hover:bg-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95 w-full sm:w-auto group/btn"
            >
              Get Started Free
              <Icons.UserPlus size={20} className="transition-transform group-hover/btn:scale-110" />
            </button>
          )}

          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold">
                    {i === 3 ? "24/7" : "DR"}
                  </div>
                ))}
             </div>
             <p className="text-xs font-semibold text-gray-300">Available Support</p>
          </div>
        </div>
      </div>

      {/*------right side position------*/}
      <div className="hidden lg:block lg:w-[450px] relative z-20">
        <img
          className="w-full absolute bottom-[-10%] right-[-10%] max-w-xl object-contain drop-shadow-[0_0_50px_rgba(95,111,255,0.3)] group-hover:scale-105 group-hover:translate-x-[-10px] group-hover:translate-y-[-10px] transition-transform duration-700"
          src={assets.appointment_img}
          alt="Appointment Hero"
        />
      </div>
    </div>
  );
}

export default Banner;
