import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const HospitalDetail = () => {
  const { hospitalId } = useParams();
  const { hospitals, doctors } = useContext(AppContext);
  const [hospital, setHospital] = useState(null);
  const [hospitalDoctors, setHospitalDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (hospitals.length > 0 && hospitalId) {
      const hospitalData = hospitals.find(h => h._id === hospitalId);
      setHospital(hospitalData);
      
      // Filter doctors belonging to this hospital
      const filteredDocs = doctors.filter(doc => doc.hospitalId === hospitalId);
      setHospitalDoctors(filteredDocs);
    }
  }, [hospitals, doctors, hospitalId]);

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-all duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5f6FFF]"></div>
          <p className="text-gray-500 animate-pulse">Loading Hospital Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-all duration-300 pb-20">
      {/*------------- Hero Section ------------------*/}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                    hospital.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {hospital.available ? '● Currently Available' : '● Temporarily Unavailable'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-500/80 text-white backdrop-blur-md">
                    Accredited Facility
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 drop-shadow-lg">
                  {hospital.name}
                </h1>
                <p className="text-blue-200 text-lg flex items-center gap-2">
                  <img src={assets.verified_icon} className="w-5 brightness-200" alt="" />
                  {hospital.speciality} &middot; {hospital.experience} Service
                </p>
              </div>
              <button 
                onClick={() => navigate(`/appointment/${hospitalId}`)}
                className="bg-[#5f6FFF] hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-2xl shadow-blue-500/20 transform hover:-translate-y-1 active:scale-95 transition-all text-lg flex items-center gap-3 w-fit"
              >
                Book General Appointment
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/*------------- Left Column: About & Info ------------------*/}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <img src={assets.info_icon} className="w-5 dark:brightness-200" alt="" />
                </div>
                About the Institution
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {hospital.about}
              </div>
              
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Facility Location</h3>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {hospital.address?.line1}<br />
                    {hospital.address?.line2}
                  </p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Accreditation</h3>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">{hospital.degree}</p>
                </div>
              </div>
            </div>

            {/*------------- Hospital Doctors Section ------------------*/}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Our Experts</h2>
                <span className="text-sm text-gray-500 font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {hospitalDoctors.length} Specialists
                </span>
              </div>
              
              {hospitalDoctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hospitalDoctors.map((doc, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { navigate(`/appointment/${doc._id}`); window.scrollTo(0,0); }}
                      className="group bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#5f6FFF] hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                    >
                      <div className="relative">
                        <img 
                          className="w-20 h-20 rounded-xl object-cover bg-blue-50 dark:bg-zinc-950 group-hover:scale-105 transition-transform duration-300" 
                          src={doc.image} 
                          alt={doc.name} 
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#121212] ${doc.available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-[#5f6FFF] transition-colors">{doc.name}</h4>
                        <p className="text-xs text-[#5f6FFF] font-medium mb-1">{doc.speciality}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{doc.experience} EXP</span>
                          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">&middot; {doc.degree}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg group-hover:bg-[#5f6FFF] group-hover:text-white transition-all">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#121212] border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Doctors Not Listed</h3>
                  <p className="text-gray-500 max-w-xs mx-auto text-sm">You can book a general appointment and the administration will assign an available specialist to you.</p>
                </div>
              )}
            </div>
          </div>

          {/*------------- Right Column: Sticky Sidebar Info ------------------*/}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Institutional Care</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Booking with the institution ensures you receive care from the most available specialist in the department.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 text-green-500">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    24/7 Patient Monitoring
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 text-green-500">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    Emergency Priority Access
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 text-green-500">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    Verified Hospital Staff
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/appointment/${hospitalId}`)}
                  className="w-full mt-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-bold hover:bg-black dark:hover:bg-gray-100 transition-all shadow-xl active:scale-95"
                >
                  Confirm Quick Booking
                </button>
                <button 
                  onClick={() => navigate(`/emergency?hospitalId=${hospitalId}`)}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  Emergency Call Center
                </button>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="p-4 bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-2xl">
                    <div className="text-xl mb-1">🛏️</div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Wards</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Modern</p>
                 </div>
                 <div className="p-4 bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-2xl">
                    <div className="text-xl mb-1">🚑</div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Response</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">24/7</p>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;