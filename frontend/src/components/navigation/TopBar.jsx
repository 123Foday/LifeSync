import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
// Inline SVG Icons
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
  const { token, setToken, userData, setUserData } = useContext(AppContext);
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    <nav className="sticky top-0 z-50 w-full glass-morphism border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <img 
          onClick={() => navigate('/')} 
          src={assets.logo} 
          alt="Logo" 
          className="w-28 cursor-pointer dark:brightness-200"
        />
        
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
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
        <div className="relative hidden lg:block">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-900 border-none rounded-full text-sm w-48 focus:w-64 transition-all outline-none ring-1 ring-transparent focus:ring-[#5f6FFF]"
          />
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
              <img src={userData?.image} alt="User" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
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
  );
};


export default TopBar;
