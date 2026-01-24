import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Icons = {
  Stethoscope: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3Z"/><path d="M10 22v-2"/><path d="M7 12h10"/><path d="M10 2c0 1.1.9 2 2 2s2-.9 2-2z"/><path d="M10 14.5c.3-1 .7-1.5 1.5-1.5h1c.8 0 1.2.5 1.5 1.5"/><path d="M12 4v8"/><path d="M12 13v9"/><path d="M3 13a9 9 0 0 0 18 0"/><path d="M7 21h10"/></svg>
  ),
  ArrowRight: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
  ),
};

const TopDoctors = ({ speciality = '' }) => {
  const navigate = useNavigate();
  const { doctors, hospitals } = useContext(AppContext);

  const filteredDoctors = speciality 
    ? doctors.filter(doc => doc.speciality === speciality) 
    : doctors;

  return (
    <div className="flex flex-col items-center gap-6 my-20 text-gray-900 dark:text-gray-100 px-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Find Your <span className="text-[#5f6FFF]">Specialist</span>
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Connect with the most highly-rated medical professionals in your region, vetted for excellence and care.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-10">
        {filteredDoctors.slice(0, 8).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="premium-card group cursor-pointer overflow-hidden flex flex-col h-full"
            key={index}
          >
            <div className="relative overflow-hidden aspect-[4/3]">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={item.image}
                alt={item.name}
              />
              <div className="absolute top-4 left-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
                  item.available 
                    ? "bg-green-500/20 text-green-600 border-green-500/30" 
                    : "bg-gray-500/20 text-gray-600 border-gray-500/30"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.available ? "bg-green-600 animate-pulse" : "bg-gray-600"}`}></span>
                  {item.available ? "Ready" : "Away"}
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-[#5f6FFF] transition-colors line-clamp-1">{item.name}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.speciality}</p>
                </div>
                <div className="bg-blue-50 dark:bg-zinc-800 p-2 rounded-xl text-[#5f6FFF]">
                  <Icons.Stethoscope size={20} />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded transition-colors w-fit ${
                    item.hospitalId 
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                      : "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
                  }`}>
                    {item.hospitalId ? "INSTITUTIONAL" : "PRIVATE"}
                  </span>
                  {item.hospitalId && (
                    <p className="text-[10px] text-gray-400 font-medium truncate max-w-[100px]">
                      {hospitals.find(h => h._id === item.hospitalId)?.name}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-[#5f6FFF] transition-colors">
                  Book <Icons.ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/doctors");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="group flex items-center gap-2 mt-12 px-10 py-4 rounded-2xl border-2 border-[#5f6FFF] text-[#5f6FFF] font-bold hover:bg-[#5f6FFF] hover:text-white transition-all shadow-lg shadow-blue-500/10 active:scale-95"
      >
        View All Doctors
        <Icons.ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}

import PropTypes from 'prop-types';

export default TopDoctors;

TopDoctors.propTypes = {
  speciality: PropTypes.string,
};
