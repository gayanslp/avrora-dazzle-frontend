'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const WhatsAppButton = () => {
  const { isAvroraTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  // Business WhatsApp number for Avrora Dazzle Textiles, Kadawatha
  // Pre-configured message for customer inquiries
  const whatsappNumber = '94772213263'; // Placeholder to be customized or configured in settings
  const defaultMessage = encodeURIComponent('Hello Avrora Dazzle! I have an inquiry about a product/order on your website.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      
      {/* Floating Tooltip */}
      {showTooltip && (
        <div className={`mb-2.5 p-3 rounded-2xl text-xs max-w-[220px] shadow-xl border animate-fade-in relative ${
          isAvroraTheme 
            ? 'bg-[#090220]/95 border-emerald-500/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Close tooltip"
          >
            <X size={12} />
          </button>
          <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-500 mb-0.5">Avrora Concierge</p>
          <p className="text-[11px] leading-relaxed">Need help with sizing or orders? Chat with us on WhatsApp!</p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className={`group relative flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3 rounded-full transition-all duration-300 shadow-xl cursor-pointer ${
          isAvroraTheme
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:scale-105 border border-emerald-300/40'
            : 'bg-[#25D366] text-white hover:bg-[#20ba5a] hover:scale-105 shadow-emerald-500/25'
        }`}
        aria-label="Contact Customer Care on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* Pulsing Signal Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>

        <MessageCircle size={22} className="shrink-0" />
        <span className="hidden sm:inline-block text-xs font-bold tracking-wide">
          WhatsApp Us
        </span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
