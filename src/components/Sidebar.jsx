'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  X, User, ShoppingBag, LogOut, ChevronRight, ChevronDown, Truck, Layers, Menu as MenuIcon 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchSubCategoriesForSideBar } from '../api/categoryApi';
import { useCategories } from '../context/CategoryContext';
import { useTheme } from '../context/ThemeContext';
import { NAV_CATEGORIES } from '../utils/navigationConfig';

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const { totalItems, openCartDrawer } = useCart();
  const { allSubCategories } = useCategories();
  const { isAvroraTheme } = useTheme();

  // Mobile Tabs: 'menu' (Navbar items) | 'categories' (Sidebar categories)
  const [activeTab, setActiveTab] = useState('menu');
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, [isOpen]);

  // State to manage smooth enter and exit transitions
  const [rendered, setRendered] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [subCats, setSubCats] = useState([]);

  useEffect(() => {
    fetchSubCategoriesForSideBar().then((data) => {
      const fetched = Array.isArray(data) ? data : (data?.data ?? []);
      setSubCats(fetched);
    }).catch((err) => {
      console.error('Failed to load subcategories for sidebar:', err);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      // Small tick to ensure DOM is ready before triggering CSS transition
      const timer = setTimeout(() => {
        setAnimating(true);
      }, 20);
      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
      // Wait for exit transition to finish before unmounting
      const timer = setTimeout(() => {
        setRendered(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent background body scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!rendered || typeof document === 'undefined') return null;

  const handleCategoryClick = (category) => {
    onClose();
    if (category?._id) {
      router.push(`/products/${category._id}`);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('avora_cart');
      window.dispatchEvent(new Event('storage'));
    }
    onClose();
    router.push('/');
  };

  const handleOpenCart = () => {
    onClose();
    openCartDrawer();
  };

  // -----------------------------------------------------------------
  // 1. MENU SECTION: Displays Navbar items on mobile
  // -----------------------------------------------------------------
  const renderMenuSection = () => (
    <div className="space-y-2">
      {NAV_CATEGORIES.map((cat) => {
        const isExpanded = expandedCategory === cat.id;
        return (
          <div 
            key={cat.id} 
            className={`rounded-2xl overflow-hidden transition-all duration-200 border ${
              isAvroraTheme 
                ? 'border-cyan-500/15 bg-white/[0.03]' 
                : 'border-slate-200/90 bg-slate-50/70'
            }`}
          >
            {/* Category Header Row */}
            <button
              type="button"
              onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
              className={`w-full flex items-center justify-between p-3.5 text-left font-medium text-[13.5px] uppercase tracking-wider transition-colors cursor-pointer select-none group ${
                isAvroraTheme ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  isExpanded 
                    ? 'bg-cyan-400 scale-125' 
                    : (isAvroraTheme ? 'bg-slate-600 group-hover:bg-cyan-400' : 'bg-slate-400 group-hover:bg-cyan-600')
                }`} />
                <span className="font-bold font-poppins">{cat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-sans ${
                  isAvroraTheme ? 'bg-white/10 text-cyan-300' : 'bg-slate-200 text-slate-700'
                }`}>
                  {cat.items.length}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    isAvroraTheme ? 'text-slate-400 group-hover:text-cyan-300' : 'text-slate-500 group-hover:text-slate-900'
                  } ${isExpanded ? 'rotate-180 text-cyan-400' : ''}`}
                />
              </div>
            </button>

            {/* Subcategories Accordion Panel */}
            {isExpanded && (
              <div className={`px-3 pb-3 pt-1 space-y-1 border-t animate-fade-in ${
                isAvroraTheme ? 'bg-black/30 border-cyan-500/10' : 'bg-white/80 border-slate-200/80'
              }`}>
                {cat.items.map((sub, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(sub.path);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-[12.5px] rounded-xl transition-all text-left cursor-pointer group/item ${
                      isAvroraTheme 
                        ? 'text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/15' 
                        : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-100'
                    }`}
                  >
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-500/20 group-hover/item:scale-105 transition-transform shrink-0"
                    />
                    <span className="truncate font-medium">{sub.name}</span>
                  </button>
                ))}

                <div className={`pt-2 mt-1 border-t ${isAvroraTheme ? 'border-cyan-500/15' : 'border-slate-200'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(cat.path);
                    }}
                    className="w-full text-center text-[11px] font-bold tracking-widest uppercase py-1.5 text-cyan-500 hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    All {cat.label} →
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Track Order Direct Link */}
      <a
        href="https://track.citypak.lk/"
        onClick={onClose}
        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none group text-[13.5px] uppercase tracking-wider font-bold ${
          isAvroraTheme
            ? 'border-cyan-500/15 bg-white/[0.03] text-slate-200 hover:text-white hover:bg-cyan-500/10'
            : 'border-slate-200/90 bg-slate-50/70 text-slate-800 hover:text-slate-950 hover:bg-slate-100'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Truck size={16} className="text-cyan-500" />
          <span>Track Order</span>
        </div>
        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </div>
  );

  // -----------------------------------------------------------------
  // 2. SHOP BY CATEGORY SECTION: Displays allSubCategories
  // -----------------------------------------------------------------
  const renderCategorySection = () => (
    <div className="space-y-1.5">
      {(allSubCategories || []).filter(Boolean).map((item) => (
        <div key={item?._id || item?.name}>
          <button
            onClick={() => handleCategoryClick(item)}
            className={`w-full text-left font-medium text-[14.5px] sm:text-[15.5px] tracking-wide py-3 px-3.5 rounded-xl transition-all duration-200 cursor-pointer select-none group flex items-center justify-between ${
              isAvroraTheme 
                ? 'text-slate-200 hover:text-white hover:bg-cyan-500/10' 
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            {/* Left Label with Thumbnail & Active Bar */}
            <div className="flex items-center gap-3">
              <span 
                className={`w-1 h-5 rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out ${
                  isAvroraTheme
                    ? 'bg-gradient-to-b from-cyan-400 via-teal-300 to-fuchsia-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                    : 'bg-slate-900'
                }`} 
              />
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className={`w-8 h-8 rounded-full object-cover transition-all duration-300 border ${
                    isAvroraTheme 
                      ? 'border-white/20 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.6)]' 
                      : 'border-slate-300 group-hover:border-slate-900'
                  }`}
                />
              )}
              <span className={`transform transition-transform duration-300 ease-out group-hover:translate-x-1 font-poppins ${
                isAvroraTheme ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-950'
              }`}>
                {item.name}
              </span>
            </div>
            <ChevronRight 
              size={16} 
              className={`transition-all duration-300 group-hover:translate-x-1 ${
                isAvroraTheme ? 'text-slate-400 group-hover:text-cyan-300' : 'text-slate-400 group-hover:text-slate-900'
              }`} 
            />
          </button>
        </div>
      ))}
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Dark Dim Backdrop with Smooth Fade */}
      <div 
        className={`fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-350 ease-out cursor-pointer ${
          animating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel with Smooth Spring-like Easing */}
      <div className="fixed inset-y-0 left-0 h-screen max-w-full flex">
        <div 
          className={`w-screen h-screen max-h-screen max-w-[340px] sm:max-w-[400px] min-h-0 font-poppins flex flex-col transform transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            animating ? 'translate-x-0' : '-translate-x-full'
          } ${
            isAvroraTheme
              ? 'bg-[#02000a] text-white shadow-[25px_0_60px_rgba(0,0,0,0.95)] border-r border-cyan-500/20'
              : 'bg-white text-slate-900 shadow-[25px_0_60px_rgba(0,0,0,0.15)] border-r border-slate-200'
          }`}
        >
          
          {/* Sidebar Header with Brand Logo & Close Button */}
          <div className={`flex items-center justify-between pt-5 px-5 sm:px-6 pb-4 border-b ${
            isAvroraTheme ? 'border-cyan-500/15' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <img 
                src="/assets/avrora_logo.jpeg" 
                alt="Avrora Dazzle" 
                className="h-9 w-9 rounded-full object-cover ring-1 ring-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.45)]"
              />
              <div className="flex flex-col">
                <span className={`text-base font-bold uppercase font-brand ${isAvroraTheme ? 'text-white' : 'text-slate-900'}`}>
                  AVRORA{' '}
                  <span className={
                    isAvroraTheme
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 font-bold'
                      : 'text-cyan-600 font-bold'
                  }>
                    DAZZLE
                  </span>
                </span>
                <span className={`text-[10px] font-normal tracking-widest uppercase font-sans ${
                  isAvroraTheme ? 'text-cyan-400/80' : 'text-slate-500'
                }`}>
                  Textiles
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isAvroraTheme
                  ? 'text-slate-300 hover:text-white hover:bg-cyan-500/15'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Close menu"
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={1.75} />
            </button>
          </div>

          {/* ── MOBILE ONLY: Two Tab Switcher: [ MENU ] | [ SHOP BY CATEGORY ] ── */}
          <div className={`md:hidden px-4 pt-3 pb-2.5 border-b ${
            isAvroraTheme ? 'border-cyan-500/15' : 'border-slate-200'
          }`}>
            <div className={`grid grid-cols-2 p-1 rounded-xl border ${
              isAvroraTheme ? 'bg-white/5 border-white/10 backdrop-blur-md' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className={`py-2 px-2.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'menu'
                    ? (isAvroraTheme
                        ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-fuchsia-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.45)]'
                        : 'bg-white text-slate-950 shadow-md')
                    : (isAvroraTheme ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                }`}
              >
                <MenuIcon size={13} />
                <span>MENU</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-2.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'categories'
                    ? (isAvroraTheme
                        ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-fuchsia-500 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.45)]'
                        : 'bg-white text-slate-950 shadow-md')
                    : (isAvroraTheme ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                }`}
              >
                <Layers size={13} />
                <span>CATEGORIES</span>
              </button>
            </div>
          </div>

          {/* Desktop Subtitle Header (On md+ screens: Categories title) */}
          <div className={`hidden md:flex items-center justify-between px-6 py-3 border-b ${
            isAvroraTheme ? 'border-cyan-500/15' : 'border-slate-200'
          }`}>
            <span className={`text-[11px] font-bold uppercase tracking-widest ${
              isAvroraTheme ? 'text-cyan-400 font-cinzel' : 'text-slate-600 font-bold'
            }`}>
              SHOP BY CATEGORY
            </span>
          </div>

          {/* Scrollable Drawer Body (Scrollbar Hidden via no-scrollbar) */}
          <div 
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar px-3 sm:px-5 py-3"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Mobile View: Render active tab (MENU or SHOP BY CATEGORY) */}
            <div className="block md:hidden">
              {activeTab === 'menu' ? renderMenuSection() : renderCategorySection()}
            </div>

            {/* Desktop View: Always render SHOP BY CATEGORY */}
            <div className="hidden md:block">
              {renderCategorySection()}
            </div>

            {/* Quick Links at the bottom of the list */}
            <div className={`pt-4 pb-2 space-y-1.5 border-t mt-4 ${
              isAvroraTheme ? 'border-cyan-500/15' : 'border-slate-200'
            }`}>
              {/* My Orders / My Account */}
              <button 
                onClick={() => { 
                  onClose(); 
                  const currentToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                  router.push(currentToken ? '/my-orders' : '/login?redirect=/my-orders'); 
                }}
                className={`w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest px-3.5 py-3 rounded-xl transition-all cursor-pointer group ${
                  isAvroraTheme 
                    ? 'text-slate-300 hover:text-white hover:bg-cyan-500/10' 
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <User size={16} className={`group-hover:scale-110 transition-transform ${
                  isAvroraTheme ? 'text-cyan-400' : 'text-cyan-600'
                }`} />
                <span>{token ? 'My Orders' : 'Sign In / Register'}</span>
              </button>

              {/* Shopping Bag Button */}
              <button 
                onClick={handleOpenCart}
                className={`w-full flex items-center justify-between text-xs font-semibold uppercase tracking-widest px-3.5 py-3 rounded-xl transition-all cursor-pointer group ${
                  isAvroraTheme 
                    ? 'text-slate-300 hover:text-white hover:bg-cyan-500/10' 
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={16} className={`group-hover:scale-110 transition-transform ${
                    isAvroraTheme ? 'text-cyan-400' : 'text-cyan-600'
                  }`} />
                  <span>My Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow shadow-cyan-500/30">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Sign Out Button (if logged in) */}
              {token && (
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest px-3.5 py-3 rounded-xl transition-all cursor-pointer group text-rose-500 hover:bg-rose-500/10"
                >
                  <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>

          {/* Minimal Bottom Brand Line */}
          <div className={`px-6 sm:px-8 py-3.5 border-t flex items-center justify-between text-[11px] uppercase tracking-widest font-cinzel ${
            isAvroraTheme ? 'border-cyan-500/15 text-slate-400' : 'border-slate-200 text-slate-500'
          }`}>
            <span className={
              isAvroraTheme 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 font-bold' 
                : 'text-slate-900 font-bold'
            }>
              AVRORA DAZZLE
            </span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default Sidebar;