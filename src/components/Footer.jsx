import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-slate-900 pt-16 pb-8 relative z-10 w-full mt-auto">
      {/* Subtle top border instead of torn paper for clean modern look */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-200"></div>

      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        
        {/* Top Section - 5 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          
          {/* Shop By Category */}
          <div className="flex flex-col gap-3.5">
            <h3 className="font-bold text-[13px] uppercase tracking-wider mb-2">Shop By Category</h3>
            <Link to="/products" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">New Arrivals</Link>
            <Link to="/products/gents-wear" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Gents Wear</Link>
            <Link to="/products/ladies-wear" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Ladies Wear</Link>
            <Link to="/products/kids-wear" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Kids Wear</Link>
            <Link to="/products/bridal-wear" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Bridal Wear</Link>
            <Link to="/products/gym-activewear" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Gym & Activewear</Link>
            <Link to="/products/accessories" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Accessories</Link>
          </div>

          {/* Information */}
          <div className="flex flex-col gap-3.5">
            <h3 className="font-bold text-[13px] uppercase tracking-wider mb-2">Information</h3>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Careers</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">About Us</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Contact Us</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Angel Club</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Events</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Size Guide</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Blogs</Link>
          </div>

          {/* Terms of Use */}
          <div className="flex flex-col gap-3.5">
            <h3 className="font-bold text-[13px] uppercase tracking-wider mb-2">Term of Use</h3>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Terms & Conditions</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Shipping & Returns</Link>
            <Link to="/track-order" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Track Orders</Link>
          </div>

          {/* Shop By Brand */}
          <div className="flex flex-col gap-3.5">
            <h3 className="font-bold text-[13px] uppercase tracking-wider mb-2">Shop By Brand</h3>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Avrora Dazzle</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Scylla Zelus</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Redvers Buller</Link>
            <Link to="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">EIGHTY %</Link>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4 lg:col-span-1 sm:col-span-2">
            <h3 className="font-bold text-[13px] uppercase tracking-wider mb-1">Join our Newsletter</h3>
            <p className="text-[12px] font-medium text-slate-600 leading-relaxed mb-1">
              Be the First to Discover New Collections & Exclusive Offers
            </p>
            <div className="flex w-full mb-3 shadow-sm rounded-full overflow-hidden">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-slate-100 text-slate-900 text-[13px] font-medium px-4 py-3 outline-none w-full border border-transparent focus:border-slate-300 transition-colors flex-1"
              />
              <button className="bg-slate-950 text-white text-[11px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-slate-800 transition-colors cursor-pointer shrink-0">
                Subscribe
              </button>
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <a href="#" className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-all cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-all cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-all cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[12px] font-semibold text-slate-600">
            Copyright &copy; {new Date().getFullYear()} AVRORA DAZZLE. All rights reserved.
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <select className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded px-2 py-1.5 outline-none cursor-pointer">
                <option>EN</option>
              </select>
              <select className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded px-2 py-1.5 outline-none cursor-pointer">
                <option>LKR</option>
                <option>USD</option>
              </select>
            </div>

            <div className="flex gap-1.5 items-center">
              {/* Payment Icons */}
              <div className="w-9 h-6 bg-slate-100 border border-slate-200 rounded text-[9px] font-black flex items-center justify-center text-blue-600">VISA</div>
              <div className="w-9 h-6 bg-slate-100 border border-slate-200 rounded text-[9px] font-black flex items-center justify-center text-red-500">MC</div>
              <div className="w-9 h-6 bg-slate-100 border border-slate-200 rounded text-[9px] font-black flex items-center justify-center text-sky-500">AMEX</div>
              <div className="w-9 h-6 bg-slate-100 border border-slate-200 rounded text-[9px] font-black flex items-center justify-center text-slate-700">PAY</div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
