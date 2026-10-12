'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CartDrawer from './CartDrawer';
import AuroraBackground from './AuroraBackground';
import AvroraCursorGlow from './AvroraCursorGlow';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAvroraTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-cyan-500 selection:text-white">
      {isAvroraTheme && (
        <>
          <AuroraBackground />
          <AvroraCursorGlow />
        </>
      )}
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <CartDrawer />
      
      <main className="flex-1 w-full flex flex-col relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;