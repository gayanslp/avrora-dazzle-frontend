import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, User, ShoppingBag, LogOut, ChevronRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchSubCategoriesForSideBar } from '../api/categoryApi';
import { useCategories } from '../context/CategoryContext';
import { useTheme } from '../context/ThemeContext';

// Categories matching the luxury fashion reference image
const CATEGORIES = [
  { name: 'Ladies Wear', slug: 'ladies-wear' },
  { name: 'Gents Wear', slug: 'gents-wear' },
  { name: 'UP TO 50% OFF', slug: 'sale' },
  { name: 'Kids Wear', slug: 'kids-wear' },
  { name: 'Bridalwears & Accessories', slug: 'bridal-wear' },
  { name: 'GYM & Activewear', slug: 'gym-activewear' },
  { name: 'Gift & Fancy Items', slug: 'fancy-gift' },
];


const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { totalItems, openCartDrawer } = useCart();
  const { allSubCategories } = useCategories();
  const { isAvroraTheme } = useTheme();

  // State to manage smooth enter and exit transitions
  const [rendered, setRendered] = useState(isOpen);
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

  if (!rendered) return null;

  const handleCategoryClick = (category) => {
    onClose();
    if (category?._id) {
      navigate(`/products/${category._id}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('avora_cart');
    window.dispatchEvent(new Event('storage'));
    onClose();
    navigate('/');
  };

  const handleOpenCart = () => {
    onClose();
    openCartDrawer();
  };

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
          } bg-[#02000a] text-white shadow-[25px_0_60px_rgba(0,0,0,0.95)] border-r border-cyan-500/20`}
        >
          
          {/* Sidebar Header with Brand Logo & Close Button */}
          <div className="flex items-center justify-between pt-6 px-6 sm:px-8 pb-4 border-b border-cyan-500/15">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/avrora_logo.jpeg" 
                alt="Avrora Dazzle" 
                className="h-10 w-10 rounded-full object-cover ring-1 ring-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.45)]"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold uppercase font-brand text-white">
                  AVRORA{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 font-bold">
                    DAZZLE
                  </span>
                </span>
                <span className="text-[10px] font-normal tracking-widest uppercase font-sans text-cyan-400/80">
                  Textiles
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer text-slate-300 hover:text-white hover:bg-cyan-500/15 hover:border hover:border-cyan-500/30"
              title="Close menu"
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Categories List (Scrollbar Hidden via no-scrollbar) */}
          <div 
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar px-3 sm:px-5 py-3 space-y-1.5"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {(allSubCategories || []).filter(Boolean).map((item) => (
              <div key={item?._id || item?.name}>
                <button
                  onClick={() => handleCategoryClick(item)}
                  className="w-full text-left font-medium text-[15px] sm:text-[16px] tracking-wide py-3 px-3.5 rounded-xl transition-all duration-200 cursor-pointer select-none group flex items-center justify-between text-slate-200 sidebar-aurora-item"
                >
                  {/* Left Label with Subcategory Thumbnail & Animated Indicator Bar */}
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-1 h-5 rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out bg-gradient-to-b from-cyan-400 via-teal-300 to-fuchsia-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                    />
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-8 h-8 rounded-full object-cover transition-all duration-300 border border-white/20 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                      />
                    )}
                    <span className="transform transition-transform duration-300 ease-out group-hover:translate-x-1 font-poppins text-slate-200 group-hover:text-white">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-300" />
                </button>
              </div>
            ))}

            {/* Quick Links at the bottom of the list */}
            <div className="pt-4 pb-2 space-y-1.5 border-t border-cyan-500/15 mt-3">
              <a 
                href="https://track.citypak.lk/"
                onClick={onClose}
                className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest px-3.5 py-3 rounded-xl transition-all cursor-pointer group text-slate-300 sidebar-aurora-item"
              >
                <Truck size={16} className="group-hover:scale-110 text-cyan-400 transition-transform" />
                <span className="group-hover:text-white transition-colors">Track Order</span>
              </a>

              <button 
                onClick={handleOpenCart}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-widest px-3.5 py-3 rounded-xl transition-all cursor-pointer group text-slate-300 sidebar-aurora-item"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={16} className="group-hover:scale-110 text-cyan-400 transition-transform" />
                  <span className="group-hover:text-white transition-colors">My Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow shadow-cyan-500/30">
                    {totalItems}
                  </span>
                )}
              </button>

              {token ? (
                <>
                  <button 
                    onClick={() => { 
                      onClose(); 
                      const token = localStorage.getItem('token');
                      navigate(token ? '/checkout' : '/login?redirect=/checkout'); 
                    }}
                    className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest px-3.5 py-3 rounded-xl transition-all cursor-pointer group text-slate-300 sidebar-aurora-item"
                  >
                    <User size={16} className="group-hover:scale-110 text-cyan-400 transition-transform" />
                    <span className="group-hover:text-white transition-colors">My Account</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest px-3.5 py-3 rounded-xl transition-all cursor-pointer group text-rose-400 sidebar-aurora-item"
                  >
                    <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { onClose(); navigate('/login'); }}
                  className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest px-3.5 py-3 rounded-xl transition-all cursor-pointer group text-slate-300 sidebar-aurora-item"
                >
                  <User size={16} className="group-hover:scale-110 text-cyan-400 transition-transform" />
                  <span className="group-hover:text-white transition-colors">Sign In / Register</span>
                </button>
              )}
            </div>
          </div>

          {/* Minimal Bottom Brand Line */}
          <div className="px-6 sm:px-8 py-4 border-t border-cyan-500/15 flex items-center justify-between text-[11px] uppercase tracking-widest text-slate-400 font-cinzel">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 font-bold">AVRORA DAZZLE</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default Sidebar;