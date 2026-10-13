'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShoppingBag, Heart, ChevronDown, ChevronRight,
  Check, AlertCircle, ArrowUp, Minus, Plus,
  Truck, ShieldCheck, Sparkles, Ruler, Share2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { fetchProductById } from '../api/productApi';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAvroraTheme } = useTheme();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState({
    description: true,
    shipping: false,
    fabric: false
  });
  const [toastMessage, setToastMessage] = useState('');
  const [wishlisted, setWishlisted] = useState(false);

  const imageRefs = useRef([]);
  const thumbContainerRef = useRef(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        if (data && data.success) {
          setProduct(data.product);
          if (data.product.size && data.product.size.length > 0) {
            setSelectedSize(data.product.size[0]);
          }
        } else {
            router.push('/unauthorized');
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        router.push('/unauthorized');
      } finally {
        setLoading(false);
      }
    };
    if(id) {
        loadProduct();
    }
  }, [id, router]);

  useEffect(() => {
    const handleScroll = () => {
      imageRefs.current.forEach((el, index) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveImageIndex(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  useEffect(() => {
    if (thumbContainerRef.current) {
      const container = thumbContainerRef.current;
      const thumbElements = container.children;
      if (thumbElements[activeImageIndex]) {
        const targetThumb = thumbElements[activeImageIndex];
        container.scrollTo({
          top: targetThumb.offsetTop - container.clientHeight / 2 + targetThumb.clientHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [activeImageIndex]);

  const scrollToImage = (index) => {
    setActiveImageIndex(index);
    if (imageRefs.current[index]) {
      imageRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAddToCart = () => {
    if(!product) return;

    const color = product.colorLabel || 'Standard';
    const size = selectedSize || (product.size && product.size[0]) || 'Standard';
    const variant = (product.colorLabel || selectedSize)
      ? `${color} / ${size}`
      : 'Standard';

    const newItem = {
      productId: product?._id,
      id: product?._id,
      name: product?.name || 'Product',
      variant: variant,
      price: product?.price || 0,
      currency: product?.currency || 'Rs ',
      color: color,
      size: size,
      quantity: quantity || 1,
      image: (product?.images && product.images.length > 0) ? product.images[0] : ''
    };

    addToCart(newItem);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleAccordion = (section) => {
    setAccordionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard');
      }
    } catch {
      /* user cancelled share */
    }
  };

  // ── Theme tokens ────────────────────────────────────────────────
  const t = isAvroraTheme
    ? {
        page: 'bg-transparent text-slate-100',
        muted: 'text-slate-400',
        subtle: 'text-slate-300',
        heading: 'text-white',
        panel: 'bg-[#0a0420]/70 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.08)]',
        divider: 'border-cyan-500/15',
        imageBg: 'bg-[#0c0528]/60 border border-cyan-500/15',
        thumbActive: 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] opacity-100',
        thumbIdle: 'ring-1 ring-white/10 opacity-50 hover:opacity-100 hover:ring-cyan-400/50',
        sizeActive: 'bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 border-transparent shadow-[0_0_18px_rgba(0,245,212,0.5)]',
        sizeIdle: 'border-cyan-500/25 text-slate-200 hover:border-cyan-400 hover:text-white bg-white/[0.03]',
        stepper: 'border-cyan-500/25 bg-white/[0.03]',
        stepperBtn: 'text-cyan-300 hover:bg-cyan-500/15',
        btnOutline: 'border border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/10 hover:border-cyan-300 hover:text-white',
        btnPrimary: 'bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 text-white shadow-[0_8px_30px_rgba(6,182,212,0.35)] hover:shadow-[0_10px_40px_rgba(217,70,239,0.45)]',
        iconBtn: 'border border-cyan-500/25 text-cyan-200 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10',
        chip: 'bg-white/[0.04] border border-cyan-500/20 text-slate-200',
        perk: 'bg-white/[0.03] border border-cyan-500/15',
        perkIcon: 'text-cyan-300',
        price: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-fuchsia-300',
        accent: 'text-cyan-300',
        mobileBar: 'bg-[#07021c]/90 backdrop-blur-2xl border-t border-cyan-500/20',
        spinner: 'border-cyan-400',
      }
    : {
        page: 'bg-white text-slate-900',
        muted: 'text-slate-500',
        subtle: 'text-slate-600',
        heading: 'text-slate-900',
        panel: 'bg-white border border-slate-200/80 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)]',
        divider: 'border-slate-200',
        imageBg: 'bg-slate-100',
        thumbActive: 'ring-2 ring-slate-900 opacity-100',
        thumbIdle: 'ring-1 ring-slate-200 opacity-60 hover:opacity-100 hover:ring-slate-400',
        sizeActive: 'bg-slate-900 text-white border-slate-900 shadow-md',
        sizeIdle: 'border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900 bg-white',
        stepper: 'border-slate-200 bg-white',
        stepperBtn: 'text-slate-600 hover:bg-slate-100',
        btnOutline: 'border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white',
        btnPrimary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20',
        iconBtn: 'border border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900',
        chip: 'bg-slate-50 border border-slate-200 text-slate-700',
        perk: 'bg-slate-50 border border-slate-100',
        perkIcon: 'text-slate-900',
        price: 'text-slate-900',
        accent: 'text-cyan-600',
        mobileBar: 'bg-white/90 backdrop-blur-xl border-t border-slate-200',
        spinner: 'border-slate-900',
      };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${t.page}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-2 border-transparent border-b-2 ${t.spinner}`}></div>
        <p className={`text-xs tracking-[0.3em] uppercase ${t.muted}`}>Loading piece</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${t.page}`}>
        <h2 className="text-xl font-display">Product Not Found</h2>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currency = product.currency || 'Rs ';
  const formatPrice = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const stock = typeof product.countInStock === 'number' ? product.countInStock
              : typeof product.stock === 'number' ? product.stock : null;
  const soldOut = stock === 0;
  const lowStock = stock !== null && stock > 0 && stock < 5;

  const categoryName = typeof product.category === 'object' ? product.category?.name : null;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className={`min-h-screen font-sans antialiased pb-28 lg:pb-16 ${t.page}`}>

      {/* ── Toast ─────────────────────────────────────────────── */}
      {toastMessage && (
        <div className={`fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-sm flex items-center gap-2.5 animate-slide-down ${
          isAvroraTheme
            ? 'bg-[#0b0425]/95 border border-cyan-400/40 text-white backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.35)]'
            : 'bg-slate-900 text-white shadow-2xl'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center ${isAvroraTheme ? 'bg-cyan-400 text-slate-950' : 'bg-emerald-500 text-white'}`}>
            <Check className="w-3 h-3" strokeWidth={3} />
          </span>
          {toastMessage}
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 lg:pt-10">

        {/* ── Breadcrumb ────────────────────────────────────────── */}
        <nav className={`flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase mb-6 lg:mb-10 ${t.muted}`}>
          <Link href="/" className={`transition-colors ${isAvroraTheme ? 'hover:text-cyan-300' : 'hover:text-slate-900'}`}>Home</Link>
          <ChevronRight className="w-3 h-3 opacity-60" />
          <Link href="/products" className="transition-colors hover:opacity-100 opacity-90">{categoryName || 'Shop'}</Link>
          <ChevronRight className="w-3 h-3 opacity-60" />
          <span className={`truncate max-w-[200px] ${t.heading}`}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* ── Thumbnails rail (desktop) ─────────────────────────── */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28 h-[calc(100vh-160px)]">
            <div
              ref={thumbContainerRef}
              className="h-full overflow-y-auto space-y-3 p-1 no-scrollbar"
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-full aspect-[3/4] rounded-xl overflow-hidden block transition-all duration-300 cursor-pointer ${
                    activeImageIndex === idx ? t.thumbActive : t.thumbIdle
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Gallery ──────────────────────────────────────────── */}
          <div className="lg:col-span-6">
            {/* Mobile: horizontal snap carousel */}
            <div className="lg:hidden -mx-4 sm:-mx-6">
              <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 px-4 sm:px-6">
                {(images.length ? images : [null]).map((img, idx) => (
                  <div key={idx} className={`relative snap-center shrink-0 w-[85%] sm:w-[60%] aspect-[3/4] rounded-3xl overflow-hidden ${t.imageBg}`}>
                    {img ? (
                      <img src={img} alt={`${product.name} - view ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-sm ${t.muted}`}>No Image Available</div>
                    )}
                    {img && (
                      <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-md tracking-widest">
                        {pad(idx + 1)} / {pad(images.length)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: stacked editorial images */}
            <div className="hidden lg:block space-y-5">
              {images.length > 0 ? images.map((img, idx) => (
                <div
                  key={idx}
                  ref={(el) => (imageRefs.current[idx] = el)}
                  className={`group relative rounded-3xl overflow-hidden aspect-[3/4] w-full ${t.imageBg}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - view ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                  <span className="absolute bottom-4 left-4 bg-black/45 text-white text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md tracking-[0.2em] font-medium">
                    {pad(idx + 1)} / {pad(images.length)}
                  </span>
                  {idx === 0 && hasDiscount && (
                    <span className={`absolute top-5 left-5 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${
                      isAvroraTheme ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.6)]' : 'bg-rose-500 text-white'
                    }`}>
                      -{discountPct}%
                    </span>
                  )}
                </div>
              )) : (
                <div className={`relative rounded-3xl overflow-hidden aspect-[3/4] w-full flex items-center justify-center ${t.imageBg}`}>
                  <span className={t.muted}>No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Info panel ───────────────────────────────────────── */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className={`rounded-3xl p-6 sm:p-8 ${t.panel}`}>

              {/* Status + actions */}
              <div className="flex items-center justify-between mb-5">
                <span className={`inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full ${t.chip}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    soldOut ? 'bg-rose-500' : lowStock ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`} />
                  {soldOut ? 'Sold Out' : lowStock ? 'Low Stock' : 'In Stock'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    aria-label="Share product"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${t.iconBtn}`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setWishlisted(w => !w); showToast(wishlisted ? 'Removed from Wishlist' : 'Added to Wishlist'); }}
                    aria-label="Add to wishlist"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${t.iconBtn}`}
                  >
                    <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className={`font-display text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1] mb-2 ${t.heading}`}>
                {product.name}
              </h1>
              {product.sku && (
                <p className={`text-[11px] tracking-[0.25em] uppercase mb-6 ${t.muted}`}>SKU · {product.sku}</p>
              )}

              {/* Price */}
              <div className="flex items-end gap-3 mb-7">
                <span className={`font-display text-3xl sm:text-[2.5rem] leading-none font-bold tracking-tight ${t.price}`}>
                  {currency}{formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className={`text-base line-through mb-1 ${t.muted}`}>
                      {currency}{formatPrice(product.originalPrice)}
                    </span>
                    <span className={`text-[11px] font-bold tracking-wider px-2 py-1 rounded-md mb-1 ${
                      isAvroraTheme ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-rose-50 text-rose-600'
                    }`}>
                      SAVE {discountPct}%
                    </span>
                  </>
                )}
              </div>

              <div className={`border-t mb-6 ${t.divider}`} />

              {/* Colour */}
              <div className="mb-6">
                <p className={`text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 ${t.muted}`}>Colour</p>
                <span className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium ${t.chip}`}>
                  <span className={`w-3.5 h-3.5 rounded-full ring-2 ring-offset-2 ${
                    isAvroraTheme ? 'bg-gradient-to-br from-cyan-300 to-fuchsia-400 ring-cyan-400/50 ring-offset-[#0a0420]' : 'bg-slate-800 ring-slate-300 ring-offset-white'
                  }`} />
                  {product.colorLabel || 'Standard'}
                </span>
              </div>

              {/* Size */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <p className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${t.muted}`}>
                    Size {selectedSize && <span className={`ml-1 ${t.heading}`}>· {selectedSize}</span>}
                  </p>
                  <button 
                    onClick={() => showToast('Size guide coming soon')}
                    className={`inline-flex items-center gap-1.5 text-[11px] tracking-wider uppercase font-medium underline-offset-4 hover:underline cursor-pointer ${t.accent}`}
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Guide
                  </button>
                </div>
                {product.size && product.size.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {product.size.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[52px] h-11 px-4 text-sm font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
                          selectedSize === sz ? t.sizeActive : t.sizeIdle
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm ${t.subtle}`}>One Size</p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-7">
                <p className={`text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 ${t.muted}`}>Quantity</p>
                <div className={`inline-flex items-center rounded-full border h-11 ${t.stepper}`}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className={`w-11 h-full rounded-l-full flex items-center justify-center transition cursor-pointer ${t.stepperBtn}`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`w-10 text-center text-sm font-bold ${t.heading}`}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className={`w-11 h-full rounded-r-full flex items-center justify-center transition cursor-pointer ${t.stepperBtn}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="hidden lg:grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => { handleAddToCart(); showToast('Added to cart'); }}
                  disabled={soldOut}
                  className={`h-14 rounded-full uppercase text-xs font-bold tracking-[0.18em] transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${t.btnOutline}`}
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={soldOut}
                  className={`h-14 rounded-full uppercase text-xs font-bold tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${t.btnPrimary}`}
                >
                  Buy It Now
                </button>
              </div>

              {lowStock && (
                <div className={`flex items-center gap-2 text-xs mb-6 px-4 py-3 rounded-2xl ${
                  isAvroraTheme ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20' : 'bg-amber-50 text-amber-700'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium">Hurry — only {stock} left in stock!</span>
                </div>
              )}

              {/* Perks */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {[
                  { icon: Truck, label: 'Islandwide Delivery' },
                  { icon: ShieldCheck, label: 'Secure Payment' },
                  { icon: Sparkles, label: 'Premium Quality' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className={`flex flex-col items-center text-center gap-2 py-4 px-2 rounded-2xl ${t.perk}`}>
                    <Icon className={`w-5 h-5 ${t.perkIcon}`} strokeWidth={1.6} />
                    <span className={`text-[10px] leading-tight font-semibold tracking-wide uppercase ${t.subtle}`}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div className={`border-t ${t.divider}`}>
                {[
                  {
                    key: 'description',
                    title: 'Description & Details',
                    body: product.description || 'No description provided.',
                  },
                  {
                    key: 'shipping',
                    title: 'Delivery & Returns',
                    body: 'Free islandwide delivery on orders over Rs. 10,000. Orders are carefully packed and dispatched to your doorstep. Contact us for any questions about your order.',
                  },
                ].map(({ key, title, body }) => (
                  <div key={key} className={`border-b ${t.divider}`}>
                    <button 
                      onClick={() => toggleAccordion(key)} 
                      className={`flex justify-between items-center w-full py-4 text-left font-display text-[15px] font-medium cursor-pointer ${t.heading}`}
                    >
                      <span>{title}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${accordionOpen[key] ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ease-out ${accordionOpen[key] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className={`pb-5 text-sm leading-relaxed whitespace-pre-line ${t.subtle}`}>{body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Mobile sticky purchase bar ─────────────────────────── */}
      <div className={`lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pt-3 pb-5 sm:pb-3 shadow-[0_-8px_30px_rgba(0,0,0,0.2)] flex items-center gap-3 ${t.mobileBar}`}>
        <div className="flex flex-col mr-auto">
          <span className={`text-[10px] uppercase tracking-widest ${t.muted}`}>Total</span>
          <span className={`font-display text-lg font-bold leading-tight ${t.price}`}>
            {currency}{formatPrice(product.price * quantity)}
          </span>
        </div>
        <button
          onClick={() => { handleAddToCart(); showToast('Added to cart'); }}
          disabled={soldOut}
          aria-label="Add to cart"
          className={`w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-40 cursor-pointer ${t.btnOutline}`}
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
        <button
          onClick={handleBuyNow}
          disabled={soldOut}
          className={`h-12 px-7 rounded-full uppercase text-xs font-bold tracking-[0.15em] disabled:opacity-40 cursor-pointer ${t.btnPrimary}`}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}