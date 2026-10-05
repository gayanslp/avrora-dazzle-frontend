import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CartDrawer from '../components/CartDrawer';
import ScrollToTop from '../components/ScrollToTop';
import AvroraCursorGlow from '../components/AvroraCursorGlow';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAvroraTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {isAvroraTheme && (
        <>
          <div className="avrora-wall-art-overlay" />
          <AvroraCursorGlow />
        </>
      )}
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <CartDrawer />
      <ScrollToTop />
      
      <main className="flex-1 w-full flex flex-col relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;