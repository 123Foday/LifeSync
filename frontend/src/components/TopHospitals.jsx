import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Icons = {
  Hospital: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="9" width="18" height="12" rx="2" ry="2" /><path d="M12 9V3" /><path d="M12 13v4" /><path d="M10 15h4" /><path d="M9 3h6" /></svg>
  ),
  ArrowRight: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
  ),
};

const TopHospitals = ({ selectedCategory = '' }) => {
  const navigate = useNavigate();
  const { hospitals } = useContext(AppContext);

  const filtered = selectedCategory
    ? hospitals.filter((h) => h.speciality === selectedCategory)
    : hospitals;

  return (
    <div className="flex flex-col items-center gap-6 my-20 text-gray-900 dark:text-gray-100 px-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          World-Class <span className="text-[#5f6FFF]">Hospitals</span>
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Partnering with leading medical institutions to ensure you receive the highest quality diagnostics and treatment.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-10">
        {filtered.slice(0, 8).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/hospital/${item._id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="premium-card group cursor-pointer overflow-hidden flex flex-col h-full"
          >
            <div className="relative overflow-hidden aspect-[16/9]">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={item.image}
                alt={item.name}
              />
              <div className="absolute top-4 right-4">
                 <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-lg">
                    <Icons.Hospital size={18} className="text-[#5f6FFF]" />
                 </div>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.available ? "Open Now" : "Emergency Only"}</span>
              </div>
              
              <h3 className="text-xl font-bold group-hover:text-[#5f6FFF] transition-colors line-clamp-1">{item.name}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{item.speciality} • {item.address?.line1 || 'Medical Center'}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white text-sm font-bold transition-all group-hover:bg-[#5f6FFF] group-hover:text-white">
                  Explore Institution
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/hospitals");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="group flex items-center gap-2 mt-8 px-10 py-4 rounded-2xl bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all active:scale-95"
      >
        Explore All Hospitals
        <Icons.ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

TopHospitals.propTypes = {
  selectedCategory: PropTypes.string,
}

export default TopHospitals;
