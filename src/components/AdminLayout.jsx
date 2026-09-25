import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut } from 'lucide-react';

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
          <div className="text-xl font-bold p-4 border-b border-slate-800 tracking-wider">
            ADMIN<span className="text-indigo-500">PANEL</span>
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