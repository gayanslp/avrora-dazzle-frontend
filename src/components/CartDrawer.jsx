'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const CartDrawer = () => {
  const [mounted, setMounted] = useState(false);
  const { 
    cartItems, 
    isCartDrawerOpen, 
    closeCartDrawer, 
    removeFromCart, 
    updateQuantity, 
    subtotal 
  } = useCart();
  const { isAvroraTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isCartDrawerOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isCartDrawerOpen]);

  if (!mounted || !isCartDrawerOpen || typeof document === 'undefined') return null;

  const handleViewCart = () => {
    closeCartDrawer();
    router.push('/cart');
  };

  const handleCheckout = () => {
    closeCartDrawer();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Animated Dark Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={closeCartDrawer}
      />

      {/* Slide-over Drawer Panel - Flush right, completely responsive */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md shadow-2xl flex flex-col h-full max-h-[100dvh] overflow-hidden z-10 animate-slide-in-right font-didot transition-colors duration-300 ${
        isAvroraTheme
          ? 'bg-[#07021c]/95 border-l border-cyan-500/25 text-slate-100 backdrop-blur-2xl'
          : 'bg-white border-l border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 sm:py-5 border-b flex items-center justify-between shrink-0 ${
          isAvroraTheme ? 'border-cyan-500/20' : 'border-slate-100'
        }`}>
          <h2 className={`text-xl sm:text-2xl font-normal tracking-widest uppercase ${
            isAvroraTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Your cart
          </h2>
          <button 
            onClick={closeCartDrawer}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isAvroraTheme
                ? 'bg-[#0d052d] border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
            title="Close cart"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5 sm:px-6 py-4 space-y-5">
          {cartItems.length === 0 ? (
            <div className={`h-full flex flex-col items-center justify-center text-center py-12 ${
              isAvroraTheme ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isAvroraTheme 
                  ? 'bg-[#0e0630] border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-cyan-300' 
                  : 'bg-slate-50 text-cyan-600'
              }`}>
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className={`text-lg font-medium mb-1 ${isAvroraTheme ? 'text-white' : 'text-slate-800'}`}>
                Your cart is empty
              </h3>
              <p className={`text-xs max-w-xs mb-6 font-sans ${isAvroraTheme ? 'text-slate-400' : 'text-slate-400'}`}>
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={closeCartDrawer}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                  isAvroraTheme
                    ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div 
                key={`${item?.id || index}-${item?.size || ''}-${item?.color || ''}-${index}`}
                className={`flex gap-4 p-3 rounded-xl transition-all ${
                  isAvroraTheme
                    ? 'bg-[#0c0528]/80 border border-cyan-500/20 hover:border-cyan-400/40'
                    : 'bg-slate-50/70 border border-slate-100 hover:bg-slate-50'
                }`}
              >
                {/* Item Image */}
                <div className={`w-20 h-24 rounded-lg overflow-hidden shrink-0 border ${
                  isAvroraTheme ? 'bg-slate-900 border-cyan-500/30' : 'bg-slate-100 border-slate-200'
                }`}>
                  <img 
                    src={item?.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'} 
                    alt={item?.name || 'Product'} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className={`text-sm font-semibold leading-snug line-clamp-1 ${
                        isAvroraTheme ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {item?.name || 'Product'}
                      </h4>
                      <p className={`text-xs mt-0.5 font-sans ${
                        isAvroraTheme ? 'text-cyan-300 font-medium' : 'text-cyan-700 font-medium'
                      }`}>
                        {item?.variant || `${item?.color || 'Standard'} / ${item?.size || 'Standard'}`}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item?.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                        isAvroraTheme
                          ? 'text-slate-400 hover:text-rose-400'
                          : 'border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300'
                      }`}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity & Price Row */}
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity selector */}
                    <div className={`flex items-center border rounded-full px-2 py-0.5 ${
                      isAvroraTheme
                        ? 'border-cyan-500/30 bg-[#0e0630]'
                        : 'border-slate-200 bg-white'
                    }`}>
                      <button 
                        onClick={() => updateQuantity(item?.id, -1)}
                        className={`w-5 h-5 flex items-center justify-center transition cursor-pointer ${
                          isAvroraTheme ? 'text-cyan-300 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={`w-6 text-center text-xs font-bold ${
                        isAvroraTheme ? 'text-white' : 'text-slate-900'
                      }`}>
                        {item?.quantity || 1}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item?.id, 1)}
                        className={`w-5 h-5 flex items-center justify-center transition cursor-pointer ${
                          isAvroraTheme ? 'text-cyan-300 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item Price */}
                    <span className={`text-sm font-bold tracking-tight ${
                      isAvroraTheme ? 'text-cyan-300' : 'text-slate-900'
                    }`}>
                      {item?.currency || 'Rs '}{((item?.price || 0) * (item?.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary Container */}
        {cartItems.length > 0 && (
          <div className={`p-5 sm:p-6 border-t shrink-0 mt-auto transition-colors ${
            isAvroraTheme
              ? 'bg-[#090322]/95 border-cyan-500/25 shadow-xl text-slate-100'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`text-sm sm:text-base font-normal ${isAvroraTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                Total
              </span>
              <span className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isAvroraTheme
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400'
                  : 'text-slate-900'
              }`}>
                Rs {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className={`text-[11px] mb-4 sm:mb-5 font-sans ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
              Taxes and shipping calculated at checkout
            </p>

            <div className="space-y-2.5 sm:space-y-3">
              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                className={`w-full py-3 sm:py-3.5 rounded-full uppercase text-xs font-bold tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer font-didot ${
                  isAvroraTheme
                    ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] hover:scale-[1.01]'
                    : 'bg-slate-950 text-white hover:bg-slate-800 hover:shadow-md'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>CHECKOUT</span>
              </button>

              {/* View Cart Button */}
              <div className="text-center pt-0.5">
                <button
                  onClick={handleViewCart}
                  className={`text-xs font-bold tracking-widest uppercase underline underline-offset-4 cursor-pointer transition-colors font-didot ${
                    isAvroraTheme
                      ? 'text-cyan-300 hover:text-cyan-200'
                      : 'text-slate-900 hover:text-cyan-600'
                  }`}
                >
                  VIEW CART
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};

export default CartDrawer;
