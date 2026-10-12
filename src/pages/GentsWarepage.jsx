import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import ProductListToolbar from '../components/ProductListToolbar';

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
        setLoading(true);
        const data = await fetchProducts();
        if (data?.success && Array.isArray(data.products)) {
          const mensProducts = data.products.filter((p) => {
            const catObj = typeof p.category === 'object' ? p.category : null;
            const catSlug = (catObj?.slug || p.category || '').toLowerCase();
            const catName = (catObj?.name || '').toLowerCase();
            const subObj = typeof p.subCategory === 'object' ? p.subCategory : null;
            const subSlug = (subObj?.slug || p.subCategory || '').toLowerCase();
            const sku = (p.sku || '').toLowerCase();
            
            return catSlug === 'mens' || 
                   catName.includes('gent') || 
                   catName.includes('men') || 
                   subSlug.includes('men') ||
                   sku.startsWith('gw-');
          });
          setProducts(mensProducts.length > 0 ? mensProducts : data.products);
        }
      } catch (err) {
        console.error('Failed to load gents products from database:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayProducts = products;

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
    <div className="w-full bg-transparent min-h-screen font-didot text-slate-900">
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
        ) : paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-light text-slate-500 mb-4">No gents wear products found matching your criteria.</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 rounded-full border border-slate-900 text-slate-900 text-xs font-semibold uppercase tracking-wider hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            )}
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
