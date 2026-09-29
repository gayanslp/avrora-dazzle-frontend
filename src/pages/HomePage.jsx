import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/productApi';
import { ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // You will replace these paths with the actual generated artifact paths or public folder paths.
  const heroSlides = [
    '/hero_slide_1.jpg',
    '/hero_slide_2.jpg',
    '/hero_slide_3.jpg',
    '/hero_slide_4.jpg'
  ];

  // Auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 second delay

    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        if (data && data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
  return (
    <div className="w-full bg-slate-50 font-sans text-slate-900">
      {/* Hero Slider Section - Full Viewport Height */}
      {/* Hero Slider Section - Adjusted Height */}
      <div className="relative w-full h-[75vh] overflow-hidden bg-slate-950">
        {/* Images Container */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <img
              src={slide}
              alt={`AVRORA DAZZLE Collection ${index + 1}`}
              className="w-full h-full object-contain object-center"
            />
          </div>
        ))}

        {/* Overlay for text readability with Avrora Gradient tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-900/20 to-transparent z-10 pointer-events-none"></div>

        {/* Large Text Overlay (Left Aligned like Kelly Felder) */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
            <h1 className="text-5xl md:text-4xl lg:text-5xl text-white tracking-tight whitespace-nowrap">
                <span className="font-extrabold ">AVRORA </span>
                <span className="font-thin -ml-4"> DAZZLE</span>
            </h1>
          </div>
        </div>

        {/* Slide Indicators (Dots) at Bottom Right */}
        <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${currentSlide === index
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-4 flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-cyan-400" />
            New Arrivals
            <Star className="w-6 h-6 text-cyan-400" />
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
            Discover our latest collection of premium clothing, designed for elegance and comfort.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                to={`/productDetails/${product._id}`}
                key={product._id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-cyan-500/20">
                      View Details
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between bg-white group-hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-cyan-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-sky-500 uppercase tracking-wider font-medium mb-3">
                      {product.colorLabel}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-900">
                      {product.currency || 'Rs '}{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center transition-all">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;