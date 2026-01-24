import {assets} from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Icons = {
  ArrowRight: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
  ),
};

const Header = () => {
  const navigate = useNavigate();
  const { token, userData } = useContext(AppContext)

  return (
    <div className='relative flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-[#5f6FFF] to-[#4c1d95] dark:from-[#1e1e2d] dark:to-[#000000] rounded-3xl px-6 md:px-12 lg:px-16 overflow-hidden shadow-2xl transition-all duration-500 border border-white/10'>    
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none"></div>

      {/* -------left Side------- */ }
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-8 md:py-[4vw] z-10'>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-medium tracking-wide">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Trusted by 10k+ users
        </div>
        
        <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-bold leading-[1.1] tracking-tight'>
          Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Healthcare</span> <br className='hidden lg:block' /> Within Your Reach
        </h1>
        
        <p className='text-blue-100/80 text-sm sm:text-base md:text-lg max-w-md leading-relaxed'>
          Experience a new standard of medical appointments. Connect with top-tier specialists and world-class hospitals in just a few clicks.
        </p>

        <div className='flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto'>
          {token && userData ? (
            <button
              onClick={() => navigate("/hospitals")}
              className='group relative flex items-center justify-center gap-3 bg-white text-[#5f6FFF] px-6 py-3 rounded-2xl font-semibold transition-all hover:bg-blue-50 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] active:scale-95 w-full sm:w-auto overflow-hidden'
            >
              <span className="relative z-10">Explore Hospitals</span>
              <Icons.ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className='group relative flex items-center justify-center gap-3 bg-white text-[#5f6FFF] px-6 py-3 rounded-2xl font-semibold transition-all hover:bg-blue-50 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] active:scale-95 w-full sm:w-auto overflow-hidden'
            >
              <span className="relative z-10">Start Your Journey</span>
              <Icons.ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          <div className='flex items-center gap-4 mt-2 sm:mt-0'>
             <div className="flex -space-x-3 overflow-hidden">
                <img className="inline-block h-10 w-10 rounded-full object-cover shadow-md z-30" src={assets.doc1} alt="" />
                <img className="inline-block h-10 w-10 rounded-full object-cover shadow-md z-20" src={assets.doc2} alt="" />
                <img className="inline-block h-10 w-10 rounded-full object-cover shadow-md z-10" src={assets.doc3} alt="" />
             </div>
             <p className="text-blue-100/60 text-xs font-medium">Join 500+ doctors today</p>
          </div>
        </div>
      </div>    

      {/* -------Right Side------- */ }
      <div className='md:w-1/2 relative hidden md:block'>

        <img 
          className='w-full h-auto object-contain object-bottom max-h-[110%] absolute bottom-0 -right-5 scale-105 drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]' 
          src={assets.header_img} 
          alt="Healthcare Professional" 
        />
      </div>
    </div>
  )
}

export default Header;
