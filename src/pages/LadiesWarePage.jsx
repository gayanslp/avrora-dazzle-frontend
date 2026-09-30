import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import ProductListToolbar from '../components/ProductListToolbar';

// ─── Mock ladies-wear products ─────────────────────────────────────────────
const mockProducts = [
  {
    _id: 'lw-1',
    name: 'Graceful Structure WW Dress',
    price: 8790,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-2',
    name: 'Riviera Pinstripe WW Dress',
    price: 8990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-3',
    name: 'Nova Bubble Mini',
    price: 7150,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-4',
    name: 'Clara Check Midi',
    price: 8190,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-5',
    name: 'Isla Tiered Midi',
    price: 9490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-6',
    name: 'Luna Lace Midi Dress',
    price: 9990,
    currency: 'Rs ',
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-7',
    name: 'Seraph Draped Gown',
    price: 12490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-8',
    name: 'Celeste Wrap Dress',
    price: 7890,
    currency: 'Rs ',
    sale: true,
    originalPrice: 9890,
    images: [
      'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-9',
    name: 'Amber Floral Midi',
    price: 8490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1497339100541-5b1b8b7a6f4b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-10',
    name: 'Stella Ruffle Mini',
    price: 6990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-11',
    name: 'Ophelia Satin Slip Dress',
    price: 10490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-12',
    name: 'Aurora Belted Midi',
    price: 9190,
    currency: 'Rs ',
    sale: true,
    originalPrice: 11490,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-13',
    name: 'Violet Peplum Dress',
    price: 7490,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1551163943-3f7253a97938?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-14',
    name: 'Bianca Linen Shirt Dress',
    price: 8290,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-15',
    name: 'Rosette Bodycon Midi',
    price: 9890,
    currency: 'Rs ',
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-16',
    name: 'Cleo Wrap Maxi',
    price: 11990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-17',
    name: 'Delphi Pleated Midi',
    price: 8690,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-18',
    name: 'Elara Floral Maxi',
    price: 12990,
    currency: 'Rs ',
    sale: true,
    originalPrice: 14990,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-19',
    name: 'Freya Corset Dress',
    price: 10990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    _id: 'lw-20',
    name: 'Gemma A-Line Dress',
    price: 7990,
    currency: 'Rs ',
    images: [
      'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1497339100541-5b1b8b7a6f4b?auto=format&fit=crop&q=80&w=600',
    ],
  },
];



// ─── Page ───────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

const LadiesWarePage = () => {
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
          pageId="ladies"
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

export default LadiesWarePage;
