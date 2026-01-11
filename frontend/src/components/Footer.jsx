import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Icons = {
  MapPin: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
  ),
  Phone: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  ),
  Mail: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
  ),
};

const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer className='border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-[#0a0a0a] pt-20 pb-10 text-gray-800 dark:text-gray-100 mt-20'>
      <div className='max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16'>
          {/*--------Brand Section---------*/}
          <div className='space-y-6'>
            <img className='w-40 transition-all hover:scale-105' src={assets.logo} alt="LifeSync" />
            <p className='text-gray-500 dark:text-gray-400 leading-relaxed text-sm max-w-sm'>
              LifeSync is redefining modern healthcare accessibility. Our mission is to bridge the gap between world-class medical specialists and patients through a seamless, technology-driven platform.
            </p>
            <div className="flex gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-[#5f6FFF] hover:border-[#5f6FFF] hover:text-white transition-all duration-300 cursor-pointer shadow-sm group">
                    <span className="text-[10px] font-bold group-hover:scale-110 transition-transform">Soc</span>
                 </div>
               ))}
            </div>
          </div>

          {/*--------Quick Links---------*/}
          <div>
            <h4 className='text-sm font-bold uppercase tracking-widest mb-8 text-gray-900 dark:text-white'>Platform</h4>
            <ul className='flex flex-col gap-4 text-sm font-medium text-gray-600 dark:text-gray-400'>
              <li onClick={()=>navigate('/')} className='cursor-pointer hover:text-[#5f6FFF] hover:pl-2 transition-all duration-300'>Home</li>
              <li onClick={()=>navigate('/doctors')} className='cursor-pointer hover:text-[#5f6FFF] hover:pl-2 transition-all duration-300'>Find Doctors</li>
              <li onClick={()=>navigate('/hospitals')} className='cursor-pointer hover:text-[#5f6FFF] hover:pl-2 transition-all duration-300'>Hospitals</li>
              <li onClick={()=>navigate('/medical-advisor')} className='cursor-pointer hover:text-[#5f6FFF] hover:pl-2 transition-all duration-300'>Health Advisor</li>
            </ul>
          </div>

          {/*--------Support---------*/}
          <div>
            <h4 className='text-sm font-bold uppercase tracking-widest mb-8 text-gray-900 dark:text-white'>Company</h4>
            <ul className='flex flex-col gap-4 text-sm font-medium text-gray-600 dark:text-gray-400'>
              <li onClick={()=>navigate('/about')} className='cursor-pointer hover:text-[#5f6FFF] hover:pl-2 transition-all duration-300'>About us</li>
              <li onClick={()=>navigate('/about')} className='cursor-pointer hover:text-[#5f6FFF] hover:pl-2 transition-all duration-300'>Contact us</li>
              <li onClick={()=>navigate('/terms-conditions')} className='cursor-pointer hover:text-[#5f6FFF] hover:pl-2 transition-all duration-300'>Terms of service</li>
              <li onClick={()=>navigate('/privacy-policy')} className='cursor-pointer hover:text-[#5f6FFF] hover:pl-2 transition-all duration-300'>Privacy policy</li>
            </ul>
          </div>

          {/*--------Contact---------*/}
          <div className='space-y-6'>
            <h4 className='text-sm font-bold uppercase tracking-widest mb-8 text-gray-900 dark:text-white'>Get In Touch</h4>
            <div className='space-y-5'>
              <div className="flex items-start gap-4 group">
                 <div className="p-2 rounded-lg bg-blue-50 dark:bg-zinc-900 group-hover:bg-[#5f6FFF] transition-colors duration-300">
                    <Icons.MapPin size={20} className="text-[#5f6FFF] group-hover:text-white transition-colors" />
                 </div>
                 <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-1 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>0050 Liverpool Street, Freetown, Sierra Leone</p>
              </div>
              <div className="flex items-center gap-4 group">
                 <div className="p-2 rounded-lg bg-blue-50 dark:bg-zinc-900 group-hover:bg-[#5f6FFF] transition-colors duration-300">
                    <Icons.Phone size={20} className="text-[#5f6FFF] group-hover:text-white transition-colors" />
                 </div>
                 <p className='text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>(+232) 88-915-854</p>
              </div>
              <div className="flex items-center gap-4 group">
                 <div className="p-2 rounded-lg bg-blue-50 dark:bg-zinc-900 group-hover:bg-[#5f6FFF] transition-colors duration-300">
                    <Icons.Mail size={20} className="text-[#5f6FFF] group-hover:text-white transition-colors" />
                 </div>
                 <p className='text-sm text-gray-600 dark:text-gray-400 break-all group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors'>support@lifesync.sl</p>
              </div>
            </div>
          </div>
        </div>

        <div className='pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6'>
          <p className='text-xs font-semibold text-gray-400'>&copy; 2025 LifeSync Technologies. All rights reserved.</p>
          <div className="flex items-center gap-8 text-xs font-bold text-gray-400">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="cursor-pointer hover:text-[#5f6FFF] transition-colors">STATUS: OPERATIONAL</span>
             </div>
             <span className="cursor-pointer hover:text-[#5f6FFF] transition-colors">SECURITY: AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
