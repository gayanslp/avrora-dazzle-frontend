import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, ShoppingBag, LogOut, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchSubCategoriesForSideBar } from '../api/categoryApi';
import { mockSubCategoriesWithAssets } from '../assets/categories/categoryAssets';

// Categories matching the luxury fashion reference image
const CATEGORIES = [
  { name: 'Ladies Wear', slug: 'ladies-wear' },
  { name: 'Gents Wear', slug: 'gents-wear' },
  { name: 'UP TO 50% OFF', slug: 'sale' },
  { name: 'Kids Wear', slug: 'kids-wear' },
  { name: 'Bridal Wear & Accessories', slug: 'bridal-wear' },
  { name: 'GYM & Activewear', slug: 'gym-activewear' },
  { name: 'Fancy & Gift Items', slug: 'fancy-gift' },
  // { name: 'Crop Tops', slug: 'crop-tops' },
  // { name: 'Denims', slug: 'denims' },
  // { name: 'Athleisure', slug: 'athleisure', isAccent: true }
];


const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { totalItems, openCartDrawer } = useCart();

  // State to manage smooth enter and exit transitions
  const [rendered, setRendered] = useState(isOpen);
  const [animating, setAnimating] = useState(false);
  const [subCats, setSubCats] = useState([]);

  useEffect(() => {
    fetchSubCategoriesForSideBar().then((data) => {
      const fetched = Array.isArray(data) ? data : (data?.data ?? []);
      setSubCats(fetched.length > 0 ? fetched : mockSubCategoriesWithAssets);
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
    navigate(`/products/${category._id}`);
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Dim Backdrop with Smooth Fade */}
      <div 
        className={`fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-350 ease-out cursor-pointer ${
          animating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel with Smooth Spring-like Easing */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div 
          className={`w-screen max-w-[340px] sm:max-w-[400px] bg-slate-950/95 backdrop-blur-xl text-white shadow-[20px_0_40px_rgba(6,182,212,0.1)] flex flex-col transform transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            animating ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          
          {/* Top Right Close Button */}
          <div className="flex justify-end pt-6 pr-6 pb-2">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer"
              title="Close menu"
              aria-label="Close menu"
            >
              <X size={26} strokeWidth={1.5} />
            </button>
          </div>

          {/* Categories List (Scrollbar Hidden via no-scrollbar) */}
          <div 
            className="flex-1 overflow-y-auto no-scrollbar px-7 sm:px-9 py-2 divide-y divide-slate-800/50"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {subCats.map((item, index) => (
              <div key={index} className="py-1">
                <button
                  onClick={() => handleCategoryClick(item)}
                  className={`w-full text-left font-bold text-base sm:text-[17px] tracking-wide py-3 sm:py-3.5 px-3 -mx-3 rounded-xl transition-all duration-200 cursor-pointer select-none group flex items-center justify-between hover:bg-cyan-500/5 ${
                    item.isAccent 
                      ? 'text-cyan-400 hover:text-cyan-300' 
                      : 'text-white hover:text-cyan-50'
                  }`}
                >
                  {/* Left Label with Subcategory Thumbnail & Animated Indicator Bar */}
                  <div className="flex items-center gap-3">
                    <span 
                      className={`w-1 h-4 rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out ${
                        item.isAccent ? 'bg-cyan-400' : 'bg-cyan-500'
                      }`} 
                    />
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-700 group-hover:border-cyan-400 transition-colors"
                      />
                    )}
                    <span className="transform transition-transform duration-300 ease-out group-hover:translate-x-1">
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors opacity-70 group-hover:opacity-100" />
                </button>
              </div>
            ))}

            {/* Quick Links at the bottom of the list */}
            <div className="pt-6 pb-4 space-y-3">
              <button 
                onClick={handleOpenCart}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-3 -mx-3 py-2.5 rounded-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
                  <span>My Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow shadow-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                    className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-3 -mx-3 py-2.5 rounded-lg transition-all cursor-pointer group"
                  >
                    <User size={16} className="group-hover:scale-110 transition-transform" />
                    <span>My Account</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 px-3 -mx-3 py-2.5 rounded-lg transition-all cursor-pointer group"
                  >
                    <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { onClose(); navigate('/login'); }}
                  className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-3 -mx-3 py-2.5 rounded-lg transition-all cursor-pointer group"
                >
                  <User size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          </div>

          {/* Minimal Bottom Brand Line */}
          <div className="px-7 sm:px-9 py-4 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-widest">
            <span>AVRORA DAZZLE</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;