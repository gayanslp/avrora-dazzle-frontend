import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, ShoppingBag, LogOut, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Categories matching the luxury fashion reference image
const CATEGORIES = [
  { name: 'Ladies Wear', slug: 'ladies-wear' },
  { name: 'Gents Wear', slug: 'gents-wear' },
  { name: 'UP TO 50% OFF', slug: 'sale' },
  { name: 'Kids Wear', slug: 'kids-wear' },
  { name: 'Bridal Wear & Accessories', slug: 'bridal-wear' },
  { name: 'GYM & Activewear', slug: 'gym-activewear' },
  { name: 'Fancy & Gift Items', slug: 'workwear' },
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
    navigate(`/productDetails?category=${category.slug}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
          className={`w-screen max-w-[340px] sm:max-w-[400px] bg-black text-white shadow-2xl flex flex-col transform transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            animating ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          
          {/* Top Right Close Button */}
          <div className="flex justify-end pt-6 pr-6 pb-2">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-stone-300 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              title="Close menu"
              aria-label="Close menu"
            >
              <X size={26} strokeWidth={1.5} />
            </button>
          </div>

          {/* Categories List (Scrollbar Hidden via no-scrollbar) */}
          <div 
            className="flex-1 overflow-y-auto no-scrollbar px-7 sm:px-9 py-2 divide-y divide-[#202020]"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {CATEGORIES.map((item, index) => (
              <div key={index} className="py-1">
                <button
                  onClick={() => handleCategoryClick(item)}
                  className={`w-full text-left font-bold text-base sm:text-[17px] tracking-wide py-3.5 sm:py-4 px-3 -mx-3 rounded-xl transition-all duration-200 cursor-pointer select-none group flex items-center justify-between hover:bg-white/[0.04] ${
                    item.isAccent 
                      ? 'text-[#A27B5C] hover:text-[#c79872]' 
                      : 'text-white hover:text-white'
                  }`}
                >
                  {/* Left Label with Animated Indicator Bar */}
                  <div className="flex items-center">
                    <span 
                      className={`w-1 h-4 rounded-full mr-2.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out ${
                        item.isAccent ? 'bg-[#A27B5C]' : 'bg-white'
                      }`} 
                    />
                    <span className="transform transition-transform duration-300 ease-out group-hover:translate-x-1">
                      {item.name}
                    </span>
                  </div>

                  {/* Right Arrow Animated Appear on Hover */}
                  <div className="flex items-center">
                    <ChevronRight 
                      size={18} 
                      className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out ${
                        item.isAccent ? 'text-[#A27B5C]' : 'text-stone-300'
                      }`} 
                    />
                  </div>
                </button>
              </div>
            ))}

            {/* Quick Links at the bottom of the list */}
            <div className="pt-6 pb-4 space-y-3">
              <button 
                onClick={handleOpenCart}
                className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-white hover:bg-white/[0.04] px-3 -mx-3 py-2.5 rounded-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" />
                  <span>My Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                    className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-white hover:bg-white/[0.04] px-3 -mx-3 py-2.5 rounded-lg transition-all cursor-pointer group"
                  >
                    <User size={16} className="group-hover:scale-110 transition-transform" />
                    <span>My Account</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 -mx-3 py-2.5 rounded-lg transition-all cursor-pointer group"
                  >
                    <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { onClose(); navigate('/login'); }}
                  className="w-full flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-white hover:bg-white/[0.04] px-3 -mx-3 py-2.5 rounded-lg transition-all cursor-pointer group"
                >
                  <User size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          </div>

          {/* Minimal Bottom Brand Line */}
          <div className="px-7 sm:px-9 py-4 border-t border-[#1a1a1a] flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-widest">
            <span>AVRORA DAZZLE</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;