import React, { useContext, useState, useMemo, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';

const Icons = {
  Home: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  ),
  Search: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  ),
  Menu: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
  ),
  X: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  ),
  Sun: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="18.36" x2="5.64" y2="16.92" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
  ),
  Moon: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
  ),
  ChevronDown: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9" /></svg>
  ),
  LogOut: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  ),
  User: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  Calendar: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  ),
};

const TopBar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData, hospitals = [], doctors = [] } = useContext(AppContext);
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // Search Logic
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const allData = useMemo(() => {
    const h = hospitals.map(item => ({ ...item, type: 'Hospital' }))
    const d = doctors.map(item => ({ ...item, type: 'Doctor' }))
    return [...h, ...d]
  }, [hospitals, doctors])

  const fuse = useMemo(() => new Fuse(allData, {
    keys: ['name', 'speciality', 'address.line1', 'address.line2'],
    threshold: 0.3,
    distance: 100
  }), [allData])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (debouncedTerm.trim()) {
      const results = fuse.search(debouncedTerm).map(res => res.item).slice(0, 5)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [debouncedTerm, fuse])

  const handleSearchSelect = (item, type) => {
    setSearchTerm('')
    setShowResults(false)
    setShowMobileSearch(false)
    if ((type === 'hospital' || type === 'doctor') && item._id) {
      navigate(`/appointment/${item._id}`)
    }
    window.scrollTo(0, 0)
  }

  const logout = () => {
    setToken(false);
    setUserData(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Hospitals', path: '/hospitals' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'About', path: '/about' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full glass-morphism border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-8">
          <img 
            onClick={() => { navigate('/'); window.scrollTo(0, 0); }} 
            src={assets.logo} 
            alt="Logo" 
            className="w-28 cursor-pointer active:scale-95 transition-transform"
          />
          
          <ul className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => window.scrollTo(0, 0)}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-[#5f6FFF]' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-[#5f6FFF]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
           {/* Mobile Search Icon (Visible below lg) */}
          <button 
            onClick={() => setShowMobileSearch(true)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-300"
          >
            <Icons.Search size={22} />
          </button>

          {/* Desktop Search Input (Visible lg and up) */}
          <div className="relative hidden lg:block">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(searchTerm.trim().length > 0)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-900 border-none rounded-full text-sm w-48 focus:w-64 transition-all outline-none ring-1 ring-transparent focus:ring-[#5f6FFF] text-gray-700 dark:text-gray-200"
            />
             {/* Desktop Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 w-full max-w-xs bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSearchSelect(item, item.type?.toLowerCase())}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                  >
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.speciality}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'dark' ? <Icons.Sun size={20} className="text-yellow-400" /> : <Icons.Moon size={20} className="text-gray-600" />}
          </button>

          {token ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <img src={userData?.image} alt="User" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
                <Icons.ChevronDown size={14} className={`text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>


              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-20 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold truncate dark:text-white">{userData?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                    </div>
                    <div className="p-2">
                       <button 
                        onClick={() => { navigate('/my-profile'); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Icons.User size={16} /> My Profile
                      </button>
                      <button 
                        onClick={() => { navigate('/my-appointments'); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Icons.Calendar size={16} /> Appointments
                      </button>
                      <hr className="my-1 border-gray-100 dark:border-gray-800" />
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Icons.LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#5f6FFF] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#4b58e6] transition-all"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 p-4 animate-fade-in flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                autoFocus 
                type="text" 
                placeholder="Search doctors, hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-900 border-none rounded-xl text-base outline-none ring-2 ring-transparent focus:ring-[#5f6FFF] text-gray-900 dark:text-white"
              />
            </div>
            <button 
              onClick={() => { setShowMobileSearch(false); setSearchTerm(''); }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {searchTerm && searchResults.length > 0 ? (
               <div className="flex flex-col gap-2">
                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Results</p>
                 {searchResults.map((item, idx) => (
                   <div
                     key={idx}
                     onClick={() => handleSearchSelect(item, item.type?.toLowerCase())}
                     className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 active:bg-gray-100 dark:active:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-zinc-800"
                   >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        item.type === 'Doctor' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'
                      }`}>
                         {item.image ? (
                           <img src={item.image} className="w-10 h-10 rounded-full object-cover" alt=""/>
                         ) : (
                           <span className="font-bold text-sm">{item.type?.[0]}</span>
                         )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.speciality || item.address?.line1}</p>
                      </div>
                   </div>
                 ))}
               </div>
            ) : searchTerm ? (
               <div className="text-center text-gray-500 mt-10">No results found</div>
            ) : (
               <div className="text-center text-gray-400 mt-10">
                 <p>Type to search...</p>
               </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
