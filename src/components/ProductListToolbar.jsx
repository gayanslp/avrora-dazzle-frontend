import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  'Featured',
  'Price: Low to High',
  'Price: High to Low',
  'Newest First',
  'Best Selling',
];

// ─── Column-count toggle icon ─────────────────────────────────────────────────
const ColIcon = ({ cols, active, onClick, pageId = 'page' }) => {
  const bars = Array.from({ length: cols });
  return (
    <button
      id={`${pageId}-col-btn-${cols}`}
      onClick={onClick}
      title={`${cols} columns`}
      className={`flex items-end gap-[3px] px-1.5 py-1 rounded transition-colors ${
        active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {bars.map((_, i) => (
        <span
          key={i}
          className="inline-block w-[4px] rounded-sm"
          style={{
            height: cols === 2 ? 14 : cols === 3 ? 12 : cols === 4 ? 10 : 8,
            background: 'currentColor',
          }}
        />
      ))}
    </button>
  );
};

// ─── ProductListToolbar ───────────────────────────────────────────────────────
/**
 * Props:
 *   pageId              string      – unique prefix for element IDs (e.g. 'ladies' | 'gents')
 *   productCount        number      – total (filtered) product count
 *   cols                number      – current column count
 *   onColChange         fn(c)       – called when a column button is clicked
 *   selectedSort        string      – active sort option label
 *   onSortChange        fn(opt)     – called when a sort option is selected
 *   selectedSizes       string[]    – active size filter values
 *   onToggleSize        fn(s)       – toggle a size chip
 *   selectedPriceRange  string|null – active price range label
 *   onTogglePriceRange  fn(r)       – toggle a price range chip
 *   selectedAvailability string|null
 *   onToggleAvailability fn(a)
 *   onClearAll          fn()        – clear all active filters
 *   sizes               string[]    – available size options
 *   priceRanges         string[]    – available price range labels
 */
const ProductListToolbar = ({
  pageId = 'page',
  productCount = 0,
  cols = 5,
  onColChange,
  selectedSort = 'Featured',
  onSortChange,
  selectedSizes = [],
  onToggleSize,
  selectedPriceRange = null,
  onTogglePriceRange,
  selectedAvailability = null,
  onToggleAvailability,
  onClearAll,
  sizes = ['XS', 'S', 'M', 'L', 'XL'],
  priceRanges = ['Under Rs 5,000', 'Rs 5,000\u20139,000', 'Above Rs 9,000'],
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const hasActiveFilters =
    selectedSizes.length > 0 || selectedPriceRange !== null || selectedAvailability !== null;

  return (
    <>
      {/* ── Toolbar row ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">

        {/* Filter toggle */}
        <button
          id={`${pageId}-filter-btn`}
          onClick={() => setFilterOpen((v) => !v)}
          className="flex items-center gap-2 border border-slate-300 rounded-full px-4 py-2 text-[13px] font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
          Filter
        </button>

        {/* Product count + clear + column toggles */}
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-semibold text-slate-800">
            {productCount} Products
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-[11px] font-semibold text-slate-400 hover:text-red-500 underline underline-offset-2 transition-colors"
            >
              Clear filters
            </button>
          )}
          <div className="flex items-center gap-0.5 border border-slate-200 rounded-md px-1 py-0.5">
            {[2, 3, 4, 5].map((c) => (
              <ColIcon
                key={c}
                cols={c}
                active={cols === c}
                onClick={() => onColChange?.(c)}
                pageId={pageId}
              />
            ))}
          </div>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            id={`${pageId}-sort-btn`}
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-2 border border-slate-300 rounded-full px-4 py-2 text-[13px] font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
            Sort by
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 animate-fade-in">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onSortChange?.(opt); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors ${
                    selectedSort === opt ? 'font-semibold text-slate-900' : 'text-slate-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop to close sort dropdown */}
      {sortOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
      )}

      {/* ── Filter Panel ─────────────────────────────────────────── */}
      {filterOpen && (
        <div className="mb-6 border border-slate-200 rounded-2xl p-6 bg-slate-50 animate-slide-down">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Filters
            </span>
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="text-[11px] font-semibold text-red-500 hover:text-red-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">

            {/* Size */}
            <div>
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => onToggleSize?.(s)}
                    className={`border rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                      selectedSizes.includes(s)
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-300 text-slate-700 hover:border-slate-800 hover:text-slate-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Price Range</p>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => onTogglePriceRange?.(range)}
                    className={`border rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                      selectedPriceRange === range
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-300 text-slate-700 hover:border-slate-800 hover:text-slate-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Availability</p>
              <div className="flex flex-wrap gap-2">
                {['In Stock', 'Sold Out'].map((avail) => (
                  <button
                    key={avail}
                    onClick={() => onToggleAvailability?.(avail)}
                    className={`border rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                      selectedAvailability === avail
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-300 text-slate-700 hover:border-slate-800 hover:text-slate-900'
                    }`}
                  >
                    {avail}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
              {selectedSizes.map((s) => (
                <span
                  key={s}
                  onClick={() => onToggleSize?.(s)}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  Size: {s} ✕
                </span>
              ))}
              {selectedPriceRange && (
                <span
                  onClick={() => onTogglePriceRange?.(selectedPriceRange)}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  {selectedPriceRange} ✕
                </span>
              )}
              {selectedAvailability && (
                <span
                  onClick={() => onToggleAvailability?.(selectedAvailability)}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  {selectedAvailability} ✕
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductListToolbar;
