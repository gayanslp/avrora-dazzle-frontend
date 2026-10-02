import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

// ─── Product Card ───────────────────────────────────────────────────────────
const ProductCard = ({ ...props }) => (
  <div className="group flex flex-col cursor-pointer">
    <Link
      to={`/productDetails/${props._id}`}
      className="relative aspect-[2/3] overflow-hidden bg-slate-100 mb-3 block rounded-2xl"
    >
      <img
        src={props.images?.[0] ?? 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600'}
        alt={props.name}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {props.images?.length > 1 && (
        <img
          src={props.images[1]}
          alt={`${props.name} alternate`}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
        />
      )}

      {/* Badge */}
      {(props.stock === 0 || props.soldOut) ? (
        <div className="absolute top-3 left-3 bg-[#e33535] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10 tracking-wider">
          SOLD OUT
        </div>
      ) : props.sale && (
        <div className="absolute top-3 left-3 bg-green-800 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10 tracking-wider">
          SALE
        </div>
      )}

      {/* Eye icon */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-gray-50 shadow-sm transition-colors">
          <Eye className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Slide-up size bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 flex justify-between items-center border border-gray-200">
        <span className="text-[12px] font-bold text-slate-900">SIZE</span>
        <div className="flex gap-3 text-[12px] font-semibold text-slate-900">
          <span className="hover:text-slate-500 transition-colors">UK 04</span>
          <span className="hover:text-slate-500 transition-colors">UK 06</span>
          <span className="hover:text-slate-500 transition-colors">UK 08</span>
          <span className="hover:text-slate-500 transition-colors">UK 10</span>
          <span className="text-slate-500 ml-1 whitespace-nowrap">+more</span>
        </div>
      </div>
    </Link>

    {/* Info */}
    <div className="flex flex-col px-1">
      <div className="flex justify-between items-start gap-4 mb-1.5">
        <Link
          to={`/productDetails/${props._id}`}
          className="text-[13px] font-medium text-slate-800 hover:text-slate-900 transition-colors leading-snug max-w-[65%]"
        >
          {props.name}
        </Link>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap">
            {props.currency || 'Rs '}{props.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          {props.originalPrice && (
            <span className="text-[10px] font-semibold text-slate-400 line-through mt-0.5">
              {props.currency || 'Rs '}{props.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>

      {/* Color swatches */}
      <div className="flex gap-1.5 mt-0.5">
        {props.images?.slice(0, 3).map((img, i) => (
          <div
            key={`${props._id}-${i}`}
            className="w-[18px] h-[18px] rounded-full border border-slate-300 overflow-hidden cursor-pointer hover:border-slate-600 transition-colors"
          >
            <img src={img} alt={`swatch ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProductCard;