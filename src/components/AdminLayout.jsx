'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, LogOut, Package, Grid, Users, Settings, Tag, Sliders } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Grid },
  { href: '/admin/subcategories', label: 'Sub-Categories', icon: Grid },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/hero-slides', label: 'Hero Slides', icon: Sliders },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 p-4 border-b border-slate-800">
            <img 
              src="/assets/avrora_logo.jpeg" 
              alt="Avrora Dazzle Logo" 
              className="h-9 w-9 rounded-full object-cover ring-1 ring-indigo-500/40 shadow-xs shrink-0" 
            />
            <div className="text-xl font-bold tracking-wider text-white">
              ADMIN<span className="text-indigo-400">PANEL</span>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 text-red-400 hover:bg-slate-800 rounded-lg w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;