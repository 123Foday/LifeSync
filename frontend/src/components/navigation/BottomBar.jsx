import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
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
  User: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  LogIn: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
  ),
};


const BottomBar = () => {
  const { token } = useContext(AppContext);

  const navItems = [
    { label: 'Home', path: '/', icon: Icons.Home },
    { label: 'Hospitals', path: '/hospitals', icon: Icons.Hospital },
    { label: 'Doctors', path: '/doctors', icon: Icons.Users },
    { label: 'Profile', path: token ? '/my-profile' : '/login', icon: token ? Icons.User : Icons.LogIn },
  ];


  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-morphism border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 relative ${
                isActive 
                  ? 'text-[#5f6FFF]' 
                  : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#5f6FFF] rounded-b-full shadow-[0_2px_8px_0_rgba(95,111,255,0.4)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomBar;
