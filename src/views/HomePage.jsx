'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchProducts } from '../api/productApi';
import axiosInstance from '../api/axiosInstance';
import { ShoppingBag, Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useTheme } from '../context/ThemeContext';

const collections = [
  {
    title: "AVRORA DAZZLE",
    subtitle: "LADIES WEAR",
    description: "Shop Avrora Dazzle — Premium Women's Clothing and Designer Dresses crafted to empower and inspire.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    link: "/products/ladies-wear"
  },
  {
    title: "SCYLLA ZELUS",
    subtitle: "ACCESSORIES",
    description: "Crafted for those who dare to stand out — Scylla Zelus defines confidence in motion.",
    image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&q=80&w=800",
    link: "/products/accessories"
  },
  {
    title: "REDVERS BULLER",
    subtitle: "GENTS WEAR",
    description: "Inspired by heritage, tailored for today — the Redvers Buller Men's Collection defines refined strength.",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800",
    link: "/products/gents-wear"
  },
  {
    title: "EIGHTY%",
    subtitle: "EVENING WEAR",
    description: "EIGHTY% — Redefining Women's Fashion with Luxurious Dresses Made to Impress.",
    image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=800",
    link: "/products/evening-wear"
  },
  {
    title: "BRIDAL COUTURE",
    subtitle: "BRIDAL WEAR",
    description: "Enchanting wedding gowns, delicate veils & bespoke bridal attire crafted for your special day.",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=800",
    link: "/products/bridal-wear"
  },
  {
    title: "ACTIVE & ATHLEISURE",
    subtitle: "GYM & ACTIVEWEAR",
    description: "Engineered performance wear, seamless leggings & athletic sets built to move.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
    link: "/products/gym-activewear"
  },
  {
    title: "KIDS WEAR",
    subtitle: "BOYS & GIRLS",
    description: "Playful, comfortable & charming styles made with premium fabrics for your little ones.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800",
    link: "/products/kids-wear"
  },
  {
    title: "FOOTWEAR EDIT",
    subtitle: "SHOES & HEELS",
    description: "Step into luxury with artisanal leather shoes, stylish heels & contemporary footwear.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
    link: "/products/footwear"
  }
];

