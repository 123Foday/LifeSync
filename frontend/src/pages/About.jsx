import React from 'react'
import { assets } from '../assets/assets'

const Icons = {
  Zap: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  ),
  Smartphone: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
  ),
  UserCheck: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
  ),
  Quote: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></svg>
  )
};

const About = () => {
  return (
    <div className='transition-all duration-300'>
      
      {/* Hero Section */}
      <div className='relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white p-8 sm:p-12 md:p-20 mb-16'>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#1e1e2d] to-black opacity-90 z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5f6FFF]/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className='relative z-10 flex flex-col md:flex-row gap-12 items-center'>
            <div className='flex-1 space-y-6 text-center md:text-left'>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold tracking-wider uppercase text-blue-300">
                  Who We Are
               </div>
               <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold leading-tight'>
                  Redefining <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'>Healthcare</span> Access
               </h1>
               <div className="flex flex-col gap-4 text-gray-300 leading-relaxed text-lg">
                  <p>Welcome to LifeSync, your trusted partner in managing your healthcare needs conveniently and efficiently. We understand the challenges individuals face when scheduling doctor appointments and managing health records.</p>
                  <p>We are committed to excellence in healthcare technology, continuously striving to enhance our platform with the latest advancements to improve user experience and deliver superior service.</p>
               </div>
            </div>
            
            <div className='flex-1 relative'>
               <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500 group">
                  <div className="absolute inset-0 bg-[#5f6FFF]/20 mix-blend-overlay group-hover:opacity-0 transition-opacity"></div>
                  <img className='w-full object-cover' src={assets.about_image} alt="About LifeSync" />
               </div>
               {/* Floating Badge */}
               <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl animate-float hidden md:block border border-gray-100 dark:border-gray-800">
                 <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-[#5f6FFF]">
                       <Icons.Quote size={24} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-gray-900 dark:text-white">Our Vision</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Seamless healthcare for everyone.</p>
                    </div>
                 </div>
               </div>
            </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className='mb-20'>
        <div className="text-center mb-12">
           <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>Why Choose <span className="text-[#5f6FFF]">LifeSync?</span></h2>
           <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">We bring healthcare to your fingertips with features designed for your peace of mind.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              title: 'Efficiency',
              desc: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
              icon: Icons.Zap,
              color: 'text-yellow-500',
              bg: 'bg-yellow-50 dark:bg-yellow-900/20'
            },
            {
              title: 'Convenience',
              desc: 'Access to a network of trusted healthcare professionals in your area.',
              icon: Icons.Smartphone,
              color: 'text-blue-500',
              bg: 'bg-blue-50 dark:bg-blue-900/20'
            },
            {
              title: 'Personalization',
              desc: 'Tailored recommendations and reminders to help you stay on top of your health.',
              icon: Icons.UserCheck,
              color: 'text-green-500',
              bg: 'bg-green-50 dark:bg-green-900/20'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className='premium-card p-10 flex flex-col items-center text-center gap-6 group hover:border-[#5f6FFF] hover:bg-gray-50 dark:hover:bg-zinc-900/50'
            >
              <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                 <item.icon size={32} />
              </div>
              <div>
                <b className='text-xl text-gray-900 dark:text-white block mb-3'>{item.title}</b>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-sm'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default About

