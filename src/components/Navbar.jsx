import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ onOpenSidebar }) => {
  const token = localStorage.getItem('token');
  const { totalItems, openCartDrawer } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Menu / Categories Button & Brand Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onOpenSidebar}
              className="flex items-center space-x-2 p-2 text-stone-700 hover:text-black rounded-lg hover:bg-stone-100 transition-colors cursor-pointer group"
              title="Browse Categories"
              aria-label="Open Categories Sidebar"
            >
              <Menu size={22} className="group-hover:scale-105 transition-transform" />
              {/* <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-stone-800">
                Categories
              </span> */}
            </button>

            <Link to="/" className="text-2xl font-black tracking-wider text-slate-900">
              AVRORA <span className="text-stone-900 font-light">DAZZLE</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "text-stone-900 font-bold border-b-2 border-stone-900 pb-1" : "text-gray-700 hover:text-stone-900"}
            >
              HOME
            </NavLink>
            <NavLink 
              to="/categories" 
              // onClick={onOpenSidebar}
              className="text-gray-700 hover:text-stone-900 flex items-center gap-1.5 uppercase tracking-wider text-sm font-medium transition-colors cursor-pointer"
            >
              CATEGORIES
              {/* <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-full font-bold">Menu</span> */}
            </NavLink>
            <NavLink 
              to="/productDetails" 
              className={({ isActive }) => isActive ? "text-stone-900 font-bold border-b-2 border-stone-900 pb-1" : "text-gray-700 hover:text-stone-900"}
            >
              PRODUCTS
            </NavLink>
            <NavLink 
              to="/cart" 
              className={({ isActive }) => isActive ? "text-stone-900 font-bold border-b-2 border-stone-900 pb-1" : "text-gray-700 hover:text-stone-900"}
            >
              CART
            </NavLink>
            <NavLink 
              to="/track-order" 
              className={({ isActive }) => isActive ? "text-stone-900 font-bold border-b-2 border-stone-900 pb-1" : "text-gray-700 hover:text-stone-900"}
            >
              TRACK ORDER
            </NavLink>
            <NavLink 
              to="/accessories" 
              className={({ isActive }) => isActive ? "text-stone-900 font-bold border-b-2 border-stone-900 pb-1" : "text-gray-700 hover:text-stone-900"}
            >
              ACCESSORIES
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-5">
            <button 
              onClick={openCartDrawer} 
              className="relative text-gray-700 hover:text-black p-1 cursor-pointer transition-transform hover:scale-105"
              aria-label="Open Cart Drawer"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-stone-950 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pop-badge">
                  {totalItems}
                </span>
              )}
            </button>

            {token ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/checkout" 
                  className="text-gray-700 hover:text-black p-1 transition-transform hover:scale-105"
                  title="My Account / Checkout"
                >
                  <User size={22} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 p-1 transition-transform hover:scale-105 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-stone-800 transition"
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