const HomePage = () => {
  const { isAvroraTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Fallback Luxury Hero Banner Slides
  const DEFAULT_HERO_SLIDES = [
    {
      id: 1,
      image: '/hero_slide_gents_1.jpg',
      category: 'GENTS BESPOKE TAILORING',
      tagline: 'Tailored Luxury & Modern Sartorial Elegance',
      buttonText: 'Shop Gents Wear',
      link: '/products/mens'
    },
    {
      id: 2,
      image: '/hero_slide_women_1.jpg',
      category: 'LADIES HAUTE COUTURE',
      tagline: 'Effortless Silhouettes & Contemporary Grace',
      buttonText: 'Shop Women Wear',
      link: '/products/women'
    },
    {
      id: 3,
      image: '/hero_slide_gents_2.jpg',
      category: 'GENTS SMART CASUAL',
      tagline: 'Contemporary Knitwear & Tailored Trousers',
      buttonText: "Explore Men's Edit",
      link: '/products/mens'
    },
    {
      id: 4,
      image: '/hero_slide_women_2.jpg',
      category: 'LADIES URBAN CHIC',
      tagline: 'Modern Denim & Premium Casual Luxury',
      buttonText: 'Shop Women Wear',
      link: '/products/women'
    },
    {
      id: 5,
      image: '/hero_slide_gents_3.jpg',
      category: 'GENTS URBAN BESPOKE',
      tagline: 'Signature Overcoats & Elevated Masculine Style',
      buttonText: "Explore Men's Edit",
      link: '/products/mens'
    }
  ];

  const [heroSlides, setHeroSlides] = useState(DEFAULT_HERO_SLIDES);

  // Dynamic slides fetch from settings API
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const res = await axiosInstance.get('/settings/hero-slides');
        if (res.data?.slides && Array.isArray(res.data.slides)) {
          const active = res.data.slides.filter((s) => s.isActive !== false);
          if (active.length > 0) {
            setHeroSlides(active);
          }
        }
      } catch (err) {
        console.error('Failed to load hero slides from backend, using defaults:', err);
      }
    };
    fetchHeroSlides();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 second delay

    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (data && data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to load products from database:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Refs for each section's product carousel
  const newArrivalsRef = useRef(null);
  const bestSellersRef = useRef(null);
  const workwearRef = useRef(null);
  const saleRef = useRef(null);
  const accessoriesRef = useRef(null);

  // Smooth scroll handler with auto-looping on reaching bounds
  const handleScroll = (ref, direction) => {
    if (!ref.current) return;
    const container = ref.current;
    const scrollAmount = container.clientWidth;

    if (direction === 'left') {
      if (container.scrollLeft <= 20) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    } else {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 25) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Dynamic slices from MongoDB products (up to 16 items each so carousel has items to slide through)
  const newArrivals = products.slice(0, 16);
  const bestSellers = products.slice(16, 32);
  
  const workwearProducts = products.filter(p => {
    const subName = (p.subCategory?.name || p.subCategory?.slug || '').toLowerCase();
    const catSlug = (p.category?.slug || '').toLowerCase();
    return subName.includes('shirt') || subName.includes('blazer') || subName.includes('trouser') || subName.includes('pant') || subName.includes('suit') || catSlug === 'mens';
  });
  const workwearSlice = workwearProducts.length >= 4 
    ? workwearProducts.slice(0, 16) 
    : products.slice(32, 48);

  const saleProducts = products.filter(p => p.sale || (p.discount && p.discount > 0));
  const saleSlice = saleProducts.length >= 4 
    ? saleProducts.slice(0, 16) 
    : products.slice(48, 64);

  const accessoryProducts = products.filter(p => {
    const catSlug = (p.category?.slug || '').toLowerCase();
    const catName = (p.category?.name || '').toLowerCase();
    const subSlug = (p.subCategory?.slug || '').toLowerCase();
    return catSlug === 'accessories' || catSlug.includes('access') || catName.includes('access') || catSlug.includes('fancy') || subSlug.includes('jewel') || subSlug.includes('bag') || subSlug.includes('cap') || subSlug.includes('belt') || subSlug.includes('glass');
  });
  const accessorySlice = accessoryProducts.length >= 4 
    ? accessoryProducts.slice(0, 16) 
    : products.slice(64, 80);

  const safeIndex = currentSlide < heroSlides.length ? currentSlide : 0;
  const currentHero = heroSlides[safeIndex] || heroSlides[0] || DEFAULT_HERO_SLIDES[0];

  return (
    <div className={`w-full font-didot transition-colors duration-300 ${
      isAvroraTheme ? 'bg-transparent text-slate-100' : 'bg-white text-slate-900'
    }`}>
      {/* Studio Editorial Hero Slider */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[82vh] lg:h-[88vh] overflow-hidden bg-slate-950 group">
        {/* Images Container */}
        {heroSlides.map((slide, index) => {
          const isActive = safeIndex === index;
          return (
            <div
              key={slide._id || slide.id || index}
              className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
                isActive
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.category || 'Avrora Dazzle Editorial Campaign'}
                className="w-full h-full object-cover object-center sm:object-top"
              />
            </div>
          );
        })}

        {/* Soft overlay gradient for text legibility while keeping the model visible */}
        <div className={`absolute inset-0 z-10 pointer-events-none ${
          isAvroraTheme
            ? 'bg-gradient-to-r from-[#040114]/85 via-[#0a0325]/45 to-transparent'
            : 'bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent'
        }`}></div>

        {/* Large Text Overlay (Category Pill, Brand Title, Tagline & Action Button) */}
        <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
            
            {/* Active Slide Category Pill */}
            <div className="inline-flex items-center gap-2 mb-3.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-black/40 backdrop-blur-md border border-white/20 text-white/95 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${
                (currentHero.category || '').toUpperCase().includes('GENTS') || (currentHero.category || '').toUpperCase().includes('MEN')
                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-pulse' 
                  : 'bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.9)] animate-pulse'
              }`}></span>
              <span>{currentHero.category || 'EXCLUSIVE COLLECTION'}</span>
            </div>

            {/* Brand Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase font-cinzel tracking-[0.14em]">
              <span className={
                isAvroraTheme
                  ? "font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                  : "font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              }>
                AVRORA{' '}
              </span>
              <span className={isAvroraTheme ? "font-light text-white drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]" : "font-light text-white"}>
                DAZZLE
              </span>
            </h1>

            {/* Subtitle / Tagline */}
            <p className="mt-3.5 text-white/90 text-xs sm:text-sm md:text-base font-display font-light tracking-[0.25em] uppercase max-w-lg transition-all duration-500">
              {currentHero.tagline}
            </p>

            {/* Direct Collection Link CTA Button */}
            <div className="mt-6 flex items-center gap-4 pointer-events-auto">
              <Link
                href={currentHero.link || '/products'}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-widest uppercase transition-all duration-300 group cursor-pointer shadow-lg ${
                  isAvroraTheme
                    ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'bg-white text-slate-950 hover:bg-slate-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                }`}
              >
                <span>{currentHero.buttonText || 'Shop Collection'}</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle Prev / Next Navigation Arrows on hover */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev <= 0 ? heroSlides.length - 1 : prev - 1))}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center cursor-pointer shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev >= heroSlides.length - 1 ? 0 : prev + 1))}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center cursor-pointer shadow-md"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators (Dots) at Bottom Right matching reference image style */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-12 z-20 flex items-center space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                safeIndex === index
                  ? 'w-7 sm:w-9 h-2 bg-white shadow-md'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/90'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 pt-12 md:pt-16 pb-16">

        <div className="flex justify-between items-center mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-6 rounded-full ${
              isAvroraTheme 
                ? 'bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_8px_rgba(6,182,212,0.7)]' 
                : 'bg-slate-900'
            }`} />
            <h2 className={`text-2xl md:text-3xl font-normal tracking-widest uppercase font-didot ${
              isAvroraTheme ? 'text-white' : 'text-slate-900'
            }`}>
              NEW ARRIVALS
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleScroll(newArrivalsRef, 'left')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Previous new arrivals"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll(newArrivalsRef, 'right')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Next new arrivals"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isAvroraTheme ? 'border-cyan-400' : 'border-slate-900'}`}></div>
          </div>
        ) : (
          <>
            <div 
              ref={newArrivalsRef}
              className="flex overflow-x-auto scroll-smooth no-scrollbar gap-6 lg:gap-8 pt-2 pb-4 snap-x snap-mandatory"
            >
              {newArrivals.map((product) => (
                <div 
                  key={'new-arr-' + product._id}
                  className="w-[82%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link 
                href="/products" 
                className={`px-9 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 font-didot cursor-pointer ${
                  isAvroraTheme
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-500 text-white border border-white/20 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105'
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                VIEW ALL <span className={`text-[10px] ${isAvroraTheme ? 'text-cyan-200' : 'text-slate-400'}`}>●</span>
              </Link>
            </div>
          </>
        )}

      </div>


      {/* Brands / Collections Grid Section - 8 Interactive Cards (2 Rows of 4) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 overflow-hidden bg-slate-950">
        {collections.map((col, index) => (
          <Link
            href={col.link}
            key={index}
            className="relative group w-full h-[450px] sm:h-[480px] lg:h-[580px] overflow-hidden block cursor-pointer border-b sm:border-r border-white/10"
          >
            <img
              src={col.image}
              alt={col.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-65 group-hover:opacity-85 transition-opacity duration-500"></div>

            {/* Subtle Top Category Tag */}
            {col.subtitle && (
              <div className="absolute top-6 left-6 z-10">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-cyan-300 bg-[#060217]/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  {col.subtitle}
                </span>
              </div>
            )}

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col items-center justify-end text-center h-full z-10">
              <h3 className="text-white text-xl sm:text-2xl font-normal tracking-widest mb-1 group-hover:-translate-y-1 transition-transform duration-500 uppercase font-didot drop-shadow-md">
                {col.title}
              </h3>

              {/* Expandable description on hover */}
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out w-full">
                <div className="overflow-hidden">
                  <p className="text-white/85 text-xs sm:text-[13px] font-medium leading-relaxed max-w-xs mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 pb-1 mt-2 font-sans">
                    {col.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold tracking-widest text-cyan-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-didot">
                    EXPLORE NOW &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>
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
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-md font-cinzel tracking-[0.12em]">
            AVRORA DAZZLE
          </h2>
        </div>

        {/* Button */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 lg:bottom-16 lg:right-32">
          <Link
            href="/products"
            className="bg-white text-slate-900 px-6 py-2.5 md:px-8 md:py-3.5 rounded-full text-xs md:text-sm font-bold tracking-wider hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            SHOP NOW <span className="text-[10px]">●</span>
          </Link>
        </div>
      </div>

      {/* BEST SELLERS SECTION */}
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-6 rounded-full ${
              isAvroraTheme 
                ? 'bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_8px_rgba(6,182,212,0.7)]' 
                : 'bg-slate-900'
            }`} />
            <h2 className={`text-2xl md:text-3xl font-normal tracking-widest uppercase font-didot ${
              isAvroraTheme ? 'text-white' : 'text-slate-900'
            }`}>
              BEST SELLERS
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleScroll(bestSellersRef, 'left')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Previous best sellers"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll(bestSellersRef, 'right')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Next best sellers"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isAvroraTheme ? 'border-cyan-400' : 'border-slate-900'}`}></div>
          </div>
        ) : (
          <>
            <div 
              ref={bestSellersRef}
              className="flex overflow-x-auto scroll-smooth no-scrollbar gap-6 lg:gap-8 pt-2 pb-4 snap-x snap-mandatory"
            >
              {bestSellers.map((product) => (
                <div 
                  key={'best-sel-' + product._id}
                  className="w-[82%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link 
                href="/products" 
                className={`px-9 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 font-didot cursor-pointer ${
                  isAvroraTheme
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-500 text-white border border-white/20 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105'
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                VIEW ALL <span className={`text-[10px] ${isAvroraTheme ? 'text-cyan-200' : 'text-slate-400'}`}>●</span>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Second Promotional Banner */}
      <div className={`relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden ${
        isAvroraTheme ? 'bg-[#07021a] border-y border-cyan-500/20' : 'bg-[#eef0f2]'
      }`}>
        {/* Left Model */}
        <div className="absolute left-0 bottom-0 h-full w-1/2 md:w-1/3 max-w-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
            alt="Model Left" 
            className={`w-full h-full object-cover object-top ${isAvroraTheme ? 'opacity-70' : 'mix-blend-multiply opacity-90'}`} 
          />
        </div>

        {/* Right Model */}
        <div className="absolute right-0 bottom-0 h-full w-1/2 md:w-1/3 max-w-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=800" 
            alt="Model Right" 
            className={`w-full h-full object-cover object-top ${isAvroraTheme ? 'opacity-70' : 'mix-blend-multiply opacity-90'}`} 
          />
        </div>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 className={`text-4xl md:text-5xl lg:text-7xl font-bold text-center px-4 font-cinzel tracking-[0.14em] ${
            isAvroraTheme 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-fuchsia-300 drop-shadow-[0_0_25px_rgba(217,70,239,0.5)]' 
              : 'text-slate-900 font-extrabold'
          }`}>
            AVRORA DAZZLE
          </h2>
        </div>

        {/* Button */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 lg:bottom-16 lg:right-32">
          <Link
            href="/products"
            className={`px-7 py-3 md:px-9 md:py-3.5 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 font-didot ${
              isAvroraTheme
                ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white border border-white/20 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105'
                : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 shadow-sm'
            }`}
          >
            SHOP NOW <span className="text-[10px]">●</span>
          </Link>
        </div>
      </div>

      {/* WORKWEAR SECTION */}
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-6 rounded-full ${
              isAvroraTheme 
                ? 'bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_8px_rgba(6,182,212,0.7)]' 
                : 'bg-slate-900'
            }`} />
            <h2 className={`text-2xl md:text-3xl font-normal tracking-widest uppercase font-didot ${
              isAvroraTheme ? 'text-white' : 'text-slate-900'
            }`}>
              WORKWEAR
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleScroll(workwearRef, 'left')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Previous workwear"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll(workwearRef, 'right')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Next workwear"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isAvroraTheme ? 'border-cyan-400' : 'border-slate-900'}`}></div>
          </div>
        ) : (
          <>
            <div 
              ref={workwearRef}
              className="flex overflow-x-auto scroll-smooth no-scrollbar gap-6 lg:gap-8 pt-2 pb-4 snap-x snap-mandatory"
            >
              {workwearSlice.map((product) => (
                <div 
                  key={'workwear-' + product._id}
                  className="w-[82%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link 
                href="/products" 
                className={`px-9 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 font-didot cursor-pointer ${
                  isAvroraTheme
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-500 text-white border border-white/20 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105'
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                VIEW ALL <span className={`text-[10px] ${isAvroraTheme ? 'text-cyan-200' : 'text-slate-400'}`}>●</span>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* UPTO 50% OFF SECTION */}
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-16">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-6 rounded-full ${
              isAvroraTheme 
                ? 'bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_8px_rgba(6,182,212,0.7)]' 
                : 'bg-slate-900'
            }`} />
            <h2 className={`text-2xl md:text-3xl font-normal tracking-widest uppercase font-didot ${
              isAvroraTheme ? 'text-white' : 'text-slate-900'
            }`}>
              UPTO 50% OFF
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleScroll(saleRef, 'left')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Previous sale items"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll(saleRef, 'right')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Next sale items"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isAvroraTheme ? 'border-cyan-400' : 'border-slate-900'}`}></div>
          </div>
        ) : (
          <>
            <div 
              ref={saleRef}
              className="flex overflow-x-auto scroll-smooth no-scrollbar gap-6 lg:gap-8 pt-2 pb-4 snap-x snap-mandatory"
            >
              {saleSlice.map((product) => (
                <div 
                  key={'sale-' + product._id}
                  className="w-[82%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link 
                href="/products" 
                className={`px-9 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 font-didot cursor-pointer ${
                  isAvroraTheme
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-500 text-white border border-white/20 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105'
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                VIEW ALL <span className={`text-[10px] ${isAvroraTheme ? 'text-cyan-200' : 'text-slate-400'}`}>●</span>
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
          <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold text-white drop-shadow-sm whitespace-nowrap font-cinzel tracking-[0.12em]">
            AVRORA DAZZLE
          </h2>
        </div>

        

        {/* Right side buttons */}
        <div className="absolute bottom-6 right-4 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12 flex items-center gap-3 z-20">
          <Link
            href="/products"
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
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-6 rounded-full ${
              isAvroraTheme 
                ? 'bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_8px_rgba(6,182,212,0.7)]' 
                : 'bg-slate-900'
            }`} />
            <h2 className={`text-2xl md:text-3xl font-normal tracking-widest uppercase font-didot ${
              isAvroraTheme ? 'text-white' : 'text-slate-900'
            }`}>
              ACCESSORIES
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleScroll(accessoriesRef, 'left')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Previous accessories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleScroll(accessoriesRef, 'right')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isAvroraTheme
                  ? 'bg-[#0a0422]/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Next accessories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isAvroraTheme ? 'border-cyan-400' : 'border-slate-900'}`}></div>
          </div>
        ) : (
          <>
            <div 
              ref={accessoriesRef}
              className="flex overflow-x-auto scroll-smooth no-scrollbar gap-6 lg:gap-8 pt-2 pb-4 snap-x snap-mandatory"
            >
              {accessorySlice.map((product) => (
                <div 
                  key={'accessories-' + product._id}
                  className="w-[82%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* VIEW ALL BUTTON */}
            <div className="flex justify-center mt-12 pb-8">
              <Link 
                href="/products?category=accessories" 
                className={`px-9 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 font-didot cursor-pointer ${
                  isAvroraTheme
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-500 text-white border border-white/20 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105'
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                VIEW ALL <span className={`text-[10px] ${isAvroraTheme ? 'text-cyan-200' : 'text-slate-400'}`}>●</span>
              </Link>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default HomePage;
