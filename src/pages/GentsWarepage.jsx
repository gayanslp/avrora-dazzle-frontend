import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import ProductListToolbar from '../components/ProductListToolbar';

// ─── Mock gents-wear products ──────────────────────────────────────────────
const mockProducts = [
  {
    _id: 'gw-1',
    name: 'Oxford Classic Slim Shirt',
    price: 4990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-2',
    name: 'Tailored Charcoal Blazer',
    price: 12990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-3',
    name: 'Linen Relaxed Trousers',
    price: 6490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-4',
    name: 'Navy Double-Breasted Suit',
    price: 24990,
    currency: 'Rs ',
    sale: true,
    originalPrice: 29990,
    images: [
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-5',
    name: 'Classic White Dress Shirt',
    price: 3990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-6',
    name: 'Merino Crew Neck Sweater',
    price: 7990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-7',
    name: 'Slim Fit Chino Trousers',
    price: 5490,
    currency: 'Rs ',
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-8',
    name: 'Leather Biker Jacket',
    price: 18990,
    currency: 'Rs ',
    sale: true,
    originalPrice: 22990,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-9',
    name: 'Flannel Check Overshirt',
    price: 5990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4547?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-10',
    name: 'Essential Polo Shirt',
    price: 3490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-11',
    name: 'Formal Pinstripe Trousers',
    price: 7490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-12',
    name: 'Quilted Puffer Jacket',
    price: 9990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-13',
    name: 'Stretch Denim Jeans',
    price: 6990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-14',
    name: 'Herringbone Tweed Blazer',
    price: 15490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-15',
    name: 'Cotton Turtleneck',
    price: 4490,
    currency: 'Rs ',
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-16',
    name: 'Tech Bomber Jacket',
    price: 11990,
    currency: 'Rs ',
    sale: true,
    originalPrice: 14490,
    images: [
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-17',
    name: 'Linen Resort Shirt',
    price: 4290,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-18',
    name: 'Structured Overcoat',
    price: 19990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-19',
    name: 'Slim Fit Cargo Trousers',
    price: 5990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'gw-20',
    name: 'Premium Knit Cardigan',
    price: 8490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&q=80&w=600',
    ],
  },
];




// ─── Page ───────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

const GentsWarePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cols, setCols] = useState(5);
  const [gridKey, setGridKey] = useState(0);
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Active filter state ────────────────────────────────────────
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const togglePriceRange = (range) => {
    setSelectedPriceRange((prev) => (prev === range ? null : range));
    setCurrentPage(1);
  };

  const toggleAvailability = (avail) => {
    setSelectedAvailability((prev) => (prev === avail ? null : avail));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedPriceRange(null);
    setSelectedAvailability(null);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedSizes.length > 0 || selectedPriceRange !== null || selectedAvailability !== null;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        if (data?.success && data.products?.length) {
          const filtered = data.products.filter(
            (p) =>
              !p.category ||
              p.category?.toLowerCase().includes('ladies') ||
              p.category?.toLowerCase().includes('women')
          );
          setProducts(filtered.length ? filtered : data.products);
        }
      } catch {
        // fall back to mock
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayProducts = products.length > 0 ? products : mockProducts;

  // ── Apply active filters ───────────────────────────────────────
  const filtered = displayProducts.filter((p) => {
    // Availability
    if (selectedAvailability === 'In Stock' && (p.stock === 0 || p.soldOut)) return false;
    if (selectedAvailability === 'Sold Out' && p.stock !== 0 && !p.soldOut) return false;

    // Price range
    if (selectedPriceRange === 'Under Rs 5,000' && p.price >= 5000) return false;
    if (selectedPriceRange === 'Rs 5,000–9,000' && (p.price < 5000 || p.price > 9000)) return false;
    if (selectedPriceRange === 'Above Rs 9,000' && p.price <= 9000) return false;

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (selectedSort === 'Price: Low to High') return a.price - b.price;
    if (selectedSort === 'Price: High to Low') return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginatedProducts = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleColChange = (c) => {
    setCols(c);
    setGridKey((k) => k + 1);
  };

  const colClass =
    cols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : cols === 4
      ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';

  return (
    <div className="w-full bg-white min-h-screen font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 pt-6 pb-20">

        <ProductListToolbar
          pageId="gents"
          productCount={sorted.length}
          cols={cols}
          onColChange={handleColChange}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          selectedSizes={selectedSizes}
          onToggleSize={toggleSize}
          selectedPriceRange={selectedPriceRange}
          onTogglePriceRange={togglePriceRange}
          selectedAvailability={selectedAvailability}
          onToggleAvailability={toggleAvailability}
          onClearAll={clearAllFilters}
        />



        {/* ── Product Grid ──────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
          </div>
        ) : (
          <div key={gridKey} className={`grid ${colClass} gap-5 lg:gap-6 animate-grid-in`}>
            {paginatedProducts.map((product, i) => (
              <div
                key={product._id}
                className="animate-card-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            {/* Prev */}
            <button
              id="ladies-page-prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:border-slate-800 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
            >
              ‹
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                id={`ladies-page-${page}`}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-[13px] font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-300 text-slate-600 hover:border-slate-800 hover:text-slate-900'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              id="ladies-page-next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:border-slate-800 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
            >
              ›
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default GentsWarePage;
