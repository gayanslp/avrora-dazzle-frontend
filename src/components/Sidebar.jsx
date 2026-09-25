import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b">
            <span className="text-xl font-bold">URBANWEAR</span>
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-black">
              <X size={24} />
            </button>
          </div>

          <nav className="mt-6 flex flex-col space-y-4 font-medium">
            <NavLink to="/" onClick={onClose} className="text-gray-700 hover:text-indigo-600">Home</NavLink>
            <NavLink to="/productDetails" onClick={onClose} className="text-gray-700 hover:text-indigo-600">Products</NavLink>
            <NavLink to="/cart" onClick={onClose} className="text-gray-700 hover:text-indigo-600">Cart</NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;