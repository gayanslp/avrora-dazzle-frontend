import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 left-4 md:bottom-8 md:left-8 lg:bottom-10 lg:left-10 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-slate-200/80 hover:bg-white transition-all duration-500 cursor-pointer group z-50 ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      {/* Circular Text SVG */}
      <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] group-hover:animate-none p-1" viewBox="0 0 100 100">
        <path id="scroll-curve" d="M 50 15 A 35 35 0 1 1 49.9 15" fill="transparent" />
        <text className="text-[10px] font-bold tracking-[0.18em] uppercase fill-slate-900">
          <textPath href="#scroll-curve">
            SCROLL TO TOP • SCROLL TO TOP • 
          </textPath>
        </text>
      </svg>
      {/* Up Arrow */}
      <svg className="w-5 h-5 text-slate-900 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    </button>
  );
};

export default ScrollToTop;
