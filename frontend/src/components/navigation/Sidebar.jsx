import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
// Inline SVG Icons
const Icons = {
  Home: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  ),
  Hospital: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="9" width="18" height="12" rx="2" ry="2" /><path d="M12 9V3" /><path d="M12 13v4" /><path d="M10 15h4" /><path d="M9 3h6" /></svg>
  ),
  Users: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  Info: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
  ),
  User: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  Calendar: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  ),
  LogOut: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  ),
  Sun: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="18.36" x2="5.64" y2="16.92" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
  ),
  Moon: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
  ),
};


const Sidebar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData } = useContext(AppContext);
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    setToken(false);
    setUserData(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: Icons.Home },
    { label: 'Hospitals', path: '/hospitals', icon: Icons.Hospital },
    { label: 'All Doctors', path: '/doctors', icon: Icons.Users },
    { label: 'About Us', path: '/about', icon: Icons.Info },
  ];

  const userItems = [
    { label: 'Profile', path: '/my-profile', icon: Icons.User },
    { label: 'Appointments', path: '/my-appointments', icon: Icons.Calendar },
  ];


  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transition-all duration-300">
      <div className="p-6">
        <img 
          onClick={() => navigate('/')} 
          src={assets.logo} 
          alt="LifeSync Logo" 
          className="w-32 cursor-pointer dark:brightness-200 transition-all hover:scale-105"
        />
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 mb-2">
          Menu
        </div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#5f6FFF] text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 group'
              }`
            }
          >
            <item.icon size={20} className="transition-transform group-hover:scale-110" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        {token && (
          <div className="mt-8">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 mb-2">
              Account
            </div>
            {userItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#5f6FFF] text-white shadow-lg shadow-blue-500/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 group'
                  }`
                }
              >
                <item.icon size={20} className="transition-transform group-hover:scale-110" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all group"
        >
          {theme === 'dark' ? (
            <>
              <Icons.Sun size={20} className="text-yellow-400" />
              <span className="font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Icons.Moon size={20} className="text-gray-600" />
              <span className="font-medium">Dark Mode</span>
            </>
          )}
        </button>

        {token ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <img 
              src={userData?.image} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-[#5f6FFF]"
            />
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm truncate dark:text-white">{userData?.name}</p>
              <button 
                onClick={logout}
                className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <Icons.LogOut size={12} /> Logout
              </button>
            </div>
          </div>

        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#5f6FFF] text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:bg-[#4b58e6] transition-all active:scale-95"
          >
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
