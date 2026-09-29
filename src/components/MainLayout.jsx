import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CartDrawer from '../components/CartDrawer';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <CartDrawer />
      
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-white text-center py-6 text-sm">
        &copy; {new Date().getFullYear()} AVRORA DAZZLE. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;