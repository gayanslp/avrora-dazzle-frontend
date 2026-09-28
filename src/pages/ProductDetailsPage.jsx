import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Heart, ChevronDown, ChevronUp, 
  Check, AlertCircle, ArrowUp
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProductById } from '../api/productApi';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
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
  const [showScrollTop, setShowScrollTop] = useState(false);

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
            navigate('/unauthorized');
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        navigate('/unauthorized');
      } finally {
        setLoading(false);
      }
    };
    if(id) {
        loadProduct();
    }
  }, [id, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

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
      productId: product._id,
      id: product._id,
      name: product.name,
      variant: variant,
      price: product.price,
      currency: product.currency || 'Rs ',
      color: color,
      size: size,
      quantity: quantity || 1,
      image: product.images && product.images.length > 0 ? product.images[0] : ''
    };

    addToCart(newItem);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleAccordion = (section) => {
    setAccordionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
        </div>
    );
  }

  if (!product) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white">
              <h2 className="text-xl">Product Not Found</h2>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans antialiased selection:bg-stone-200">
      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 px-6 py-3 rounded-full shadow-2xl text-xs tracking-wide animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-50 w-14 h-14 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-stone-800 transition-all hover:scale-110 group border-2 border-white"
          title="Scroll to Top"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">

          <div className="hidden lg:block lg:col-span-2 sticky top-28 h-[calc(100vh-140px)]">
            <div 
              ref={thumbContainerRef}
              className="h-full overflow-y-auto space-y-3 pr-2 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {product.images && product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToImage(idx)}
                  className={`w-full aspect-[3/4] rounded-md overflow-hidden border-2 transition-all block ${
                    activeImageIndex === idx ? 'border-stone-950 shadow-md scale-105' : 'border-stone-200 hover:border-stone-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            {product.images && product.images.length > 0 ? product.images.map((img, idx) => (
              <div 
                key={idx}
                ref={(el) => (imageRefs.current[idx] = el)}
                className="relative bg-stone-100 rounded-xl overflow-hidden shadow-sm aspect-[3/4] w-full"
              >
                <img src={img} alt={`${product.name} - view ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-stone-900/70 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm font-mono tracking-widest">
                  0{idx + 1} / 0{product.images.length}
                </div>
                {idx === 0 && (
                  <button 
                    onClick={() => showToast('Added to Wishlist')}
                    className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full hover:bg-white text-stone-800 transition shadow-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                )}
              </div>
            )) : (
              <div className="relative bg-stone-100 rounded-xl overflow-hidden shadow-sm aspect-[3/4] w-full flex items-center justify-center">
                  <span className="text-stone-400">No Image Available</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 sticky top-28 bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
            <h1 className="text-2xl sm:text-3xl text-stone-900 font-normal tracking-wide mb-1">
              {product.name}
            </h1>
            <p className="text-xs tracking-widest text-stone-400 font-mono mb-4">{product.sku}</p>

            <div className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-6">
              {product.currency || 'Rs '}{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>

            <div className="mb-6 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-stone-700">
                  Color : <span className="font-bold text-stone-900">{product.colorLabel || 'Standard'}</span>
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-stone-700">
                  Select Size
                </span>
                <button 
                  onClick={() => showToast('Size guide modal opened')}
                  className="text-[11px] underline text-stone-500 hover:text-stone-900 tracking-wider uppercase"
                >
                  Size Chart
                </button>
              </div>
              {product.size && product.size.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {product.size.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 text-xs uppercase tracking-wider rounded border font-medium transition-all ${
                        selectedSize === sz 
                          ? 'border-stone-900 bg-stone-900 text-white shadow-sm' 
                          : 'border-stone-200 text-stone-800 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              ) : (
                  <p className="text-sm text-stone-500">Standard Size</p>
              )}
            </div>

            <div className="mb-6 flex items-center gap-4">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-stone-700">Quantity</span>
              <div className="flex items-center border border-stone-300 rounded bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 transition"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-semibold text-stone-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-stone-950 text-white py-4 rounded-full uppercase text-xs font-semibold tracking-widest hover:bg-stone-800 transition shadow-md hover:shadow-lg transform active:scale-[0.99]"
              >
                ADD TO CART
              </button>
            </div>

            {product.countInStock && product.countInStock < 5 && (
              <div className="flex items-center gap-2 text-rose-600 text-xs mb-6">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">Only {product.countInStock} items left in stock!</span>
              </div>
            )}

            <div className="space-y-3 text-sm border-t border-stone-200 pt-4">
              <div className="border-b border-stone-200 pb-3">
                <button 
                  onClick={() => toggleAccordion('description')} 
                  className="flex justify-between items-center w-full font-medium text-stone-900 text-left py-1"
                >
                  <span>Description & Details</span>
                  {accordionOpen.description ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {accordionOpen.description && (
                  <div className="mt-3 text-stone-600 text-sm leading-relaxed whitespace-pre-line animate-fade-in pr-4">
                    {product.description || "No description provided."}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}