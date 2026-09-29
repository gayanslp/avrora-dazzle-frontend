import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowRight, 
  X, 
  ChevronDown, 
  Lock, 
  Plus, 
  Minus,
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    totalItems, 
    subtotal,
    addToCart
  } = useCart();

  const navigate = useNavigate();
  const [country, setCountry] = useState("Sri Lanka");
  const [zipCode, setZipCode] = useState("");
  const [estimated, setEstimated] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  const grandTotal = subtotal + shippingCost;

  const handleGetEstimates = (e) => {
    e.preventDefault();
    setShippingCost(450);
    setEstimated(true);
  };

  return (
    <div 
      style={{ fontFamily: '"Avenir", "Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white"
    >
      {/* Top Announcement / Promo Bar */}
      <div className="bg-neutral-900 text-white text-xs text-center py-2.5 px-4 tracking-widest uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Free Islandwide Delivery on Orders Over Rs. 10,000</span>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Page Title & Navigation Bar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-200 pb-6 mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-900">Your cart</h1>
            <p className="text-sm text-neutral-500 mt-1 font-medium">In your bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})</p>
          </div>

          <Link 
            to="/productDetails" 
            className="inline-flex items-center justify-between border border-neutral-900 rounded-full px-6 py-3 text-xs font-semibold tracking-wider uppercase hover:bg-neutral-900 hover:text-white transition-all duration-200 group self-start md:self-auto shadow-xs hover:shadow-md"
          >
            <span>Continue shopping</span>
            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100/80 shadow-xs animate-fade-in max-w-2xl mx-auto px-4">
            <div className="w-20 h-20 rounded-full bg-white shadow-xs border border-neutral-200 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-10 h-10 text-neutral-400 stroke-[1.2]" />
            </div>
            <h2 className="text-2xl font-light mb-2 text-neutral-900">Your cart is currently empty</h2>
            <p className="text-sm text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed">
              Explore our new arrivals and find something special to add to your collection.
            </p>
            <div className="flex justify-center">
              <Link 
                to="/productDetails"
                className="bg-neutral-900 text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-md"
              >
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Grid Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
            
            {/* Left Column: Cart Items & Shipping Estimator */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative shadow-xs hover:shadow-md transition-all duration-300 animate-fade-in"
                  >
                    {/* Item Details */}
                    <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-24 sm:w-24 sm:h-32 object-cover rounded-xl bg-neutral-100 border border-neutral-200/60 shrink-0" 
                      />
                      <div className="flex-1 sm:flex-initial">
                        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 leading-snug">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">{item.variant || `${item.color} / ${item.size}`}</p>
                        <p className="text-sm font-semibold text-neutral-900 mt-2 font-sans">
                          {item.currency || 'Rs '}{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls & Item Total */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                      
                      {/* Pill Quantity Selector */}
                      <div className="flex items-center border border-neutral-300 rounded-full px-3 py-1.5 bg-neutral-50 shadow-2xs">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-black transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="mx-2 text-sm font-bold w-6 text-center text-neutral-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-black transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for Item */}
                      <div className="text-right min-w-[110px]">
                        <span className="text-sm sm:text-base font-bold text-neutral-950 font-sans">
                          {item.currency || 'Rs '}{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Remove button */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full border border-neutral-200 hover:border-red-400 text-neutral-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer"
                        title="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>

                    </div>
                  </div>
                ))}
              </div>

              {/* Estimate Shipping Section */}
              <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-neutral-700" />
                  <h3 className="text-base sm:text-lg font-medium text-neutral-900">
                    Get estimate shipping for your order
                  </h3>
                </div>

                <form onSubmit={handleGetEstimates} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
                      Country
                    </label>
                    <div className="relative">
                      <select 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full appearance-none bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 pr-10 shadow-2xs"
                      >
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Australia">Australia</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
                      Zip Code
                    </label>
                    <input 
                      type="text" 
                      placeholder="Postal / Pin Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 shadow-2xs"
                    />
                  </div>

                  <div>
                    <button 
                      type="submit"
                      className="w-full bg-neutral-950 text-white rounded-xl py-3.5 px-6 text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>GET ESTIMATES</span>
                      <span className="w-2 h-2 rounded-full bg-white flex-shrink-0"></span>
                    </button>
                  </div>
                </form>

                {estimated && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-700 flex justify-between items-center animate-fade-in shadow-2xs">
                    <span>Estimated Shipping to <strong className="text-neutral-900">{country}</strong> ({zipCode || 'Standard'}):</span>
                    <span className="font-bold text-neutral-950 text-sm">Rs {shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Price Details & Checkout */}
            <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 sticky top-28">
              <h2 className="text-xl font-light text-white border-b border-neutral-800 pb-4 tracking-wide">
                Price Details
              </h2>

              <div className="space-y-4 text-neutral-300">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-white">
                    Rs {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {estimated && (
                  <div className="flex justify-between text-sm">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-white">
                      Rs {shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-4 border-t border-neutral-800">
                  <span className="text-base sm:text-lg font-medium text-white">Total</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Rs {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
                Taxes and shipping calculated at checkout. Free shipping eligible for orders over Rs. 10,000.
              </p>

              <button 
                onClick={() => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    navigate('/checkout');
                  } else {
                    navigate('/login?redirect=/checkout');
                  }
                }}
                className="w-full bg-white text-neutral-950 rounded-full py-4 px-6 text-xs font-bold tracking-widest uppercase hover:bg-neutral-100 transition-all flex items-center justify-between group shadow-lg cursor-pointer transform active:scale-[0.99]"
              >
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-neutral-950" />
                  <span>PROCEED TO CHECKOUT</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-950 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
              </button>

              <div className="pt-4 border-t border-neutral-800/80 text-center flex items-center justify-center gap-2 text-neutral-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="uppercase tracking-widest font-medium">Secure & Encrypted Checkout</span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white text-stone-800 pt-16 pb-12 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-stone-900 mb-5">Shop By Category</h4>
            <ul className="space-y-3 text-xs text-stone-600">
              <li><a href="#new" className="hover:text-stone-900 transition">New Arrivals</a></li>
              <li><a href="#workwear" className="hover:text-stone-900 transition">Workwear</a></li>
              <li><a href="#dresses" className="hover:text-stone-900 transition">Dresses</a></li>
              <li><a href="#evening" className="hover:text-stone-900 transition">Evening Wear</a></li>
              <li><a href="#accessories" className="hover:text-stone-900 transition">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-stone-900 mb-5">Information</h4>
            <ul className="space-y-3 text-xs text-stone-600">
              <li><a href="#careers" className="hover:text-stone-900 transition">Careers</a></li>
              <li><a href="#about" className="hover:text-stone-900 transition">About Us</a></li>
              <li><a href="#contact" className="hover:text-stone-900 transition">Contact Us</a></li>
              <li><a href="#angel" className="hover:text-stone-900 transition">Angel Club</a></li>
              <li><a href="#events" className="hover:text-stone-900 transition">Events</a></li>
              <li><a href="#sizeguide" className="hover:text-stone-900 transition">Size Guide</a></li>
              <li><a href="#blogs" className="hover:text-stone-900 transition">Blogs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-stone-900 mb-5">Term of Use</h4>
            <ul className="space-y-3 text-xs text-stone-600">
              <li><a href="#terms" className="hover:text-stone-900 transition">Terms & Conditions</a></li>
              <li><a href="#privacy" className="hover:text-stone-900 transition">Privacy Policy</a></li>
              <li><a href="#shipping" className="hover:text-stone-900 transition">Shipping & Returns</a></li>
              <li><a href="#track" className="hover:text-stone-900 transition">Track Orders</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-stone-900 mb-5">Shop By Brand</h4>
            <ul className="space-y-3 text-xs text-stone-600">
              <li><a href="#kelly" className="hover:text-stone-900 transition">Kelly Felder</a></li>
              <li><a href="#scylla" className="hover:text-stone-900 transition">Scylla Zelus</a></li>
              <li><a href="#redvers" className="hover:text-stone-900 transition">Redvers Buller</a></li>
              <li><a href="#eighty" className="hover:text-stone-900 transition">EIGHTY %</a></li>
              <li><a href="#lostkids" className="hover:text-stone-900 transition">Lost Kids</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs uppercase font-bold tracking-widest text-stone-900 mb-3">Join our Newsletter</h4>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">Be the First to Discover New Collections & Exclusive Offers</p>
            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-3">
              <input 
                type="email" 
                placeholder="Email address" 
                required
                className="w-full bg-stone-100 border border-stone-200 px-4 py-3 text-xs rounded-lg text-stone-900 focus:outline-none focus:border-stone-900"
              />
              <button type="submit" className="w-full bg-stone-950 text-white px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition">
                SUBSCRIBE &bull;
              </button>
            </form>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <p className="text-xs text-stone-600">Copyright&copy; {new Date().getFullYear()} Kelly Felder</p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="px-2 py-1 bg-blue-700 text-white font-bold text-[9px] rounded">AMEX</span>
            <span className="px-2 py-1 bg-black text-white font-bold text-[9px] rounded">Pay</span>
            <span className="px-2 py-1 bg-blue-600 text-white font-bold text-[9px] rounded">O</span>
            <span className="px-2 py-1 bg-amber-600 text-white font-bold text-[9px] rounded">DISCOVER</span>
            <span className="px-2 py-1 bg-white border border-stone-300 text-stone-900 font-bold text-[9px] rounded">G Pay</span>
            <span className="px-2 py-1 bg-blue-800 text-white font-bold text-[9px] rounded">JCB</span>
            <span className="px-2 py-1 bg-red-600 text-white font-bold text-[9px] rounded">mastercard</span>
            <span className="px-2 py-1 bg-blue-700 text-white font-bold text-[9px] rounded">VISA</span>
          </div>

        </div>
      </footer>
    </div>
  );
}