import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { 
    cartItems, 
    isCartDrawerOpen, 
    closeCartDrawer, 
    removeFromCart, 
    updateQuantity, 
    subtotal 
  } = useCart();
  const navigate = useNavigate();

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const handleViewCart = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  const handleCheckout = () => {
    closeCartDrawer();
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated Dark Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={closeCartDrawer}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-slide-in-right">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-xl font-normal text-stone-900 tracking-tight">Your cart</h2>
            <button 
              onClick={closeCartDrawer}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors"
              title="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-stone-400 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-medium text-stone-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-stone-400 max-w-xs mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <button
                  onClick={closeCartDrawer}
                  className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 pb-5 border-b border-stone-100 relative group animate-fade-in"
                >
                  {/* Item Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-24 object-cover rounded-lg bg-stone-100 border border-stone-200/60 shadow-xs shrink-0" 
                  />

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-stone-900 leading-snug">{item.name}</h4>
                        <p className="text-xs text-stone-500 mt-0.5 font-medium">{item.variant || `${item.color || 'Standard'} / ${item.size || 'Standard'}`}</p>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 rounded-full border border-stone-200 hover:border-red-400 text-stone-400 hover:text-red-500 flex items-center justify-center transition-colors shrink-0"
                        title="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quantity & Price Row */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-stone-300 rounded-full px-2.5 py-1 bg-stone-50/50">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-black transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-stone-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-black transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Price */}
                      <span className="text-sm font-bold text-stone-900 tracking-tight">
                        {item.currency || 'Rs '}{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary Container matching Kelly Felder layout */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#e9e9e9] border-t border-stone-200/70 shadow-inner">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-base font-medium text-stone-800">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight">
                  Rs {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mb-5 font-normal">
                Taxes and shipping calculated at checkout
              </p>

              <div className="space-y-3">
                {/* Checkout Button */}
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-stone-950 text-white py-3.5 rounded-full uppercase text-xs font-semibold tracking-widest hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>CHECKOUT</span>
                </button>

                {/* View Cart Button */}
                <div className="text-center pt-1">
                  <button
                    onClick={handleViewCart}
                    className="text-xs font-bold tracking-widest uppercase text-stone-900 hover:text-stone-700 underline underline-offset-4 cursor-pointer transition-colors"
                  >
                    VIEW CART
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
