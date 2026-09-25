import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, User, Menu } from 'lucide-react';

const Navbar = ({ onOpenSidebar }) => {
  const token = localStorage.getItem('token');
  const cartCount = 2; // පසුකාලීනව CartContext එකෙන් ගන්න

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Mobile Menu Button & Brand Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onOpenSidebar}
              className="md:hidden p-2 text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>

            <Link to="/" className="text-2xl font-black tracking-wider text-slate-900">
              URBAN<span className="text-indigo-600">WEAR</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"}
            >
              Home
            </NavLink>
            <NavLink 
              to="/productDetails" 
              className={({ isActive }) => isActive ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"}
            >
              Products
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-5">
            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 p-1">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {token ? (
              <Link to="/checkout" className="text-gray-700 hover:text-indigo-600 p-1">
                <User size={22} />
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;