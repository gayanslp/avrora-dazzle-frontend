import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

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

  return (
    <div
      className="group flex flex-col cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Image Container */}
      <div
        ref={cardRef}
        className="relative aspect-[2/3] overflow-hidden bg-slate-100 mb-3 block rounded-sm"
      >
        <Link to={`/productDetails/${id}`} className="absolute inset-0 block">
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
          <div className="absolute top-3 left-3 bg-[#e33535] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-20 tracking-wider">
            SOLD OUT
          </div>
        ) : sale ? (
          <div className="absolute top-3 left-3 bg-green-800 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-20 tracking-wider">
            SALE
          </div>
        ) : null}

        {/* Discount Tag */}
        {discount && (
          <div className="absolute bottom-3 left-3 bg-white/90 text-green-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm z-20 group-hover:opacity-0 transition-opacity duration-300">
            {discount}
          </div>
        )}

        {/* Eye Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <Link
            to={`/productDetails/${id}`}
            className="w-9 h-9 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center text-slate-900 hover:bg-white shadow-md transition-all"
            title="Quick View"
          >
            <Eye className="w-4 h-4" strokeWidth={1.8} />
          </Link>
        </div>

        {/* Dot Vertical Indicator (only shown if multiple images exist) */}
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
                    ? 'w-1.5 h-3 bg-slate-900 shadow-xs'
                    : 'w-1.5 h-1 bg-slate-800/40 hover:bg-slate-900'
                }`}
              />
            ))}
          </div>
        )}

        {/* Slide-Up Size Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white px-3.5 py-2.5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex justify-between items-center border-t border-slate-100 shadow-sm">
          <span className="text-[11px] font-bold text-slate-900 tracking-wider">SIZE</span>
          <div className="flex gap-2 text-[11px] font-semibold text-slate-800">
            <span className="hover:text-cyan-600 transition-colors">UK 04</span>
            <span className="hover:text-cyan-600 transition-colors">UK 06</span>
            <span className="hover:text-cyan-600 transition-colors">UK 08</span>
            <span className="hover:text-cyan-600 transition-colors">UK 10</span>
            <span className="text-slate-500 ml-0.5 whitespace-nowrap">+more</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col px-1">
        <div className="flex justify-between items-start gap-3 mb-1.5">
          <Link
            to={`/productDetails/${id}`}
            className="text-[13px] font-medium text-slate-800 hover:text-slate-900 transition-colors leading-relaxed line-clamp-1 max-w-[70%]"
          >
            {name}
          </Link>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap">
              {currency}{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            {originalPrice && (
              <span className="text-[10px] font-semibold text-slate-400 line-through mt-0.5">
                {currency}{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches (Displaying the actual product images, up to 5) */}
        {displayImages.length > 1 && (
          <div className="flex gap-1.5 mt-0.5">
            {displayImages.slice(0, 5).map((img, i) => (
              <div
                key={i}
                onMouseEnter={() => setCurrentIndex(i)}
                onClick={() => setCurrentIndex(i)}
                className={`w-4 h-4 rounded-full border overflow-hidden cursor-pointer transition-all ${
                  currentIndex === i ? 'border-slate-900 scale-110 shadow-xs' : 'border-slate-300 hover:border-slate-600'
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