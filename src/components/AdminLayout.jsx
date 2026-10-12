import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut, Package, Grid, Users, Settings, Tag, Sliders } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/admin/orders" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <ShoppingBag size={20} />
              <span>Orders</span>
            </NavLink>

            <NavLink 
              to="/admin/coupons" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Tag size={20} />
              <span>Coupons</span>
            </NavLink>

            <NavLink 
              to="/admin/products" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Package size={20} />
              <span>Products</span>
            </NavLink>

            <NavLink 
              to="/admin/categories" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Grid size={20} />
              <span>Categories</span>
            </NavLink>

            <NavLink 
              to="/admin/subcategories" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Grid size={20} />
              <span>Sub-Categories</span>
            </NavLink>

            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Users size={20} />
              <span>Users</span>
            </NavLink>

            <NavLink 
              to="/admin/hero-slides" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Sliders size={20} />
              <span>Hero Slides</span>
            </NavLink>

            <NavLink 
              to="/admin/settings" 
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
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
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;