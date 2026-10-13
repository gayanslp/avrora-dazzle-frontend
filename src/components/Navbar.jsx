'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Menu, LogOut, ChevronDown, Sun, Moon, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../context/CategoryContext';
import { SlArrowDown } from "react-icons/sl";

const Navbar = ({ onOpenSidebar }) => {
  const [token, setToken] = useState(null);
  const { totalItems, openCartDrawer } = useCart();
  const { isAvroraTheme, toggleAvroraTheme } = useTheme();
  const { categories, allSubCategories } = useCategories();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkToken = () => {
      if (typeof window !== 'undefined') {
        setToken(localStorage.getItem('token'));
      }
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'mens' | 'women' | 'kids' | 'accessories' | 'bridal' | null
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const isHome = pathname === '/';
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('avora_cart');
      window.dispatchEvent(new Event('storage'));
    }
    router.push('/');
  };

  const toggleDropdown = (menuName) => {
    setActiveDropdown(prev => (prev === menuName ? null : menuName));
  };

  const handleItemClick = (path, catId) => {
    setActiveDropdown(null);
    router.push(path);
  };

  // Dropdown Items Config
  const mensList = [
    { name: 'Shirts', path: '/products/mens-shirts', image: '/assets/categories/mens/mens-shirts/image-1.jpg' },
    { name: "T'shirts", path: '/products/mens-t-shirts', image: '/assets/categories/mens/mens-t-shirts/image-1.jpg' },
    { name: 'Jeans', path: '/products/mens-jeans', image: '/assets/categories/mens/mens-jeans/image-1.jpg' },
    { name: 'Trousers', path: '/products/mens-trousers', image: '/assets/categories/mens/mens-trousers/image-1.jpg' },
    { name: 'Gym wears', path: '/products/gym-activewear', image: '/assets/categories/gym-activewear/workout-tops/image-1.jpg' },
    { name: 'Suits & Blazers', path: '/products/suits-blazers', image: '/assets/categories/mens/suits-blazers/image-1.jpg' },
    { name: 'Bags', path: '/products/bags', image: '/assets/categories/accessories/bags/image-1.jpg' },
    { name: 'Belts caps', path: '/products/belts-caps', image: '/assets/categories/accessories/caps/image-1.jpg' },
    { name: 'Sunglasses', path: '/products/sunglasses', image: '/assets/categories/accessories/sunglasses/image-1.jpg' },
  ];

  const womenList = [
    { name: 'Ladieswear', path: '/products/women', image: '/assets/categories/women/dresses/image-1.jpg' },
    { name: 'Dresses', path: '/products/dresses', image: '/assets/categories/women/dresses/image-1.jpg' },
    { name: 'Blouses & Tops', path: '/products/blouses-tops', image: '/assets/categories/women/tops-blouses/image-1.jpg' },
    { name: 'Pants & Jeans', path: '/products/pants-jeans', image: '/assets/categories/women/womens-jeans/image-1.jpg' },
    { name: 'Skirts', path: '/products/skirts', image: '/assets/categories/women/skirts/image-1.jpg' },
    { name: 'Gym & Active wears', path: '/products/women-activewear', image: '/assets/categories/gym-activewear/workout-tops/image-1.jpg' },
    { name: 'Undergarments', path: '/products/undergarments', image: '/assets/categories/gym-activewear/sports-bras/image-1.jpg' },
    { name: 'Jewellery & Watches', path: '/products/jewellery-watches', image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg' },
    { name: 'Beauty products', path: '/products/beauty-products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600' },
    { name: 'Handbags', path: '/products/handbags', image: '/assets/categories/accessories/bags/image-1.jpg' },
    { name: 'Footwear', path: '/products/footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600' },
    { name: 'Other Accessories', path: '/products/other-accessories', image: '/assets/categories/accessories/belts/image-1.jpg' },
  ];

  const kidsList = [
    { name: 'Baby Boy & Girl', path: '/products/baby-boy-girl', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=600' },
    { name: 'Toddler Boys', path: '/products/toddler-boys', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Toddler Girls', path: '/products/toddler-girls', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=600' },
    { name: 'Footwear', path: '/products/kids-footwear', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=600' },
    { name: 'Toys', path: '/products/toys', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600' },
  ];

  const bridalAndAccessoriesList = [
    { name: 'Bridal Gowns', path: '/products/bridal-gowns', image: '/assets/categories/bridal-wear/bridal-gowns/image-1.jpg' },
    { name: 'Bridesmaid Dresses', path: '/products/bridesmaid-dresses', image: '/assets/categories/bridal-wear/bridesmaid-dresses/image-1.jpg' },
    { name: 'Bridal Jewellery & Sets', path: '/products/bridal-accessories', image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg' },
    { name: 'Veils & Hair Accessories', path: '/products/bridal-veils', image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg' },
    { name: 'Clutches & Bridal Bags', path: '/products/bridal-bags', image: '/assets/categories/accessories/bags/image-1.jpg' },
    { name: 'Bridal Heels & Footwear', path: '/products/bridal-footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600' },
  ];

  const giftAndFancyList = [
    { name: 'Fancy Watches & Jewellery', path: '/products/jewellery', image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg' },
    { name: 'Designer Sunglasses', path: '/products/sunglasses', image: '/assets/categories/accessories/sunglasses/image-1.jpg' },
    { name: 'Belts & Wallets', path: '/products/belts', image: '/assets/categories/accessories/belts/image-1.jpg' },
    { name: 'Luxury Perfumes & Scents', path: '/products/beauty-products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600' },
    { name: 'Caps & Trendy Headwear', path: '/products/caps', image: '/assets/categories/accessories/caps/image-1.jpg' },
    { name: 'Gift Sets & Hampers', path: '/products/gift-sets', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=600' },
  ];

  const navCategories = [
    { id: 'mens', label: 'Mens', path: '/products/mens', items: mensList },
    { id: 'women', label: 'Women', path: '/products/women', items: womenList },
    { id: 'kids', label: 'Kids', path: '/products/kids', items: kidsList },
    { 
      id: 'bridal-accessories', 
      label: 'Bridalwears & Accessories', 
      display: (
        <span className="flex flex-col text-left leading-[1.15]">
          <span>Bridalwears &</span>
          <span>Accessories</span>
        </span>
      ),
      path: '/products/bridal-wear', 
      items: bridalAndAccessoriesList 
    },
    { 
      id: 'gift-fancy', 
      label: 'Gift & Fancy Items', 
      display: (
        <span className="flex flex-col text-left leading-[1.15]">
          <span>Gift & Fancy</span>
          <span>Items</span>
        </span>
      ),
      path: '/products/fancy-gift', 
      items: giftAndFancyList 
    },
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
              ? 'bg-[#060117]/85 backdrop-blur-2xl text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_15px_rgba(217,70,239,0.15)] border-b border-cyan-500/25'
              : 'bg-white/95 backdrop-blur-md text-slate-900 shadow-xs border-b border-slate-200')
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Menu / Categories Button & Brand Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onOpenSidebar}
              className={`flex items-center space-x-2 p-2 ${textColor} ${hoverColor} rounded-lg hover:bg-white/5 transition-colors cursor-pointer group`}
              title="Browse Categories"
              aria-label="Open Categories Sidebar"
            >
              <Menu size={22} className="group-hover:scale-105 transition-transform" />
            </button>

            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none shrink-0"
            >
              <img 
                src="/assets/avrora_logo.jpeg" 
                alt="Avrora Dazzle Logo" 
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover shadow-sm ring-1 ring-cyan-500/40 group-hover:ring-cyan-400 group-hover:scale-105 transition-all duration-300 shrink-0"
              />
              <span 
                className={`text-base sm:text-xl lg:text-2xl font-bold uppercase transition-colors font-brand whitespace-nowrap inline-flex items-center gap-1.5 ${
                  isTransparent || isAvroraTheme ? 'text-white' : 'text-slate-900'
                }`}
              >
                <span>AVRORA</span>
                <span className={
                  isTransparent || isAvroraTheme 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400 font-semibold' 
                    : 'text-cyan-600 font-light'
                }>
                  DAZZLE
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links: Mens | Women | Kids | Bridalwears & Accessories | Gift & Fancy Items | Track Order */}
          <nav
            ref={navRef}
            className="hidden md:flex items-center space-x-3 lg:space-x-4 xl:space-x-6 font-medium text-[11px] lg:text-[11.5px] xl:text-[12.5px] tracking-wider uppercase font-poppins h-16"
          >
            {navCategories.map((cat) => {
              const isCurrentActive =
                activeDropdown === cat.id ||
                pathname === cat.path ||
                cat.items.some((item) => pathname === item.path);

              const isOpen = activeDropdown === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative group h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown(cat.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(cat.path, cat.id);
                    }}
                    className={`flex items-center gap-1.5 py-1.5 uppercase transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                      isCurrentActive ? activeColor : `${textColor} ${hoverColor}`
                    }`}
                  >
                    {cat.display ? cat.display : <span>{cat.label}</span>}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-cyan-400' : 'opacity-70 group-hover:opacity-100 group-hover:rotate-180'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(cat.id);
                      }}
                    />
                  </button>

                  {/* Dropdown Panel with seamless CSS group-hover & React open state */}
                  <div
                    className={`absolute top-full left-0 pt-1 z-[100] transition-all duration-200 ease-out ${
                      isOpen
                        ? 'opacity-100 visible pointer-events-auto translate-y-0'
                        : 'opacity-0 invisible pointer-events-none -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0'
                    }`}
                  >
                    <div
                      className={`w-64 rounded-2xl shadow-2xl p-2.5 border transition-all ${
                        isAvroraTheme
                          ? 'bg-[#09031d]/95 backdrop-blur-2xl border-cyan-500/30 text-white shadow-[0_16px_40px_rgba(6,182,212,0.3)]'
                          : 'bg-white/95 backdrop-blur-xl border-slate-200/80 text-slate-800 shadow-[0_16px_36px_rgba(0,0,0,0.12)]'
                      }`}
                    >
                      <div className="max-h-[440px] overflow-y-auto no-scrollbar space-y-1">
                        {cat.items.map((sub, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleItemClick(sub.path, cat.id);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-[12.5px] font-semibold rounded-xl transition-all duration-150 text-left cursor-pointer group/item ${
                              isAvroraTheme
                                ? 'text-slate-200 hover:text-cyan-300 hover:bg-cyan-500/15'
                                : 'text-slate-700 hover:text-cyan-600 hover:bg-slate-100/80'
                            }`}
                          >
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className="w-7 h-7 rounded-lg object-cover border border-slate-100/20 group-hover/item:scale-110 transition-transform shrink-0"
                            />
                            <span className="truncate">{sub.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className={`pt-2 mt-1.5 border-t ${isAvroraTheme ? 'border-cyan-500/20' : 'border-slate-100'}`}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(cat.path, cat.id);
                          }}
                          className="w-full text-center text-[11px] font-bold tracking-wider uppercase py-1 text-cyan-500 hover:text-cyan-400 cursor-pointer transition-colors"
                        >
                          All {cat.label} →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 6. TRACK ORDER */}
            <a
              href="https://track.citypak.lk/"
              className={`${textColor} ${hoverColor} whitespace-nowrap transition-colors select-none py-2`}
            >
              TRACK ORDER
            </a>
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
              <>
                {/* Mobile User Account Icon (Kelly Felder style) */}
                <Link 
                  href="/login" 
                  className={`sm:hidden p-1.5 ${textColor} ${hoverColor} transition-transform hover:scale-105`}
                  title="Sign In / Register"
                  aria-label="Sign In / Register"
                >
                  <User size={21} />
                </Link>

                {/* Desktop Full Login Pill */}
                <Link 
                  href="/login" 
                  className={`hidden sm:inline-flex ${
                    isAvroraTheme 
                      ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-500 text-slate-950 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] font-bold' 
                      : (isTransparent ? 'bg-white text-slate-900 hover:bg-slate-100 hover:text-cyan-600' : 'bg-slate-900 text-white hover:bg-slate-800')
                  } px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all hover:scale-105 font-poppins`}
                >
                  Login
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;