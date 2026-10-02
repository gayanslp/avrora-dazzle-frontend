import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCategories } from '../context/CategoryContext';
import { SlArrowDown } from "react-icons/sl";

const Navbar = ({ onOpenSidebar }) => {
  const token = localStorage.getItem('token');
  const { totalItems, openCartDrawer } = useCart();
  const { categories, allSubCategories } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [openCategoryId, setOpenCategoryId] = useState(null);

  // Toggle dropdown and filter subs from the pre-fetched list
  const handleCategoryClick = (category) => {
    if (openCategoryId === category._id) {
      setOpenCategoryId(null);
      return;
    }
    setOpenCategoryId(category._id);
    if (!subCategoriesMap[category._id]) {
      // mainCategory is populated → compare _id strings
      const filtered = allSubCategories.filter(
        (sub) => sub.mainCategory?._id === category._id
      );
      setSubCategoriesMap((prev) => ({ ...prev, [category._id]: filtered }));
    }
  };

  const handleFiltering = (_id) => {
    navigate(`/products/${_id}`)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled && !isHovered;

  const textColor = isTransparent ? 'text-white' : 'text-slate-700';
  const activeColor = isTransparent ? 'text-white border-white' : 'text-slate-900 border-slate-900';
  const hoverColor = isTransparent ? 'hover:text-cyan-200' : 'hover:text-cyan-600 transition-colors';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('avora_cart');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <header 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${isHome ? 'fixed top-0 w-full' : 'sticky top-0 bg-white border-b border-slate-200 shadow-xs'} z-40 transition-all duration-300 ${
        isTransparent 
          ? 'bg-transparent text-white' 
          : 'bg-white/95 backdrop-blur-sm text-slate-900 shadow-xs border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Menu / Categories Button & Brand Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onOpenSidebar}
              className={`flex items-center space-x-2 p-2 ${textColor} ${hoverColor} rounded-lg hover:bg-black/5 transition-colors cursor-pointer group`}
              title="Browse Categories"
              aria-label="Open Categories Sidebar"
            >
              <Menu size={22} className="group-hover:scale-105 transition-transform" />
            </button>

            <Link to="/" className={`text-2xl font-black tracking-wider ${isTransparent ? 'text-white' : 'text-slate-900'}`}>
              AVRORA <span className={`${isTransparent ? 'text-cyan-200' : 'text-cyan-600'} font-light`}>DAZZLE</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            
            {
              categories.map((category) => {
                const subs = subCategoriesMap[category._id] || [];
                const isOpen = openCategoryId === category._id;
                return (
                  <div key={category._id} className="relative">
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className={`flex items-center gap-1 text-sm font-medium tracking-wide uppercase transition-colors ${
                        isOpen ? activeColor : `${textColor} ${hoverColor}`
                      }`}
                    >
                      {category.name}
                      <SlArrowDown
                        className={`w-2.5 h-2.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown panel */}
                    {isOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 min-w-[180px] bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                        {subs.length === 0 ? (
                          <p className="px-5 py-3 text-[13px] text-slate-400 italic">No sub-categories</p>
                        ) : (
                          subs.map((sub) => (
                            
                            <button  onClick={() => {handleFiltering(sub._id)}}
                             className={`block px-5 py-2.5 text-[13px] font-medium transition-colors
                                   'text-slate-700 hover:text-cyan-600 hover:bg-slate-50'
                              `}>
                              {sub.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            }
            <NavLink 
              to="/productDetails" 
              className={({ isActive }) => isActive ? `font-bold border-b-2 pb-1 ${activeColor}` : `${textColor} ${hoverColor}`}
            >
              PRODUCTS
            </NavLink>
            
            <NavLink 
              to="/track-order" 
              className={({ isActive }) => isActive ? `font-bold border-b-2 pb-1 ${activeColor}` : `${textColor} ${hoverColor}`}
            >
              TRACK ORDER
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-5">
            <button 
              onClick={openCartDrawer} 
              className={`relative ${textColor} ${hoverColor} p-1 cursor-pointer transition-transform hover:scale-105`}
              aria-label="Open Cart Drawer"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pop-badge shadow-md shadow-cyan-500/20">
                  {totalItems}
                </span>
              )}
            </button>

            {token ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/checkout" 
                  className={`${textColor} ${hoverColor} p-1 transition-transform hover:scale-105`}
                  title="My Account / Checkout"
                >
                  <User size={22} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className={`${isTransparent ? 'text-red-300 hover:text-red-400' : 'text-red-500 hover:text-red-600'} p-1 transition-transform hover:scale-105 cursor-pointer`}
                  title="Sign Out"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className={`${isTransparent ? 'bg-white text-slate-900 hover:bg-slate-100 hover:text-cyan-600' : 'bg-slate-900 text-white hover:bg-slate-800'} px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg`}
              >
                Login
              </Link>
            )}
          </div>

        </div>
      </div>
      {/* Backdrop — closes dropdown when clicking outside */}
      {openCategoryId && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenCategoryId(null)}
        />
      )}
    </header>
  );
};

export default Navbar;