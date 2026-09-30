import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/productApi';
import { ShoppingBag, Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const collections = [
  {
    title: "AVRORA DAZZLE",
    description: "Shop Avrora Dazzle — Premium Women's Clothing and Designer Dresses crafted to empower and inspire.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "SCYLLA ZELUS",
    description: "Crafted for those who dare to stand out — Scylla Zelus defines confidence in motion.",
    image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "REDVERS BULLER",
    description: "Inspired by heritage, tailored for today — the Redvers Buller Men's Collection defines refined strength.",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "EIGHTY%",
    description: "EIGHTY% — Redefining Women's Fashion with Luxurious Dresses Made to Impress.",
    image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=800",
  }
];

const ProductCard = ({ product }) => (
  <div className="group flex flex-col cursor-pointer">
    <Link to={`/productDetails/${product._id}`} className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-3 block">
      <img
        src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600'}
        alt={product.name}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      
      {/* Secondary image on hover (if available) */}
      {product.images && product.images.length > 1 && (
        <img
          src={product.images[1]}
          alt={`${product.name} alternate`}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
        />
      )}

      {/* Badges (Sold Out / Sale) */}
      {(product.stock === 0 || product.soldOut) ? (
        <div className="absolute top-3 left-3 bg-[#e33535] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10 tracking-wider">
          SOLD OUT
        </div>
      ) : product.sale && (
        <div className="absolute top-3 left-3 bg-green-800 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10 tracking-wider">
          SALE
        </div>
      )}

      {/* Discount Tag */}
      {product.discount && (
        <div className="absolute bottom-3 left-3 bg-white/90 text-green-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 group-hover:opacity-0 transition-opacity duration-300">
          {product.discount}
        </div>
      )}

      {/* Eye Icon */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-gray-50 shadow-sm transition-colors">
          <Eye className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
        <div className="w-1.5 h-3.5 rounded-full bg-slate-900"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
      </div>

      {/* Size Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 flex justify-between items-center border border-gray-200">
        <span className="text-[12px] font-bold text-slate-900">SIZE</span>
        <div className="flex gap-3 text-[12px] font-semibold text-slate-900">
          <span className="hover:text-slate-500 transition-colors">UK 04</span>
          <span className="hover:text-slate-500 transition-colors">UK 06</span>
          <span className="hover:text-slate-500 transition-colors">UK 08</span>
          <span className="hover:text-slate-500 transition-colors">UK 10</span>
          <span className="hover:text-slate-500 transition-colors">UK 12</span>
          <span className="text-slate-600 ml-1 whitespace-nowrap">1 more</span>
        </div>
      </div>
    </Link>

    <div className="flex flex-col px-1">
      <div className="flex justify-between items-start gap-4 mb-2">
        <Link to={`/productDetails/${product._id}`} className="text-[13px] font-medium text-slate-800 hover:text-slate-900 transition-colors leading-relaxed max-w-[70%]">
          {product.name}
        </Link>
        <div className="flex flex-col items-end">
          <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap pt-0.5">
            {product.currency || 'Rs '}{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] font-semibold text-slate-400 line-through mt-0.5">
              {product.currency || 'Rs '}{product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
      
      {/* Color Swatches */}
      <div className="flex gap-1.5 mt-0.5">
        <div className="w-[18px] h-[18px] rounded-full border border-slate-300 overflow-hidden cursor-pointer hover:border-slate-500 transition-colors">
          <img src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600'} alt="swatch 1" className="w-full h-full object-cover" />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="w-[18px] h-[18px] rounded-full border border-slate-300 overflow-hidden cursor-pointer hover:border-slate-500 transition-colors">
            <img src={product.images[1]} alt="swatch 2" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock products exactly matching the design for the New Arrivals section
  const mockProducts = [
    {
      _id: 'mock-1',
      name: 'Contour Seam Denim Corset Top',
      price: 4990,
      currency: 'Rs ',
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600'
      ]
    },
    {
      _id: 'mock-2',
      name: 'Nova Bubble Mini',
      price: 7150,
      currency: 'Rs ',
      images: [
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1515347619362-6713e2f5f1a5?auto=format&fit=crop&q=80&w=600'
      ]
    },
    {
      _id: 'mock-3',
      name: 'Clara Check Midi',
      price: 8190,
      currency: 'Rs ',
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=600'
      ]
    },
    {
      _id: 'mock-4',
      name: 'Isla Tiered Midi',
      price: 9490,
      currency: 'Rs ',
      images: [
        'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600'
      ]
    }
  ];

  const mockAccessories = [
    {
      _id: 'mock-acc-1',
      name: 'Siena Drape Earrings',
      price: 1750,
      currency: 'Rs ',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1582213797685-69bc3df874bb?auto=format&fit=crop&q=80&w=600'
      ]
    },
    {
      _id: 'mock-acc-2',
      name: 'Nova Gleam Earrings',
      price: 1900,
      currency: 'Rs ',
      images: [
        'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=600'
      ]
    },
    {
      _id: 'mock-acc-3',
      name: 'Vlona Necklace',
      price: 3500,
      currency: 'Rs ',
      images: [
        'https://images.unsplash.com/photo-1599643478524-fb66f70a0066?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600'
      ]
    },
    {
      _id: 'mock-acc-4',
      name: 'Celeste Necklace',
      price: 3500,
      currency: 'Rs ',
      images: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1599643478524-fb66f70a0066?auto=format&fit=crop&q=80&w=600'
      ]
    }
  ];

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
              className="w-full h-full object-cover object-top"
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
                <span className="font-thin"> DAZZLE</span>
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

      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16">

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl md:text-2xl font-light tracking-widest text-slate-900 uppercase">
            NEW ARRIVALS
          </h2>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {(products.length > 0 ? products.slice(0, 4) : mockProducts).map((product) => (
                <ProductCard key={'new-arr-' + product._id} product={product} />
              ))}
            </div>
            
            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                VIEW ALL <span className="text-[10px]">●</span>
              </Link>
            </div>
          </>
        )}

      </div>

      {/* Brands / Collections Grid Section */}
      <div className="w-full flex flex-col md:flex-row h-auto md:h-[600px] lg:h-[750px] overflow-hidden bg-slate-950">
        {collections.map((col, index) => (
          <div key={index} className="relative group w-full md:w-1/4 h-[400px] md:h-full overflow-hidden cursor-pointer">
            <img 
              src={col.image} 
              alt={col.title} 
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
            />
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            
            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col items-center justify-end text-center h-full">
              <h3 className="text-white text-xl md:text-2xl font-normal tracking-wide mb-1 group-hover:-translate-y-1 transition-transform duration-500">
                {col.title}
              </h3>
              
              {/* Expandable description on hover */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out w-full">
                <div className="overflow-hidden">
                  <p className="text-white/90 text-sm md:text-[15px] font-medium leading-relaxed max-w-xs mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 pb-2 mt-2">
                    {col.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Promotional Banner Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden mt-8">
        <img 
          src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=2000" 
          alt="Avrora Dazzle Promotional Banner" 
          className="w-full h-full object-cover object-center" 
        />
        
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Text */}
        <div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16 lg:pr-32">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-widest drop-shadow-md">
            AVRORA DAZZLE
          </h2>
        </div>
        
        {/* Button */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 lg:bottom-16 lg:right-32">
          <Link 
            to="/products" 
            className="bg-white text-slate-900 px-6 py-2.5 md:px-8 md:py-3.5 rounded-full text-xs md:text-sm font-bold tracking-wider hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            SHOP NOW <span className="text-[10px]">●</span>
          </Link>
        </div>
      </div>
      
      {/* BEST SELLERS SECTION */}
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl md:text-2xl font-light tracking-widest text-slate-900 uppercase">
            BEST SELLERS
          </h2>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {(products.length > 0 ? products.slice(4, 8) : mockProducts).map((product) => (
                <ProductCard key={'best-sel-' + product._id} product={product} />
              ))}
            </div>
            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                VIEW ALL <span className="text-[10px]">●</span>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Second Promotional Banner */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-[#eef0f2]">
        {/* Left Model */}
        <div className="absolute left-0 bottom-0 h-full w-1/2 md:w-1/3 max-w-[500px]">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" alt="Model Left" className="w-full h-full object-cover object-top mix-blend-multiply opacity-90" />
        </div>
        
        {/* Right Model */}
        <div className="absolute right-0 bottom-0 h-full w-1/2 md:w-1/3 max-w-[500px]">
          <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800" alt="Model Right" className="w-full h-full object-cover object-top mix-blend-multiply opacity-90" />
        </div>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-widest text-center px-4">
            AVRORA DAZZLE
          </h2>
        </div>
        
        {/* Button */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 lg:bottom-16 lg:right-32">
          <Link 
            to="/products" 
            className="bg-white text-slate-900 px-6 py-2.5 md:px-8 md:py-3.5 rounded-full text-xs md:text-sm font-bold tracking-wider hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-sm border border-slate-200"
          >
            SHOP NOW <span className="text-[10px]">●</span>
          </Link>
        </div>
      </div>

      {/* WORKWEAR SECTION */}
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl md:text-2xl font-light tracking-widest text-slate-900 uppercase">
            WORKWEAR
          </h2>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {(products.length > 0 ? products.slice(8, 12) : mockProducts.map((p, i) => i === 1 ? { ...p, soldOut: true } : p)).map((product) => (
                <ProductCard key={'workwear-' + product._id} product={product} />
              ))}
            </div>
            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                VIEW ALL <span className="text-[10px]">●</span>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* UPTO 50% OFF SECTION */}
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl md:text-2xl font-light tracking-widest text-slate-900 uppercase">
            UPTO 50% OFF
          </h2>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {(products.length > 0 ? products.slice(12, 16) : mockProducts.map(p => ({
                ...p,
                sale: true,
                discount: '50% OFF',
                originalPrice: p.price * 2
              }))).map((product) => (
                <ProductCard key={'sale-' + product._id} product={product} />
              ))}
            </div>
            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                VIEW ALL <span className="text-[10px]">●</span>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Third Promotional Banner - AVRORA DAZZLE */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] overflow-hidden bg-gradient-to-r from-[#7a5843] via-[#946e54] to-[#a37c62]">
        
        {/* Model Image on the right */}
        <div className="absolute right-0 bottom-0 h-[100%] w-[70%] lg:w-[45%] flex justify-end">
          <img 
            src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800" 
            alt="Avrora Dazzle Model" 
            className="w-full h-full object-cover object-left mix-blend-multiply opacity-90"
          />
        </div>

        {/* Text (Positioned to match image) */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[55%] flex items-center justify-center lg:justify-start lg:pl-[12%] z-10 pointer-events-none">
          <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-extrabold text-white tracking-wide drop-shadow-sm whitespace-nowrap">
            AVRORA DAZZLE
          </h2>
        </div>

        {/* Scroll to top */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-6 left-4 md:bottom-8 md:left-8 lg:bottom-12 lg:left-12 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors cursor-pointer group z-20"
          aria-label="Scroll to top"
        >
          {/* Circular Text SVG */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] group-hover:animate-none" viewBox="0 0 100 100">
            <path id="curve" d="M 50 15 A 35 35 0 1 1 49.9 15" fill="transparent" />
            <text className="text-[10.5px] font-bold tracking-[0.18em] uppercase fill-slate-900/80">
              <textPath href="#curve">
                SCROLL TO TOP • SCROLL TO TOP • 
              </textPath>
            </text>
          </svg>
          {/* Up Arrow */}
          <svg className="w-5 h-5 text-slate-900/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </button>

        {/* Right side buttons */}
        <div className="absolute bottom-6 right-4 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12 flex items-center gap-3 z-20">
          <Link 
            to="/products" 
            className="bg-black text-white px-6 py-2.5 md:px-8 md:py-3.5 rounded-full text-xs md:text-sm font-semibold tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            SHOP NOW <span className="text-[10px]">●</span>
          </Link>
          <button className="w-10 h-10 md:w-12 md:h-12 bg-black/90 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-sm" aria-label="Chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* ACCESSORIES SECTION */}
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl md:text-2xl font-light tracking-widest text-slate-900 uppercase">
            ACCESSORIES
          </h2>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {mockAccessories.map((product) => (
                <ProductCard key={'accessories-' + product._id} product={product} />
              ))}
            </div>
            
            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link to="/products?category=accessories" className="bg-black text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                VIEW ALL <span className="text-[10px]">●</span>
              </Link>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default HomePage;