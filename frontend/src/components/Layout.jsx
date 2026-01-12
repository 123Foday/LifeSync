import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './navigation/Sidebar';
import TopBar from './navigation/TopBar';
import BottomBar from './navigation/BottomBar';
import Footer from './Footer';
import PageSearchBar from './PageSearchBar';

const Layout = ({ children }) => {
  const location = useLocation();

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

      {/* Mobile TopBar */}
      <div className="md:hidden sticky top-0 z-40">
        <TopBar />
      </div>

      {/* Main Content Area */}
      <main className="transition-all duration-300 xl:ml-64 pb-20 md:pb-0">
        {/* Desktop Page Search Bar - Sticky at top */}
        <PageSearchBar />

        <div 
          key={location.pathname}
          className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
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
