'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Mail, Send, ShieldCheck, Truck, Sparkles, Check, 
  ExternalLink, Clock, ArrowUp
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isAvroraTheme } = useTheme();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput && emailInput.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmailInput('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className={`relative z-10 w-full mt-auto font-poppins transition-colors duration-300 overflow-hidden ${
      isAvroraTheme
        ? 'bg-[#030014] text-slate-300 border-t border-cyan-500/20'
        : 'bg-white text-slate-700 border-t border-slate-200'
    }`}>
      {/* Top Ambient Glow / Accent Line */}
      <div className={`w-full h-[1px] ${
        isAvroraTheme
          ? 'bg-gradient-to-r from-transparent via-cyan-400 to-fuchsia-500 opacity-70 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
          : 'bg-gradient-to-r from-transparent via-slate-300 to-transparent'
      }`} />

      {/* Trust & Guarantee Highlights Bar */}
      <div className={`border-b ${
        isAvroraTheme 
          ? 'border-cyan-500/10 bg-cyan-950/10' 
          : 'border-slate-100 bg-slate-50/80'
      }`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isAvroraTheme 
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]' 
                  : 'bg-white text-slate-900 border border-slate-200 shadow-xs'
              }`}>
                <Truck size={18} />
              </div>
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isAvroraTheme ? 'text-white' : 'text-slate-900'}`}>
                  Islandwide Delivery
                </h4>
                <p className={`text-[11px] ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  Fast & safe doorstep courier
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isAvroraTheme 
                  ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 shadow-[0_0_12px_rgba(217,70,239,0.25)]' 
                  : 'bg-white text-slate-900 border border-slate-200 shadow-xs'
              }`}>
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isAvroraTheme ? 'text-white' : 'text-slate-900'}`}>
                  Haute Couture Quality
                </h4>
                <p className={`text-[11px] ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  Curated fabrics & craftsmanship
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isAvroraTheme 
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]' 
                  : 'bg-white text-slate-900 border border-slate-200 shadow-xs'
              }`}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isAvroraTheme ? 'text-white' : 'text-slate-900'}`}>
                  Secure Payments
                </h4>
                <p className={`text-[11px] ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  Card, Visa, MC, & PayHere
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isAvroraTheme 
                  ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 shadow-[0_0_12px_rgba(217,70,239,0.25)]' 
                  : 'bg-white text-slate-900 border border-slate-200 shadow-xs'
              }`}>
                <Clock size={18} />
              </div>
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isAvroraTheme ? 'text-white' : 'text-slate-900'}`}>
                  Direct Concierge
                </h4>
                <p className={`text-[11px] ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  24/7 dedicated email support
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Navigation & Contact Content */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand Info & Mission (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <img 
                src="/assets/avrora_logo.jpeg" 
                alt="Avrora Dazzle Logo" 
                className={`h-11 w-11 rounded-full object-cover transition-transform duration-300 group-hover:scale-105 shrink-0 ${
                  isAvroraTheme 
                    ? 'ring-2 ring-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                    : 'ring-1 ring-slate-300 shadow-xs'
                }`}
              />
              <div className="flex flex-col">
                <span className={`text-xl font-bold uppercase font-brand tracking-widest ${
                  isAvroraTheme ? 'text-white' : 'text-slate-950'
                }`}>
                  AVRORA{' '}
                  <span className={
                    isAvroraTheme 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 font-bold' 
                      : 'text-slate-900 font-light'
                  }>
                    DAZZLE
                  </span>
                </span>
                <span className={`text-[10px] tracking-[0.25em] uppercase font-medium ${
                  isAvroraTheme ? 'text-cyan-400/80' : 'text-slate-500'
                }`}>
                  Textiles & Haute Couture
                </span>
              </div>
            </Link>

            <p className={`text-xs sm:text-[13px] leading-relaxed max-w-sm ${
              isAvroraTheme ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Contemporary luxury textiles, trendsetting elegance, and distinctive collections designed to inspire confidence and individuality.
            </p>

            {/* Direct Contact Us Through Email Card */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${
              isAvroraTheme 
                ? 'bg-[#090224]/80 border-cyan-500/25 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-400/50' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
            }`}>
              <div className={`flex items-center gap-2 mb-1.5 text-xs font-semibold uppercase tracking-wider ${
                isAvroraTheme ? 'text-cyan-400' : 'text-slate-900'
              }`}>
                <Mail size={15} />
                <span>Contact Us Direct</span>
              </div>
              <p className={`text-[11px] mb-2.5 ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Have questions or need assistance? Email our support team:
              </p>
              <a 
                href="mailto:support@avroradazzle.com?subject=Inquiry%20from%20Avrora%20Dazzle%20Customer"
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all group cursor-pointer ${
                  isAvroraTheme
                    ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/40 hover:bg-cyan-500/25 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-950 text-white border border-slate-900 hover:bg-slate-800 shadow-sm'
                }`}
              >
                <span className="font-semibold">support@avroradazzle.com</span>
                <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 2: Collections Links (2.5 cols) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col gap-3">
            <h3 className={`font-bold text-[12px] uppercase tracking-[0.18em] font-cinzel mb-1 flex items-center gap-1.5 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950 font-bold'
            }`}>
              <span>Collections</span>
            </h3>
            <ul className="flex flex-col gap-2.5 text-[13px]">
              <li>
                <Link href="/products" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-cyan-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products/ladies-wear" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-cyan-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Ladies Wear
                </Link>
              </li>
              <li>
                <Link href="/products/gents-wear" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-cyan-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Gents Wear
                </Link>
              </li>
              <li>
                <Link href="/products/kids-wear" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-cyan-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Kids Wear
                </Link>
              </li>
              <li>
                <Link href="/products/dresses" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-cyan-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Signature Dresses
                </Link>
              </li>
              <li>
                <Link href="/products/skirts" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-cyan-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Skirts & Ensembles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Account (2.5 cols) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col gap-3">
            <h3 className={`font-bold text-[12px] uppercase tracking-[0.18em] font-cinzel mb-1 ${
              isAvroraTheme ? 'text-white' : 'text-slate-950 font-bold'
            }`}>
              <span>Customer Care</span>
            </h3>
            <ul className="flex flex-col gap-2.5 text-[13px]">
              <li>
                <Link href="/my-orders" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-fuchsia-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-fuchsia-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/checkout" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-fuchsia-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Express Checkout
                </Link>
              </li>
              <li>
                <Link href="/login" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-fuchsia-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Sign In / Register
                </Link>
              </li>
              <li>
                <a href="mailto:support@avroradazzle.com" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-fuchsia-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Email Support Helpdesk
                </a>
              </li>
              <li>
                <Link href="/refund-policy" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-cyan-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Refund & Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-cyan-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className={`transition-colors inline-flex items-center gap-1.5 group ${
                  isAvroraTheme ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-950 font-medium'
                }`}>
                  <span className={`w-1 h-1 rounded-full transition-transform group-hover:scale-150 ${
                    isAvroraTheme ? 'bg-cyan-400/50' : 'bg-slate-300 group-hover:bg-slate-900'
                  }`}></span>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Exclusive Offers (3.5 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className={`font-bold text-[13px] uppercase tracking-[0.18em] font-cinzel ${
              isAvroraTheme 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400' 
                : 'text-slate-950 font-bold'
            }`}>
              Join Our VIP Circle
            </h3>
            <p className={`text-xs leading-relaxed ${isAvroraTheme ? 'text-slate-400' : 'text-slate-600'}`}>
              Receive private invitations to preview seasonal drops, couture textiles, and VIP discount codes.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className={`flex items-center p-1 rounded-full border transition-all ${
                isAvroraTheme 
                  ? 'bg-[#090224]/90 border-cyan-500/30 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'bg-slate-50 border-slate-300 focus-within:border-slate-900 focus-within:bg-white shadow-xs'
              }`}>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address..." 
                  required
                  className={`text-xs px-4 py-2.5 outline-none flex-1 bg-transparent ${
                    isAvroraTheme 
                      ? 'text-white placeholder:text-slate-500' 
                      : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button 
                  type="submit"
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
                    isAvroraTheme
                      ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-500 text-slate-950 font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] hover:scale-102'
                      : 'bg-slate-950 text-white hover:bg-slate-800 font-bold shadow-xs'
                  }`}
                >
                  <span>Join</span>
                  <Send size={13} />
                </button>
              </div>

              {subscribed && (
                <div className={`flex items-center gap-2 text-xs animate-fade-in pl-2 ${
                  isAvroraTheme ? 'text-emerald-400' : 'text-emerald-700 font-medium'
                }`}>
                  <Check size={14} />
                  <span>Welcome to the Avrora Dazzle circle! Check your inbox soon.</span>
                </div>
              )}
            </form>

            <div className={`flex items-center gap-3 text-xs pt-1 ${
              isAvroraTheme ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <span>Need immediate help?</span>
              <a 
                href="mailto:support@avroradazzle.com?subject=Urgent%20Inquiry" 
                className={`font-semibold underline cursor-pointer ${
                  isAvroraTheme ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-900 hover:text-black'
                }`}
              >
                Send Us an Email
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className={`border-t py-6 ${
        isAvroraTheme 
          ? 'border-cyan-500/15 bg-[#02000d] text-slate-400' 
          : 'border-slate-200 bg-slate-50 text-slate-600'
      }`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()}</span>
            <span className={`font-cinzel font-bold tracking-widest ${
              isAvroraTheme ? 'text-white' : 'text-slate-950'
            }`}>
              AVRORA DAZZLE
            </span>
            <span>· All Rights Reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <Link href="/products" className={`transition-colors ${
              isAvroraTheme ? 'hover:text-cyan-300' : 'hover:text-slate-950 font-medium'
            }`}>
              Catalog
            </Link>
            <Link href="/cart" className={`transition-colors ${
              isAvroraTheme ? 'hover:text-cyan-300' : 'hover:text-slate-950 font-medium'
            }`}>
              Cart
            </Link>
            <Link href="/my-orders" className={`transition-colors ${
              isAvroraTheme ? 'hover:text-cyan-300' : 'hover:text-slate-950 font-medium'
            }`}>
              Orders
            </Link>
            <Link href="/privacy-policy" className={`transition-colors ${
              isAvroraTheme ? 'hover:text-cyan-300' : 'hover:text-slate-950 font-medium'
            }`}>
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className={`transition-colors ${
              isAvroraTheme ? 'hover:text-cyan-300' : 'hover:text-slate-950 font-medium'
            }`}>
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className={`transition-colors ${
              isAvroraTheme ? 'hover:text-cyan-300' : 'hover:text-slate-950 font-medium'
            }`}>
              Refunds
            </Link>
            <a 
              href="mailto:support@avroradazzle.com" 
              className={`transition-colors font-semibold ${
                isAvroraTheme ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-950 hover:underline'
              }`}
            >
              support@avroradazzle.com
            </a>

            {/* In-Line Back to Top Button */}
            <button
              onClick={scrollToTop}
              className={`inline-flex items-center gap-1.5 transition-all cursor-pointer group font-medium px-3 py-1.5 rounded-full border ${
                isAvroraTheme
                  ? 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-xs'
              }`}
              title="Back to Top"
            >
              <span>Back to Top</span>
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      {/* Floating Rotating Circular "SCROLL TO TOP" Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className={`fixed bottom-6 right-6 sm:bottom-9 sm:right-9 z-50 w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full flex items-center justify-center cursor-pointer group shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in ${
            isAvroraTheme
              ? 'bg-[#07011d]/92 border border-cyan-400/50 text-cyan-300 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:text-white hover:border-cyan-300 hover:shadow-[0_0_35px_rgba(217,70,239,0.5)]'
              : 'bg-[#e8ecef] border border-slate-300 text-slate-950 shadow-[0_12px_30px_rgba(0,0,0,0.18)] hover:bg-white hover:border-slate-900'
          }`}
        >
          {/* Rotating Circular Text SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full animate-[spin_10s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite] select-none pointer-events-none"
          >
            <defs>
              <path
                id="scrollToTopCirclePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text
              fontSize="9.2"
              fontWeight="800"
              letterSpacing="2.4px"
              fill="currentColor"
              className="uppercase font-sans"
            >
              <textPath href="#scrollToTopCirclePath" startOffset="0%">
                SCROLL TO TOP • SCROLL TO TOP • 
              </textPath>
            </text>
          </svg>

          {/* Upward Center Arrow (Fixed, does not spin) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform transition-transform duration-300 ease-out group-hover:-translate-y-1.5"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </div>
        </button>
      )}
    </footer>
  );
};

export default Footer;
