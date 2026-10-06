import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../context/CategoryContext';
import { SlArrowDown } from "react-icons/sl";

const Navbar = ({ onOpenSidebar }) => {
  const token = localStorage.getItem('token');
  const { totalItems, openCartDrawer } = useCart();
  const { isAvroraTheme, toggleAvroraTheme } = useTheme();
  const { categories, allSubCategories } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'categories' | 'accessories' | null
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

  // Text color & active state resolving smoothly for Transparent Home, Avrora Mode & Normal Light Mode
  const textColor = isTransparent
    ? 'text-white drop-shadow-sm'
    : (isAvroraTheme ? 'text-slate-100' : 'text-slate-700');

  const activeColor = isTransparent
    ? 'text-cyan-300 font-bold border-b-2 border-cyan-400 pb-1'
    : (isAvroraTheme
        ? 'text-cyan-300 font-bold border-b-2 border-cyan-400 pb-1'
        : 'text-slate-900 font-bold border-b-2 border-slate-900 pb-1');

  const hoverColor = isTransparent
    ? 'hover:text-cyan-300 transition-colors'
    : (isAvroraTheme ? 'hover:text-cyan-300 transition-colors' : 'hover:text-cyan-600 transition-colors');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('avora_cart');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const toggleDropdown = (menuName) => {
    setActiveDropdown(prev => (prev === menuName ? null : menuName));
  };

  const handleItemClick = (path) => {
    setActiveDropdown(null);
    navigate(path);
  };

  // Dropdown Items Config
  const categoriesList = [
    {
      name: 'Gents Wear',
      path: '/products/gents-wear',
      image: '/assets/categories/mens/mens-shirts/image-1.jpg'
    },
    {
      name: 'Ladies Wear',
      path: '/products/ladies-wear',
      image: '/assets/categories/women/dresses/image-1.jpg'
    },
    {
      name: 'Kids Wear',
      path: '/products/kids-wear',
      image: '/assets/categories/kids/kids-dresses/image-1.jpg'
    }
  ];

  const accessoriesList = [
    {
      name: 'Jewellery',
      path: '/products/jewellery',
      image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg'
    },
    {
      name: 'Caps',
      path: '/products/caps',
      image: '/assets/categories/accessories/caps/image-1.jpg'
    },
    {
      name: 'Belts',
      path: '/products/belts',
      image: '/assets/categories/accessories/belts/image-1.jpg'
    },
    {
      name: 'Footwear',
      path: '/products/footwear',
      image: '/assets/categories/accessories/bags/image-2.jpg'
    },
    {
      name: 'Bags',
      path: '/products/bags',
      image: '/assets/categories/accessories/bags/image-1.jpg'
    }
  ];

  return (
    <header 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`z-40 transition-all duration-300 ${
        isHome ? 'fixed top-0 w-full' : 'sticky top-0'
      } ${
        isTransparent 
          ? 'bg-transparent text-white' 
          : (isAvroraTheme
              ? 'bg-slate-950/90 backdrop-blur-xl text-slate-100 shadow-[0_4px_30px_rgba(6,182,212,0.18)] border-b border-cyan-500/30'
              : 'bg-white/95 backdrop-blur-md text-slate-900 shadow-xs border-b border-slate-200')
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

            <Link 
              to="/" 
              className={`text-2xl font-black tracking-wider ${
                isTransparent || isAvroraTheme ? 'text-white' : 'text-slate-900'
              }`}
            >
              AVRORA{' '}
              <span className={
                isTransparent || isAvroraTheme 
                  ? 'text-cyan-300 font-light' 
                  : 'text-cyan-600 font-light'
              }>
                DAZZLE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 font-medium text-[13px] tracking-wider uppercase">
            
            {/* 1. NEW ARRIVALS */}
            <NavLink 
              to="/products" 
              className={() => location.pathname === '/products' ? activeColor : `${textColor} ${hoverColor}`}
            >
              NEW ARRIVALS
            </NavLink>

            {/* 2. CATEGORIES (Dropdown) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('categories')}
                className={`flex items-center gap-1.5 py-2 uppercase transition-colors cursor-pointer ${
                  activeDropdown === 'categories' ? activeColor : `${textColor} ${hoverColor}`
                }`}
              >
                <span>CATEGORIES</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    activeDropdown === 'categories' ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>

              {/* Categories Dropdown Panel */}
              {activeDropdown === 'categories' && (
                <div className={`absolute top-full left-0 mt-3 w-56 rounded-2xl shadow-xl py-2 z-50 animate-fade-in border ${
                  isAvroraTheme
                    ? 'bg-slate-950/95 backdrop-blur-xl border-cyan-500/30 text-white shadow-[0_10px_30px_rgba(6,182,212,0.25)]'
                    : 'bg-white/95 backdrop-blur-md border-slate-100 text-slate-700 shadow-xl'
                }`}>
                  {categoriesList.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemClick(item.path)}
                      className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all text-left cursor-pointer group ${
                        isAvroraTheme
                          ? 'text-slate-200 hover:text-cyan-300 hover:bg-cyan-500/10'
                          : 'text-slate-700 hover:text-cyan-600 hover:bg-slate-50'
                      }`}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-8 h-8 rounded-lg object-cover border border-slate-100/20 group-hover:scale-105 transition-transform" 
                      />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. ACCESSORIES (Dropdown) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('accessories')}
                className={`flex items-center gap-1.5 py-2 uppercase transition-colors cursor-pointer ${
                  activeDropdown === 'accessories' ? activeColor : `${textColor} ${hoverColor}`
                }`}
              >
                <span>ACCESSORIES</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    activeDropdown === 'accessories' ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>

              {/* Accessories Dropdown Panel */}
              {activeDropdown === 'accessories' && (
                <div className={`absolute top-full left-0 mt-3 w-56 rounded-2xl shadow-xl py-2 z-50 animate-fade-in border ${
                  isAvroraTheme
                    ? 'bg-slate-950/95 backdrop-blur-xl border-cyan-500/30 text-white shadow-[0_10px_30px_rgba(6,182,212,0.25)]'
                    : 'bg-white/95 backdrop-blur-md border-slate-100 text-slate-700 shadow-xl'
                }`}>
                  {accessoriesList.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemClick(item.path)}
                      className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all text-left cursor-pointer group ${
                        isAvroraTheme
                          ? 'text-slate-200 hover:text-cyan-300 hover:bg-cyan-500/10'
                          : 'text-slate-700 hover:text-cyan-600 hover:bg-slate-50'
                      }`}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-8 h-8 rounded-lg object-cover border border-slate-100/20 group-hover:scale-105 transition-transform" 
                      />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. BRIDAL WEAR */}
            <NavLink 
              to="/products/bridal-wear" 
              className={({ isActive }) => location.pathname.includes('bridal-wear') ? activeColor : `${textColor} ${hoverColor}`}
            >
              BRIDAL WEAR
            </NavLink>

            {/* 5. GYM & ACTIVEWEAR */}
            <NavLink 
              to="/products/gym-activewear" 
              className={({ isActive }) => location.pathname.includes('gym-activewear') ? activeColor : `${textColor} ${hoverColor}`}
            >
              GYM & ACTIVE WEAR
            </NavLink>

            {/* 6. TRACK ORDER */}
            <NavLink 
              to="/track-order" 
              className={({ isActive }) => isActive ? activeColor : `${textColor} ${hoverColor}`}
            >
              TRACK ORDER
            </NavLink>

          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3.5">
            
            {/* DAY / NIGHT THEME TOGGLE BUTTON (ICON ONLY) */}
            <button
              onClick={toggleAvroraTheme}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isAvroraTheme
                  ? 'bg-slate-900/90 border border-cyan-400/40 text-cyan-300 hover:text-cyan-200 hover:bg-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-100/90 border border-slate-200/90 text-amber-500 hover:bg-slate-200 hover:text-amber-600 shadow-xs'
              }`}
              title={isAvroraTheme ? 'Switch to Day Mode' : 'Switch to Avrora Night Mode'}
              aria-label="Toggle Day Night Mode"
            >
              {isAvroraTheme ? (
                <Moon size={19} className="text-cyan-300 animate-pulse" />
              ) : (
                <Sun size={19} className="text-amber-500 hover:rotate-45 transition-transform duration-300" />
              )}
            </button>

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
                <button 
                  onClick={handleLogout}
                  className={`${isAvroraTheme ? 'text-rose-400 hover:text-rose-300' : (isTransparent ? 'text-red-300 hover:text-red-400' : 'text-red-500 hover:text-red-600')} p-1 transition-transform hover:scale-105 cursor-pointer`}
                  title="Sign Out"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className={`${isAvroraTheme ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]' : (isTransparent ? 'bg-white text-slate-900 hover:bg-slate-100 hover:text-cyan-600' : 'bg-slate-900 text-white hover:bg-slate-800')} px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg`}
              >
                Login
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Backdrop — closes dropdown when clicking outside */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </header>
  );
};

export default Navbar;