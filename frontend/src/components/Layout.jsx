import React from 'react';
import Sidebar from './navigation/Sidebar';
import TopBar from './navigation/TopBar';
import BottomBar from './navigation/BottomBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      {/* Desktop Navigation (xl and up) */}
      <div className="hidden xl:block">
        <Sidebar />
      </div>

      {/* Tablet Navigation (md to lg) */}
      <div className="hidden md:block xl:hidden">
        <TopBar />
      </div>

      {/* Mobile TopBar (below md - showing just logo and theme toggle maybe?) */}
      {/* Actually the user said Mobile gets bottomNavbar with icons. 
          Usually we still need a simplified TopBar or just the content. 
          Let's add a simplified mobile header. */}
      <div className="md:hidden">
        <div className="glass-morphism h-14 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between px-4 sticky top-0 z-40">
           <TopBar /> {/* We can reuse TopBar but hide links in CSS/Tailwind */}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="transition-all duration-300 xl:ml-64 pb-20 md:pb-0">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
        <Footer />
      </main>

      {/* Mobile Bottom Navigation (below md) */}
      <div className="md:hidden">
        <BottomBar />
      </div>
    </div>
  );
};

export default Layout;
