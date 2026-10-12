import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CartDrawer from './CartDrawer';
import AuroraBackground from './AuroraBackground';
import AvroraCursorGlow from './AvroraCursorGlow';
import Footer from './Footer';
import LogoLoader from './LogoLoader';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
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
        <Suspense fallback={<LogoLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;