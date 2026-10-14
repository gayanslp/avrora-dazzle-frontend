'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Helper to extract the product images (up to 10 max), showing ONLY what was added by admin
const getProductImages = (item) => {
  const images = Array.isArray(item.images) && item.images.length > 0
    ? item.images.filter(img => typeof img === 'string' && img.trim() !== '')
    : item.image ? [item.image] : [];

  if (images.length > 0) {
    return images.slice(0, 10);
  }

  // Fallback single placeholder only if product has NO images at all:
  return ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'];
};

// ─── Interactive Product Card with Sub-Related Images ──────────────────────
const ProductCard = ({ product, ...restProps }) => {
  const item = product || restProps;
  const displayImages = getProductImages(item);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  const cardRef = useRef(null);

  // Automatic slideshow scroll on mouse hover across all 10 images
  useEffect(() => {
    if (isHovered && displayImages.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length);
      }, 950); // Smooth scroll transition every 0.95 seconds
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isHovered, displayImages.length]);

  // Scrub / Scroll through images as cursor moves horizontally across card
  const handleMouseMove = (e) => {
    if (!cardRef.current || displayImages.length <= 1) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (width > 0) {
      const targetIndex = Math.min(
        displayImages.length - 1,
        Math.max(0, Math.floor((x / width) * displayImages.length))
      );
      if (targetIndex !== currentIndex) {
        setCurrentIndex(targetIndex);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentIndex(0); // Reset back to primary cover image
  };

  const id = item._id || item.id || 'prod';
  const name = item.name || 'Avrora Dazzle Product';
  const price = item.price || 0;
  const currency = item.currency || 'Rs ';
  const originalPrice = item.originalPrice;
  const stock = item.stock;
  const soldOut = item.soldOut;
  const sale = item.sale;
  const discount = item.discount;

  const { isAvroraTheme } = useTheme();

  return (
    <div
      className={`group flex flex-col cursor-pointer select-none font-didot reveal-on-scroll reveal-card md:transition-transform md:duration-300 ${
        isAvroraTheme ? 'md:hover:-translate-y-1' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Image Container */}
      <div
        ref={cardRef}
        className={`relative aspect-[2/3] overflow-hidden mb-3 block transition-all duration-500 ${
          isAvroraTheme
            ? 'bg-slate-900/40 backdrop-blur-md rounded-xl border border-cyan-500/20 group-hover:border-cyan-400/50 group-hover:shadow-[0_12px_30px_rgba(6,182,212,0.25),0_0_15px_rgba(217,70,239,0.2)]'
            : 'bg-slate-100 rounded-sm border border-slate-100/80 group-hover:shadow-sm'
        }`}
      >
        <Link href={`/productDetails/${id}`} className="absolute inset-0 block">
          {displayImages.map((imgSrc, idx) => (
            <img
              key={idx}
              src={imgSrc}
              alt={`${name} angle ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
                currentIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
          ))}
        </Link>

        {/* Badges (Sold Out / Sale) */}
        {(stock === 0 || soldOut) ? (
          <div className={`absolute top-3 left-3 text-white text-[10px] font-bold px-3 py-1 rounded-full z-20 tracking-wider shadow-sm ${
            isAvroraTheme 
              ? 'bg-rose-600/90 backdrop-blur-md border border-rose-400/40 shadow-lg' 
              : 'bg-[#e33535]'
          }`}>
            SOLD OUT
          </div>
        ) : sale ? (
          <div className={`absolute top-3 left-3 text-white text-[10px] font-bold px-3 py-1 rounded-full z-20 tracking-wider shadow-sm ${
            isAvroraTheme 
              ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 border border-white/20 animate-pulse shadow-lg' 
              : 'bg-green-800'
          }`}>
            SALE
          </div>
        ) : null}

        {/* Discount Tag */}
        {discount && (
          <div className={`absolute bottom-3 left-3 text-[10px] font-bold px-2 py-1 rounded shadow-sm z-20 group-hover:opacity-0 transition-opacity duration-300 ${
            isAvroraTheme 
              ? 'bg-[#0a0520]/85 backdrop-blur-md text-cyan-300 border border-cyan-500/30' 
              : 'bg-white/90 text-green-700'
          }`}>
            {discount}
          </div>
        )}

        {/* Eye Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <Link
            href={`/productDetails/${id}`}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
              isAvroraTheme
                ? 'bg-[#0b0422]/90 backdrop-blur-md border border-cyan-400/40 text-cyan-300 hover:text-white hover:bg-cyan-500'
                : 'bg-white/90 backdrop-blur-xs text-slate-900 hover:bg-white'
            }`}
            title="Quick View"
          >
            <Eye className="w-4 h-4" strokeWidth={1.8} />
          </Link>
        </div>

        {/* Dot Vertical Indicator */}
        {displayImages.length > 1 && (
          <div className="absolute top-1/2 right-2.5 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                onMouseEnter={() => setCurrentIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? (isAvroraTheme ? 'w-1.5 h-3.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'w-1.5 h-3 bg-slate-900')
                    : (isAvroraTheme ? 'w-1.5 h-1.5 bg-white/40 hover:bg-white' : 'w-1.5 h-1 bg-slate-800/40 hover:bg-slate-900')
                }`}
              />
            ))}
          </div>
        )}

        {/* Slide-Up Size Bar (Desktop Hover) */}
        <div className={`hidden sm:flex absolute bottom-0 left-0 right-0 px-3.5 py-2.5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 justify-between items-center shadow-sm ${
          isAvroraTheme
            ? 'bg-[#09031f]/95 backdrop-blur-xl border-t border-cyan-500/30 text-slate-200'
            : 'bg-white border-t border-slate-100 text-slate-800'
        }`}>
          <span className={`text-[11px] font-bold tracking-wider ${isAvroraTheme ? 'text-cyan-300' : 'text-slate-900'}`}>
            SIZE
          </span>
          <div className="flex gap-2 text-[11px] font-semibold">
            <span className={isAvroraTheme ? 'hover:text-cyan-400 transition-colors' : 'hover:text-cyan-600 transition-colors'}>UK 04</span>
            <span className={isAvroraTheme ? 'hover:text-cyan-400 transition-colors' : 'hover:text-cyan-600 transition-colors'}>UK 06</span>
            <span className={isAvroraTheme ? 'hover:text-cyan-400 transition-colors' : 'hover:text-cyan-600 transition-colors'}>UK 08</span>
            <span className={isAvroraTheme ? 'hover:text-cyan-400 transition-colors' : 'hover:text-cyan-600 transition-colors'}>UK 10</span>
            <span className={`${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'} ml-0.5 whitespace-nowrap`}>+more</span>
          </div>
        </div>
      </div>

      {/* Info Section (Clean 2-Column Mobile Ergonomics) */}
      <div className="flex flex-col px-0.5 sm:px-1">
        <Link
          href={`/productDetails/${id}`}
          className={`font-display text-[12.5px] sm:text-[14px] font-medium tracking-tight transition-colors leading-snug line-clamp-1 mb-1 block ${
            isAvroraTheme ? 'text-slate-100 hover:text-cyan-300' : 'text-slate-800 hover:text-slate-900'
          }`}
          title={name}
        >
          {name}
        </Link>
        <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap mb-1">
          <span className={`text-[12.5px] sm:text-[13.5px] font-bold whitespace-nowrap ${
            isAvroraTheme ? 'text-cyan-300 drop-shadow-xs' : 'text-slate-900'
          }`}>
            {currency}{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          {originalPrice && (
            <span className="text-[10px] sm:text-[11px] font-normal text-slate-400 line-through">
              {currency}{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        {displayImages.length > 1 && (
          <div className="flex gap-1.5 mt-0.5">
            {displayImages.slice(0, 5).map((img, i) => (
              <div
                key={i}
                onMouseEnter={() => setCurrentIndex(i)}
                onClick={() => setCurrentIndex(i)}
                className={`w-4 h-4 rounded-full border overflow-hidden cursor-pointer transition-all ${
                  currentIndex === i
                    ? (isAvroraTheme ? 'border-cyan-400 scale-110 shadow-[0_0_8px_rgba(6,182,212,0.7)]' : 'border-slate-900 scale-110 shadow-xs')
                    : (isAvroraTheme ? 'border-white/30 hover:border-cyan-300' : 'border-slate-300 hover:border-slate-600')
                }`}
              >
                <img src={img} alt={`swatch ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;