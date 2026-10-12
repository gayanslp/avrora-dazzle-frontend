'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { fetchProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import ProductListToolbar from '../components/ProductListToolbar';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, ChevronRight, Layers } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

// ─── Mens Subcategories Config matching Navbar ───────────────────────────────
const MENS_SUBCATEGORIES = [
  {
    id: 'all',
    name: "All Men's Wear",
    slug: 'mens',
    path: '/products/mens',
  },
  {
    id: 'shirts',
    name: 'Shirts',
    slug: 'mens-shirts',
    path: '/products/mens-shirts',
    image: '/assets/categories/mens/mens-shirts/image-1.jpg',
  },
  {
    id: 't-shirts',
    name: "T'shirts",
    slug: 'mens-t-shirts',
    path: '/products/mens-t-shirts',
    image: '/assets/categories/mens/mens-t-shirts/image-1.jpg',
  },
  {
    id: 'jeans',
    name: 'Jeans',
    slug: 'mens-jeans',
    path: '/products/mens-jeans',
    image: '/assets/categories/mens/mens-jeans/image-1.jpg',
  },
  {
    id: 'trousers',
    name: 'Trousers',
    slug: 'mens-trousers',
    path: '/products/mens-trousers',
    image: '/assets/categories/mens/mens-trousers/image-1.jpg',
  },
  {
    id: 'gym',
    name: 'Gym wears',
    slug: 'gym-activewear',
    path: '/products/gym-activewear',
    image: '/assets/categories/gym-activewear/workout-tops/image-1.jpg',
  },
  {
    id: 'suits',
    name: 'Suits & Blazers',
    slug: 'suits-blazers',
    path: '/products/suits-blazers',
    image: '/assets/categories/mens/suits-blazers/image-1.jpg',
  },
  {
    id: 'bags',
    name: 'Bags',
    slug: 'bags',
    path: '/products/bags',
    image: '/assets/categories/accessories/bags/image-1.jpg',
  },
  {
    id: 'belts-caps',
    name: 'Belts caps',
    slug: 'belts-caps',
    path: '/products/belts-caps',
    image: '/assets/categories/accessories/caps/image-1.jpg',
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    slug: 'sunglasses',
    path: '/products/sunglasses',
    image: '/assets/categories/accessories/sunglasses/image-1.jpg',
  },
];

// ─── Women Subcategories Config matching Navbar ─────────────────────────────
const WOMEN_SUBCATEGORIES = [
  {
    id: 'all',
    name: 'All Ladieswear',
    slug: 'women',
    path: '/products/women',
  },
  {
    id: 'dresses',
    name: 'Dresses',
    slug: 'dresses',
    path: '/products/dresses',
    image: '/assets/categories/women/dresses/image-1.jpg',
  },
  {
    id: 'blouses-tops',
    name: 'Blouses & Tops',
    slug: 'blouses-tops',
    path: '/products/blouses-tops',
    image: '/assets/categories/women/tops-blouses/image-1.jpg',
  },
  {
    id: 'pants-jeans',
    name: 'Pants & Jeans',
    slug: 'pants-jeans',
    path: '/products/pants-jeans',
    image: '/assets/categories/women/womens-jeans/image-1.jpg',
  },
  {
    id: 'skirts',
    name: 'Skirts',
    slug: 'skirts',
    path: '/products/skirts',
    image: '/assets/categories/women/skirts/image-1.jpg',
  },
  {
    id: 'gym-activewear',
    name: 'Gym & Active wears',
    slug: 'women-activewear',
    path: '/products/women-activewear',
    image: '/assets/categories/gym-activewear/workout-tops/image-1.jpg',
  },
  {
    id: 'undergarments',
    name: 'Undergarments',
    slug: 'undergarments',
    path: '/products/undergarments',
    image: '/assets/categories/gym-activewear/sports-bras/image-1.jpg',
  },
  {
    id: 'jewellery-watches',
    name: 'Jewellery & Watches',
    slug: 'jewellery-watches',
    path: '/products/jewellery-watches',
    image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg',
  },
  {
    id: 'beauty-products',
    name: 'Beauty products',
    slug: 'beauty-products',
    path: '/products/beauty-products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'handbags',
    name: 'Handbags',
    slug: 'handbags',
    path: '/products/handbags',
    image: '/assets/categories/accessories/bags/image-1.jpg',
  },
  {
    id: 'footwear',
    name: 'Footwear',
    slug: 'footwear',
    path: '/products/footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'other-accessories',
    name: 'Other Accessories',
    slug: 'other-accessories',
    path: '/products/other-accessories',
    image: '/assets/categories/accessories/belts/image-1.jpg',
  },
];

// ─── Kids Subcategories Config matching Navbar ──────────────────────────────
const KIDS_SUBCATEGORIES = [
  {
    id: 'all',
    name: 'All Kids Wear',
    slug: 'kids',
    path: '/products/kids',
  },
  {
    id: 'baby-boy-girl',
    name: 'Baby Boy & Girl',
    slug: 'baby-boy-girl',
    path: '/products/baby-boy-girl',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'toddler-boys',
    name: 'Toddler Boys',
    slug: 'toddler-boys',
    path: '/products/toddler-boys',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'toddler-girls',
    name: 'Toddler Girls',
    slug: 'toddler-girls',
    path: '/products/toddler-girls',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'kids-footwear',
    name: 'Footwear',
    slug: 'kids-footwear',
    path: '/products/kids-footwear',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'toys',
    name: 'Toys',
    slug: 'toys',
    path: '/products/toys',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600',
  },
];

// ─── Bridal Subcategories Config matching Navbar ────────────────────────────
const BRIDAL_SUBCATEGORIES = [
  {
    id: 'all',
    name: 'All Bridal & Accessories',
    slug: 'bridal-wear',
    path: '/products/bridal-wear',
  },
  {
    id: 'bridal-gowns',
    name: 'Bridal Gowns',
    slug: 'bridal-gowns',
    path: '/products/bridal-gowns',
    image: '/assets/categories/bridal-wear/bridal-gowns/image-1.jpg',
  },
  {
    id: 'bridesmaid-dresses',
    name: 'Bridesmaid Dresses',
    slug: 'bridesmaid-dresses',
    path: '/products/bridesmaid-dresses',
    image: '/assets/categories/bridal-wear/bridesmaid-dresses/image-1.jpg',
  },
  {
    id: 'bridal-accessories',
    name: 'Bridal Jewellery & Sets',
    slug: 'bridal-accessories',
    path: '/products/bridal-accessories',
    image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg',
  },
  {
    id: 'bridal-veils',
    name: 'Veils & Hair Accessories',
    slug: 'bridal-veils',
    path: '/products/bridal-veils',
    image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg',
  },
  {
    id: 'bridal-bags',
    name: 'Clutches & Bridal Bags',
    slug: 'bridal-bags',
    path: '/products/bridal-bags',
    image: '/assets/categories/accessories/bags/image-1.jpg',
  },
  {
    id: 'bridal-footwear',
    name: 'Bridal Heels & Footwear',
    slug: 'bridal-footwear',
    path: '/products/bridal-footwear',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600',
  },
];

// ─── Gift & Fancy Subcategories Config matching Navbar ───────────────────────
const GIFT_FANCY_SUBCATEGORIES = [
  {
    id: 'all',
    name: 'All Gift & Fancy Items',
    slug: 'fancy-gift',
    path: '/products/fancy-gift',
  },
  {
    id: 'jewellery',
    name: 'Fancy Watches & Jewellery',
    slug: 'jewellery',
    path: '/products/jewellery',
    image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg',
  },
  {
    id: 'sunglasses',
    name: 'Designer Sunglasses',
    slug: 'sunglasses',
    path: '/products/sunglasses',
    image: '/assets/categories/accessories/sunglasses/image-1.jpg',
  },
  {
    id: 'belts',
    name: 'Belts & Wallets',
    slug: 'belts',
    path: '/products/belts',
    image: '/assets/categories/accessories/belts/image-1.jpg',
  },
  {
    id: 'beauty-products',
    name: 'Luxury Perfumes & Scents',
    slug: 'beauty-products',
    path: '/products/beauty-products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'caps',
    name: 'Caps & Trendy Headwear',
    slug: 'caps',
    path: '/products/caps',
    image: '/assets/categories/accessories/caps/image-1.jpg',
  },
  {
    id: 'gift-sets',
    name: 'Gift Sets & Hampers',
    slug: 'gift-sets',
    path: '/products/gift-sets',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=600',
  },
];

const ProductsPage = () => {
  const params = useParams();
  const subSlug = params?.subSlug;
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = { fromCategory: searchParams?.get('fromCategory') };
  const navigate = (path) => router.push(path);
  const { isAvroraTheme } = useTheme();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cols, setCols] = useState(4);
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
    setLoading(true);
    const load = async () => {
      try {
        const data = await fetchProducts();
        if (data?.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load products from database:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isSortNewest = searchParams?.get('sort') === 'newest';

  const currentTarget = (subSlug || '').toLowerCase().trim();

  // Check if current view is Bridalwears & Accessories section
  const isBridalSection =
    currentTarget === 'bridal-wear' ||
    currentTarget === 'bridal' ||
    currentTarget === 'bridal-gowns' ||
    currentTarget === 'bridesmaid-dresses' ||
    currentTarget === 'bridal-accessories' ||
    currentTarget === 'bridal-veils' ||
    currentTarget === 'bridal-bags' ||
    currentTarget === 'bridal-footwear' ||
    state?.fromCategory === 'bridal' ||
    state?.fromCategory === 'bridal-accessories';

  // Check if current view is Gift & Fancy Items section
  const isGiftFancySection =
    !isBridalSection &&
    (currentTarget === 'fancy-gift' ||
      currentTarget === 'gift-fancy' ||
      currentTarget === 'gift-sets' ||
      state?.fromCategory === 'gift-fancy' ||
      state?.fromCategory === 'fancy-gift' ||
      (currentTarget === 'jewellery' && state?.fromCategory !== 'women' && state?.fromCategory !== 'accessories') ||
      (currentTarget === 'sunglasses' && state?.fromCategory === 'gift-fancy') ||
      (currentTarget === 'belts' && state?.fromCategory === 'gift-fancy') ||
      (currentTarget === 'caps' && state?.fromCategory === 'gift-fancy') ||
      (currentTarget === 'beauty-products' && state?.fromCategory === 'gift-fancy'));

  // Check if current view is Kids wear section
  const isKidsSection =
    !isBridalSection &&
    !isGiftFancySection &&
    (currentTarget === 'kids' ||
      currentTarget === 'kids-wear' ||
      [
        'baby-boy-girl',
        'toddler-boys',
        'toddler-girls',
        'kids-footwear',
        'toys',
        'kids-t-shirts',
        'kids-dresses',
        'school-wear',
        'kids-bottoms',
      ].includes(currentTarget));

  // Check if current view is Womenswear section
  const isWomenSection =
    !isBridalSection &&
    !isGiftFancySection &&
    !isKidsSection &&
    (currentTarget === 'women' ||
      currentTarget === 'ladieswear' ||
      currentTarget === 'ladies-wear' ||
      [
        'dresses',
        'blouses-tops',
        'tops-blouses',
        'pants-jeans',
        'womens-jeans',
        'skirts',
        'women-activewear',
        'undergarments',
        'jewellery-watches',
        'beauty-products',
        'handbags',
        'other-accessories',
      ].includes(currentTarget) ||
      (currentTarget === 'footwear' && state?.fromCategory !== 'mens' && state?.fromCategory !== 'bridal-accessories'));

  // Check if current view is Menswear section
  const isMensSection =
    !isBridalSection &&
    !isGiftFancySection &&
    !isKidsSection &&
    !isWomenSection &&
    (!subSlug ||
      currentTarget === 'mens' ||
      currentTarget === 'gents-wear' ||
      [
        'mens-shirts',
        'mens-t-shirts',
        'mens-jeans',
        'mens-trousers',
        'suits-blazers',
        'gym-activewear',
        'gym-wears',
        'bags',
        'belts-caps',
        'caps',
        'belts',
        'sunglasses',
        'shirts',
        't-shirts',
        'jeans',
        'trousers',
        'suits',
      ].includes(currentTarget));

  // Check if a bridal subcategory is currently active
  const isBridalSubActive = (sub) => {
    if (sub.slug === 'bridal-wear') {
      return currentTarget === 'bridal-wear' || currentTarget === 'bridal';
    }
    return currentTarget === sub.slug;
  };

  // Check if a gift/fancy subcategory is currently active
  const isGiftFancySubActive = (sub) => {
    if (sub.slug === 'fancy-gift') {
      return currentTarget === 'fancy-gift' || currentTarget === 'gift-fancy';
    }
    return currentTarget === sub.slug;
  };

  // Check if a kids subcategory is currently active
  const isKidsSubActive = (sub) => {
    if (sub.slug === 'kids') {
      return currentTarget === 'kids' || currentTarget === 'kids-wear';
    }
    return currentTarget === sub.slug;
  };

  // Check if a mens subcategory is currently active
  const isMensSubActive = (sub) => {
    if (sub.slug === 'mens') {
      return !subSlug || currentTarget === 'mens' || currentTarget === 'gents-wear';
    }
    if (sub.slug === 'mens-shirts') return currentTarget === 'mens-shirts' || currentTarget === 'shirts';
    if (sub.slug === 'mens-t-shirts')
      return currentTarget === 'mens-t-shirts' || currentTarget === 't-shirts' || currentTarget === "t'shirts";
    if (sub.slug === 'mens-jeans') return currentTarget === 'mens-jeans' || currentTarget === 'jeans';
    if (sub.slug === 'mens-trousers') return currentTarget === 'mens-trousers' || currentTarget === 'trousers';
    if (sub.slug === 'gym-activewear')
      return currentTarget === 'gym-activewear' || currentTarget === 'gym-wears' || currentTarget === 'gym-wear';
    if (sub.slug === 'suits-blazers') return currentTarget === 'suits-blazers' || currentTarget === 'suits';
    if (sub.slug === 'bags') return currentTarget === 'bags';
    if (sub.slug === 'belts-caps')
      return currentTarget === 'belts-caps' || currentTarget === 'caps' || currentTarget === 'belts';
    if (sub.slug === 'sunglasses') return currentTarget === 'sunglasses';
    return currentTarget === sub.slug;
  };

  // Check if a womens subcategory is currently active
  const isWomenSubActive = (sub) => {
    if (sub.slug === 'women') {
      return currentTarget === 'women' || currentTarget === 'ladieswear' || currentTarget === 'ladies-wear';
    }
    if (sub.slug === 'dresses') return currentTarget === 'dresses';
    if (sub.slug === 'blouses-tops')
      return currentTarget === 'blouses-tops' || currentTarget === 'tops-blouses' || currentTarget === 'tops' || currentTarget === 'blouses';
    if (sub.slug === 'pants-jeans')
      return currentTarget === 'pants-jeans' || currentTarget === 'womens-jeans';
    if (sub.slug === 'skirts') return currentTarget === 'skirts';
    if (sub.slug === 'women-activewear')
      return currentTarget === 'women-activewear' || currentTarget === 'gym-activewear';
    if (sub.slug === 'undergarments') return currentTarget === 'undergarments';
    if (sub.slug === 'jewellery-watches')
      return currentTarget === 'jewellery-watches' || currentTarget === 'jewellery' || currentTarget === 'watches';
    if (sub.slug === 'beauty-products')
      return currentTarget === 'beauty-products' || currentTarget === 'beauty';
    if (sub.slug === 'handbags') return currentTarget === 'handbags' || currentTarget === 'bags';
    if (sub.slug === 'footwear') return currentTarget === 'footwear';
    if (sub.slug === 'other-accessories') return currentTarget === 'other-accessories';
    return currentTarget === sub.slug;
  };

  // Get active subcategory objects
  const activeBridalSubCategory = BRIDAL_SUBCATEGORIES.find((s) => isBridalSubActive(s)) || BRIDAL_SUBCATEGORIES[0];
  const activeGiftFancySubCategory = GIFT_FANCY_SUBCATEGORIES.find((s) => isGiftFancySubActive(s)) || GIFT_FANCY_SUBCATEGORIES[0];
  const activeMensSubCategory = MENS_SUBCATEGORIES.find((s) => isMensSubActive(s)) || MENS_SUBCATEGORIES[0];
  const activeWomenSubCategory = WOMEN_SUBCATEGORIES.find((s) => isWomenSubActive(s)) || WOMEN_SUBCATEGORIES[0];
  const activeKidsSubCategory = KIDS_SUBCATEGORIES.find((s) => isKidsSubActive(s)) || KIDS_SUBCATEGORIES[0];

  // Dynamically count products matching each Mens subcategory
  const getMensSubCategoryCount = (slug) => {
    if (slug === 'mens') {
      return products.filter((p) => {
        const catSlug = (p.category?.slug || p.category || '').toLowerCase();
        const subSlugStr = (p.subCategory?.slug || p.subCategory || '').toLowerCase();
        const subNameStr = (p.subCategory?.name || '').toLowerCase();
        return catSlug === 'mens' || subSlugStr.includes('men') || subNameStr.includes('men');
      }).length;
    }
    return products.filter((p) => {
      const catSlug = (p.category?.slug || p.category || '').toLowerCase();
      const subSlugStr = (p.subCategory?.slug || p.subCategory || '').toLowerCase();
      const subNameStr = (p.subCategory?.name || '').toLowerCase();

      if (slug === 'mens-shirts')
        return (
          (subSlugStr.includes('shirt') || subNameStr.includes('shirt')) &&
          !subSlugStr.includes('t-shirt') &&
          !subNameStr.includes('t-shirt')
        );
      if (slug === 'mens-t-shirts')
        return subSlugStr.includes('t-shirt') || subNameStr.includes('t-shirt') || subSlugStr.includes('tshirt');
      if (slug === 'mens-jeans')
        return (
          (catSlug === 'mens' || subSlugStr.includes('men')) &&
          (subSlugStr.includes('jean') || subNameStr.includes('jean'))
        );
      if (slug === 'mens-trousers') return subSlugStr.includes('trouser') || subNameStr.includes('trouser');
      if (slug === 'gym-activewear')
        return (
          catSlug.includes('gym') ||
          subSlugStr.includes('gym') ||
          subSlugStr.includes('workout') ||
          subSlugStr.includes('sport')
        );
      if (slug === 'suits-blazers')
        return subSlugStr.includes('suit') || subNameStr.includes('suit') || subSlugStr.includes('blazer');
      if (slug === 'bags') return subSlugStr.includes('bag') || subNameStr.includes('bag');
      if (slug === 'belts-caps')
        return (
          subSlugStr.includes('belt') ||
          subSlugStr.includes('cap') ||
          subNameStr.includes('belt') ||
          subNameStr.includes('cap')
        );
      if (slug === 'sunglasses') return subSlugStr.includes('sunglass') || subNameStr.includes('sunglass');
      return subSlugStr === slug || subNameStr.toLowerCase().includes(slug);
    }).length;
  };

  // Dynamically count products matching each Women subcategory
  const getWomenSubCategoryCount = (slug) => {
    return products.filter((p) => {
      const catObj = typeof p.category === 'object' ? p.category : null;
      const catSlug = (catObj?.slug || p.category || '').toLowerCase().trim();
      const subObj = typeof p.subCategory === 'object' ? p.subCategory : null;
      const subSlugStr = (subObj?.slug || p.subCategory || '').toLowerCase().trim();
      const subNameStr = (subObj?.name || '').toLowerCase().trim();
      const pName = (p.name || '').toLowerCase().trim();

      if (slug === 'women') {
        return (
          catSlug === 'women' ||
          catSlug === 'ladies-wear' ||
          catSlug === 'ladieswear' ||
          subSlugStr.includes('women') ||
          subNameStr.includes('women') ||
          subNameStr.includes('dress') ||
          subNameStr.includes('skirt') ||
          subSlugStr.includes('tops-blouses') ||
          subSlugStr.includes('womens-jeans') ||
          subSlugStr.includes('jackets-coats')
        );
      }
      if (slug === 'dresses') {
        return (subSlugStr.includes('dress') || subNameStr.includes('dress') || pName.includes('dress')) && !catSlug.includes('kid') && !catSlug.includes('bridal');
      }
      if (slug === 'blouses-tops') {
        return (
          (subSlugStr.includes('tops-blouses') ||
            subSlugStr.includes('blouse') ||
            subNameStr.includes('blouse') ||
            subNameStr.includes('tops') ||
            pName.includes('blouse') ||
            (pName.includes('top') && !subSlugStr.includes('workout-top') && !catSlug.includes('men'))) &&
          !catSlug.includes('men')
        );
      }
      if (slug === 'pants-jeans') {
        return (
          (catSlug === 'women' || !catSlug.includes('men')) &&
          (subSlugStr.includes('jean') || subNameStr.includes('jean') || subSlugStr.includes('pant') || subNameStr.includes('pant') || pName.includes('jean') || pName.includes('pant')) &&
          !catSlug.includes('men') && !subSlugStr.includes('men')
        );
      }
      if (slug === 'skirts') {
        return subSlugStr.includes('skirt') || subNameStr.includes('skirt') || pName.includes('skirt');
      }
      if (slug === 'women-activewear') {
        return (
          catSlug.includes('gym') ||
          subSlugStr.includes('gym') ||
          subSlugStr.includes('workout') ||
          subSlugStr.includes('sport') ||
          subSlugStr.includes('legging') ||
          subSlugStr.includes('bras')
        );
      }
      if (slug === 'undergarments') {
        return (
          subSlugStr.includes('undergarment') ||
          subSlugStr.includes('sports-bras') ||
          subNameStr.includes('bra') ||
          pName.includes('bra') ||
          pName.includes('undergarment') ||
          pName.includes('lingerie')
        );
      }
      if (slug === 'jewellery-watches') {
        return (
          subSlugStr.includes('jewel') ||
          subNameStr.includes('jewel') ||
          subSlugStr.includes('watch') ||
          subNameStr.includes('watch') ||
          pName.includes('jewel') ||
          pName.includes('watch') ||
          subSlugStr.includes('bridal-accessories')
        );
      }
      if (slug === 'beauty-products') {
        return (
          subSlugStr.includes('beauty') ||
          subNameStr.includes('beauty') ||
          pName.includes('beauty') ||
          pName.includes('cosmetic') ||
          pName.includes('perfume') ||
          subSlugStr.includes('sunglasses')
        );
      }
      if (slug === 'handbags') {
        return subSlugStr.includes('bag') || subNameStr.includes('bag') || pName.includes('bag') || pName.includes('handbag');
      }
      if (slug === 'footwear') {
        return (
          subSlugStr.includes('foot') ||
          subSlugStr.includes('shoe') ||
          subNameStr.includes('foot') ||
          subNameStr.includes('shoe') ||
          pName.includes('shoe') ||
          pName.includes('heel') ||
          pName.includes('sandal') ||
          pName.includes('boot')
        );
      }
      if (slug === 'other-accessories') {
        return (
          (catSlug === 'accessories' || subSlugStr.includes('belt') || subSlugStr.includes('cap') || subSlugStr.includes('sunglass') || subSlugStr.includes('accessories')) &&
          !subSlugStr.includes('bag')
        );
      }
      return subSlugStr === slug || subNameStr.toLowerCase().includes(slug);
    }).length;
  };

  // Dynamically count products matching each Kids subcategory
  const getKidsSubCategoryCount = (slug) => {
    return products.filter((p) => {
      const catObj = typeof p.category === 'object' ? p.category : null;
      const catSlug = (catObj?.slug || p.category || '').toLowerCase().trim();
      const catName = (catObj?.name || '').toLowerCase().trim();
      const subObj = typeof p.subCategory === 'object' ? p.subCategory : null;
      const subSlugStr = (subObj?.slug || p.subCategory || '').toLowerCase().trim();
      const subNameStr = (subObj?.name || '').toLowerCase().trim();
      const pName = (p.name || '').toLowerCase().trim();

      if (slug === 'kids') {
        return (
          catSlug === 'kids' ||
          catSlug === 'kids-wear' ||
          catName.includes('kid') ||
          subSlugStr.includes('kid') ||
          subSlugStr.includes('baby') ||
          subSlugStr.includes('toddler') ||
          subSlugStr.includes('toy') ||
          subNameStr.includes('kid')
        );
      }
      if (slug === 'baby-boy-girl') {
        return (
          subSlugStr === 'baby-boy-girl' ||
          subSlugStr.includes('baby') ||
          subNameStr.includes('baby') ||
          pName.includes('baby')
        );
      }
      if (slug === 'toddler-boys') {
        return (
          subSlugStr === 'toddler-boys' ||
          (subSlugStr.includes('toddler') && (subSlugStr.includes('boy') || pName.includes('boy'))) ||
          subNameStr.includes('toddler boy') ||
          pName.includes('toddler boy')
        );
      }
      if (slug === 'toddler-girls') {
        return (
          subSlugStr === 'toddler-girls' ||
          (subSlugStr.includes('toddler') && (subSlugStr.includes('girl') || pName.includes('girl'))) ||
          subNameStr.includes('toddler girl') ||
          pName.includes('toddler girl')
        );
      }
      if (slug === 'kids-footwear') {
        return (
          subSlugStr === 'kids-footwear' ||
          ((subSlugStr.includes('footwear') || subSlugStr.includes('shoe') || pName.includes('shoe') || pName.includes('sneaker') || pName.includes('boot')) && (catSlug === 'kids' || subSlugStr.includes('kid') || subNameStr.includes('kid') || pName.includes('kid') || pName.includes('toddler') || pName.includes('baby')))
        );
      }
      if (slug === 'toys') {
        return (
          subSlugStr === 'toys' ||
          subSlugStr.includes('toy') ||
          subNameStr.includes('toy') ||
          pName.includes('toy') ||
          pName.includes('bear') ||
          pName.includes('lego') ||
          pName.includes('puzzle')
        );
      }
      return subSlugStr === slug || subNameStr.toLowerCase().includes(slug);
    }).length;
  };

  // Dynamically count products matching each Bridal subcategory
  const getBridalSubCategoryCount = (slug) => {
    return products.filter((p) => {
      const catObj = typeof p.category === 'object' ? p.category : null;
      const catSlug = (catObj?.slug || p.category || '').toLowerCase().trim();
      const subObj = typeof p.subCategory === 'object' ? p.subCategory : null;
      const subSlugStr = (subObj?.slug || p.subCategory || '').toLowerCase().trim();
      const subNameStr = (subObj?.name || '').toLowerCase().trim();
      const pName = (p.name || '').toLowerCase().trim();

      if (slug === 'bridal-wear') {
        return (
          catSlug.includes('bridal') ||
          subSlugStr.includes('bridal') ||
          subNameStr.includes('bridal') ||
          pName.includes('bridal') ||
          pName.includes('gown') ||
          pName.includes('bridesmaid') ||
          subSlugStr.includes('dress') ||
          pName.includes('dress') ||
          subSlugStr.includes('jewel') ||
          subSlugStr.includes('bag') ||
          subSlugStr.includes('foot') ||
          subSlugStr.includes('shoe')
        );
      }
      if (slug === 'bridal-gowns') {
        return (
          subSlugStr.includes('gown') ||
          subNameStr.includes('gown') ||
          pName.includes('gown') ||
          (pName.includes('bridal') && (pName.includes('dress') || subSlugStr.includes('dress')))
        );
      }
      if (slug === 'bridesmaid-dresses') {
        return (
          subSlugStr.includes('bridesmaid') ||
          subNameStr.includes('bridesmaid') ||
          pName.includes('bridesmaid') ||
          (pName.includes('dress') && (pName.includes('lace') || pName.includes('silk') || pName.includes('maxi') || pName.includes('gown')))
        );
      }
      if (slug === 'bridal-accessories') {
        return (
          subSlugStr.includes('bridal-accessories') ||
          (catSlug.includes('bridal') && subSlugStr.includes('jewel')) ||
          subSlugStr.includes('jewel') ||
          pName.includes('jewel') ||
          pName.includes('necklace') ||
          pName.includes('earring')
        );
      }
      if (slug === 'bridal-veils') {
        return (
          pName.includes('veil') ||
          pName.includes('tiara') ||
          subSlugStr.includes('veil') ||
          subNameStr.includes('veil') ||
          pName.includes('hair') ||
          subSlugStr.includes('cap')
        );
      }
      if (slug === 'bridal-bags') {
        return (
          subSlugStr.includes('bag') ||
          subNameStr.includes('bag') ||
          pName.includes('bag') ||
          pName.includes('clutch')
        );
      }
      if (slug === 'bridal-footwear') {
        return (
          subSlugStr.includes('foot') ||
          subSlugStr.includes('shoe') ||
          subNameStr.includes('shoe') ||
          pName.includes('heel') ||
          pName.includes('shoe') ||
          pName.includes('sandal')
        );
      }
      return subSlugStr === slug || subNameStr.toLowerCase().includes(slug);
    }).length;
  };

  // Dynamically count products matching each Gift & Fancy subcategory
  const getGiftFancySubCategoryCount = (slug) => {
    return products.filter((p) => {
      const catObj = typeof p.category === 'object' ? p.category : null;
      const catSlug = (catObj?.slug || p.category || '').toLowerCase().trim();
      const subObj = typeof p.subCategory === 'object' ? p.subCategory : null;
      const subSlugStr = (subObj?.slug || p.subCategory || '').toLowerCase().trim();
      const subNameStr = (subObj?.name || '').toLowerCase().trim();
      const pName = (p.name || '').toLowerCase().trim();

      if (slug === 'fancy-gift') {
        return (
          catSlug === 'accessories' ||
          subSlugStr.includes('jewel') ||
          subSlugStr.includes('watch') ||
          subSlugStr.includes('sunglass') ||
          subSlugStr.includes('belt') ||
          subSlugStr.includes('perfume') ||
          subSlugStr.includes('beauty') ||
          subSlugStr.includes('cap') ||
          pName.includes('gift') ||
          pName.includes('hamper') ||
          pName.includes('watch') ||
          pName.includes('sunglass') ||
          pName.includes('belt') ||
          pName.includes('jewel')
        );
      }
      if (slug === 'jewellery') {
        return (
          subSlugStr.includes('jewel') ||
          subNameStr.includes('jewel') ||
          pName.includes('jewel') ||
          pName.includes('watch') ||
          subSlugStr.includes('watch')
        );
      }
      if (slug === 'sunglasses') {
        return (
          subSlugStr.includes('sunglass') ||
          subNameStr.includes('sunglass') ||
          pName.includes('sunglass')
        );
      }
      if (slug === 'belts') {
        return (
          subSlugStr.includes('belt') ||
          subNameStr.includes('belt') ||
          pName.includes('belt') ||
          pName.includes('wallet')
        );
      }
      if (slug === 'beauty-products') {
        return (
          subSlugStr.includes('beauty') ||
          subNameStr.includes('beauty') ||
          pName.includes('beauty') ||
          pName.includes('perfume') ||
          pName.includes('scent')
        );
      }
      if (slug === 'caps') {
        return (
          subSlugStr.includes('cap') ||
          subNameStr.includes('cap') ||
          pName.includes('cap') ||
          pName.includes('hat')
        );
      }
      if (slug === 'gift-sets') {
        return (
          pName.includes('gift') ||
          pName.includes('hamper') ||
          pName.includes('set') ||
          subSlugStr.includes('gift') ||
          subSlugStr.includes('set')
        );
      }
      return subSlugStr === slug || subNameStr.toLowerCase().includes(slug);
    }).length;
  };

  // ── Filter by category / subcategory slug from URL ────────────────────────
  const slugFiltered = subSlug
    ? products.filter((p) => {
        const target = subSlug.toLowerCase().trim();

        const catObj = typeof p.category === 'object' ? p.category : null;
        const catSlug = (catObj?.slug || p.category || '').toLowerCase().trim();
        const catName = (catObj?.name || '').toLowerCase().trim();

        const subObj = typeof p.subCategory === 'object' ? p.subCategory : null;
        const subSlugStr = (subObj?.slug || p.subCategory || '').toLowerCase().trim();
        const subNameStr = (subObj?.name || '').toLowerCase().trim();
        const subId = (subObj?._id || '').toString().toLowerCase();
        const pName = (p.name || '').toLowerCase().trim();

        if (subId === target || subSlugStr === target || catSlug === target) return true;

        if (target === 'bridal-wear' || target === 'bridal') {
          return (
            catSlug.includes('bridal') ||
            subSlugStr.includes('bridal') ||
            subNameStr.includes('bridal') ||
            pName.includes('bridal') ||
            pName.includes('gown') ||
            pName.includes('bridesmaid') ||
            subSlugStr.includes('dress') ||
            pName.includes('dress') ||
            subSlugStr.includes('jewel') ||
            subSlugStr.includes('bag') ||
            subSlugStr.includes('foot') ||
            subSlugStr.includes('shoe')
          );
        }
        if (target === 'bridal-gowns') {
          return (
            subSlugStr.includes('gown') ||
            subNameStr.includes('gown') ||
            pName.includes('gown') ||
            (pName.includes('bridal') && (pName.includes('dress') || subSlugStr.includes('dress')))
          );
        }
        if (target === 'bridesmaid-dresses') {
          return (
            subSlugStr.includes('bridesmaid') ||
            subNameStr.includes('bridesmaid') ||
            pName.includes('bridesmaid') ||
            (pName.includes('dress') && (pName.includes('lace') || pName.includes('silk') || pName.includes('maxi') || pName.includes('gown')))
          );
        }
        if (target === 'bridal-accessories') {
          return (
            subSlugStr.includes('bridal-accessories') ||
            (catSlug.includes('bridal') && subSlugStr.includes('jewel')) ||
            subSlugStr.includes('jewel') ||
            pName.includes('jewel') ||
            pName.includes('necklace') ||
            pName.includes('earring')
          );
        }
        if (target === 'bridal-veils') {
          return (
            pName.includes('veil') ||
            pName.includes('tiara') ||
            subSlugStr.includes('veil') ||
            subNameStr.includes('veil') ||
            pName.includes('hair') ||
            subSlugStr.includes('cap')
          );
        }
        if (target === 'bridal-bags') {
          return (
            subSlugStr.includes('bag') ||
            subNameStr.includes('bag') ||
            pName.includes('bag') ||
            pName.includes('clutch')
          );
        }
        if (target === 'bridal-footwear') {
          return (
            subSlugStr.includes('foot') ||
            subSlugStr.includes('shoe') ||
            subNameStr.includes('shoe') ||
            pName.includes('heel') ||
            pName.includes('shoe') ||
            pName.includes('sandal')
          );
        }

        if (target === 'fancy-gift' || target === 'gift-fancy') {
          return (
            catSlug === 'accessories' ||
            subSlugStr.includes('jewel') ||
            subSlugStr.includes('watch') ||
            subSlugStr.includes('sunglass') ||
            subSlugStr.includes('belt') ||
            subSlugStr.includes('perfume') ||
            subSlugStr.includes('beauty') ||
            subSlugStr.includes('cap') ||
            pName.includes('gift') ||
            pName.includes('hamper') ||
            pName.includes('watch') ||
            pName.includes('sunglass') ||
            pName.includes('belt') ||
            pName.includes('jewel')
          );
        }
        if (target === 'gift-sets') {
          return (
            pName.includes('gift') ||
            pName.includes('hamper') ||
            pName.includes('set') ||
            subSlugStr.includes('gift') ||
            subSlugStr.includes('set')
          );
        }

        if (target === 'gents-wear' || target === 'mens') {
          return catSlug === 'mens' || subSlugStr.includes('men') || subNameStr.includes('men');
        }
        if (target === 'ladies-wear' || target === 'ladieswear' || target === 'women') {
          return (
            catSlug === 'women' ||
            catSlug === 'ladies-wear' ||
            catSlug === 'ladieswear' ||
            subSlugStr.includes('women') ||
            subNameStr.includes('women') ||
            subNameStr.includes('dress') ||
            subNameStr.includes('skirt') ||
            subSlugStr.includes('tops-blouses') ||
            subSlugStr.includes('womens-jeans') ||
            subSlugStr.includes('jackets-coats')
          );
        }
        if (target === 'dresses') {
          return (subSlugStr.includes('dress') || subNameStr.includes('dress') || pName.includes('dress')) && !catSlug.includes('kid') && !catSlug.includes('bridal');
        }
        if (target === 'blouses-tops' || target === 'tops-blouses') {
          return (
            (subSlugStr.includes('tops-blouses') ||
              subSlugStr.includes('blouse') ||
              subNameStr.includes('blouse') ||
              subNameStr.includes('tops') ||
              pName.includes('blouse') ||
              (pName.includes('top') && !subSlugStr.includes('workout-top') && !catSlug.includes('men'))) &&
            !catSlug.includes('men')
          );
        }
        if (target === 'pants-jeans' || target === 'womens-jeans') {
          return (
            (catSlug === 'women' || !catSlug.includes('men')) &&
            (subSlugStr.includes('jean') || subNameStr.includes('jean') || subSlugStr.includes('pant') || subNameStr.includes('pant') || pName.includes('jean') || pName.includes('pant')) &&
            !catSlug.includes('men') && !subSlugStr.includes('men')
          );
        }
        if (target === 'skirts') {
          return subSlugStr.includes('skirt') || subNameStr.includes('skirt') || pName.includes('skirt');
        }
        if (target === 'women-activewear' || (target === 'gym-activewear' && isWomenSection)) {
          return (
            catSlug.includes('gym') ||
            subSlugStr.includes('gym') ||
            subSlugStr.includes('workout') ||
            subSlugStr.includes('sport') ||
            subSlugStr.includes('legging') ||
            subSlugStr.includes('bras')
          );
        }
        if (target === 'undergarments') {
          return (
            subSlugStr.includes('undergarment') ||
            subSlugStr.includes('sports-bras') ||
            subNameStr.includes('bra') ||
            pName.includes('bra') ||
            pName.includes('undergarment') ||
            pName.includes('lingerie')
          );
        }
        if (target === 'jewellery-watches') {
          return (
            subSlugStr.includes('jewel') ||
            subNameStr.includes('jewel') ||
            subSlugStr.includes('watch') ||
            subNameStr.includes('watch') ||
            pName.includes('jewel') ||
            pName.includes('watch') ||
            subSlugStr.includes('bridal-accessories')
          );
        }
        if (target === 'beauty-products') {
          return (
            subSlugStr.includes('beauty') ||
            subNameStr.includes('beauty') ||
            pName.includes('beauty') ||
            pName.includes('cosmetic') ||
            pName.includes('perfume') ||
            subSlugStr.includes('sunglasses')
          );
        }
        if (target === 'handbags') {
          return subSlugStr.includes('bag') || subNameStr.includes('bag') || pName.includes('bag') || pName.includes('handbag');
        }
        if (target === 'other-accessories') {
          return (
            (catSlug === 'accessories' || subSlugStr.includes('belt') || subSlugStr.includes('cap') || subSlugStr.includes('sunglass') || subSlugStr.includes('accessories')) &&
            !subSlugStr.includes('bag')
          );
        }
        if (target === 'kids-wear' || target === 'kids') {
          return (
            catSlug === 'kids' ||
            catSlug === 'kids-wear' ||
            catName.includes('kid') ||
            subSlugStr.includes('kid') ||
            subSlugStr.includes('baby') ||
            subSlugStr.includes('toddler') ||
            subSlugStr.includes('toy') ||
            subNameStr.includes('kid')
          );
        }
        if (target === 'baby-boy-girl') {
          return (
            subSlugStr === 'baby-boy-girl' ||
            subSlugStr.includes('baby') ||
            subNameStr.includes('baby') ||
            pName.includes('baby')
          );
        }
        if (target === 'toddler-boys') {
          return (
            subSlugStr === 'toddler-boys' ||
            (subSlugStr.includes('toddler') && (subSlugStr.includes('boy') || pName.includes('boy'))) ||
            subNameStr.includes('toddler boy') ||
            pName.includes('toddler boy')
          );
        }
        if (target === 'toddler-girls') {
          return (
            subSlugStr === 'toddler-girls' ||
            (subSlugStr.includes('toddler') && (subSlugStr.includes('girl') || pName.includes('girl'))) ||
            subNameStr.includes('toddler girl') ||
            pName.includes('toddler girl')
          );
        }
        if (target === 'kids-footwear') {
          return (
            subSlugStr === 'kids-footwear' ||
            ((subSlugStr.includes('footwear') || subSlugStr.includes('shoe') || pName.includes('shoe') || pName.includes('sneaker') || pName.includes('boot')) && (catSlug === 'kids' || subSlugStr.includes('kid') || subNameStr.includes('kid') || pName.includes('kid') || pName.includes('toddler') || pName.includes('baby')))
          );
        }
        if (target === 'toys') {
          return (
            subSlugStr === 'toys' ||
            subSlugStr.includes('toy') ||
            subNameStr.includes('toy') ||
            pName.includes('toy') ||
            pName.includes('bear') ||
            pName.includes('lego') ||
            pName.includes('puzzle')
          );
        }
        if (target === 'accessories') {
          return (
            catSlug === 'accessories' ||
            subSlugStr.includes('bag') ||
            subSlugStr.includes('belt') ||
            subSlugStr.includes('cap') ||
            subSlugStr.includes('sunglass') ||
            subSlugStr.includes('jewel')
          );
        }
        if (target === 'shirts' || target === 'mens-shirts') {
          return (
            (subSlugStr.includes('shirt') || subNameStr.includes('shirt')) &&
            !subSlugStr.includes('t-shirt') &&
            !subNameStr.includes('t-shirt') &&
            !subSlugStr.includes('tshirt')
          );
        }
        if (target === 't-shirts' || target === "t'shirts" || target === 'tshirts' || target === 'mens-t-shirts') {
          return (
            subSlugStr.includes('t-shirt') ||
            subNameStr.includes('t-shirt') ||
            subSlugStr.includes('tshirt') ||
            subNameStr.includes('tshirt')
          );
        }
        if (target === 'jeans' || target === 'mens-jeans') {
          return (
            (catSlug === 'mens' || subSlugStr.includes('men')) &&
            (subSlugStr.includes('jean') || subNameStr.includes('jean'))
          );
        }
        if (target === 'trousers' || target === 'mens-trousers') {
          return subSlugStr.includes('trouser') || subNameStr.includes('trouser');
        }
        if (target === 'suits-blazers' || target === 'suits') {
          return (
            subSlugStr.includes('suit') ||
            subNameStr.includes('suit') ||
            subSlugStr.includes('blazer') ||
            subNameStr.includes('blazer')
          );
        }
        if (target === 'gym-wears' || target === 'gym-wear' || target === 'gym-activewear') {
          return (
            catSlug.includes('gym') ||
            subSlugStr.includes('gym') ||
            subSlugStr.includes('workout') ||
            subSlugStr.includes('sport') ||
            subSlugStr.includes('legging')
          );
        }
        if (target === 'belts-caps' || target === 'belts-and-caps') {
          return (
            subSlugStr.includes('belt') ||
            subSlugStr.includes('cap') ||
            subNameStr.includes('belt') ||
            subNameStr.includes('cap')
          );
        }
        if (target === 'jewellery' || target === 'bridal-accessories') {
          return (
            subSlugStr.includes('jewel') ||
            subSlugStr.includes('accessories') ||
            subNameStr.includes('jewel') ||
            subNameStr.includes('accessories')
          );
        }
        if (target === 'footwear') {
          return subSlugStr.includes('foot') || subSlugStr.includes('shoe') || subNameStr.includes('shoe');
        }
        if (target === 'caps' || target === 'belts' || target === 'bags' || target === 'bridal-wear' || target === 'sunglasses') {
          return subSlugStr.includes(target) || catSlug.includes(target) || subNameStr.toLowerCase().includes(target);
        }

        return subSlugStr === target || catSlug === target || subNameStr.includes(target);
      })
    : products;

  // ── Apply UI filters on top of slug filter ─────────────────────
  const filtered = slugFiltered.filter((p) => {
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
    if (isSortNewest || selectedSort === 'Newest First' || selectedSort === 'Newest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
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

  // Responsive grid columns adapted for sidebar
  const hasSidebar = isMensSection || isWomenSection || isKidsSection || isBridalSection || isGiftFancySection;
  const colClass = hasSidebar
    ? cols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    : cols === 2
    ? 'grid-cols-1 sm:grid-cols-2'
    : cols === 3
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : cols === 4
    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';

  return (
    <div className={`w-full bg-transparent min-h-screen font-didot transition-colors duration-300 ${
      isAvroraTheme ? 'text-slate-100' : 'text-slate-900'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 pt-6 pb-20">

        {/* ── Page Header / Breadcrumb (Bridalwears & Accessories) ────────── */}
        {isBridalSection && (
          <div className="mb-6 pb-4 border-b border-cyan-500/15 dark:border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-poppins text-cyan-400 mb-1.5">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight size={12} className="opacity-60" />
                <Link href="/products/bridal-wear" className="hover:underline">Bridalwears & Accessories</Link>
                {activeBridalSubCategory.slug !== 'bridal-wear' && (
                  <>
                    <ChevronRight size={12} className="opacity-60" />
                    <span className={isAvroraTheme ? 'text-white' : 'text-slate-900 font-bold'}>
                      {activeBridalSubCategory.name}
                    </span>
                  </>
                )}
              </div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide uppercase font-cinzel ${
                isAvroraTheme ? 'text-white' : 'text-slate-900'
              }`}>
                {activeBridalSubCategory.slug === 'bridal-wear' ? "Bridal & Accessories Collection" : activeBridalSubCategory.name}
              </h1>
            </div>

            <p className={`text-xs tracking-wider uppercase ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
              Showing <span className="font-bold text-cyan-400">{sorted.length}</span> pieces
            </p>
          </div>
        )}

        {/* ── Page Header / Breadcrumb (Gift & Fancy Items) ───────────────── */}
        {isGiftFancySection && (
          <div className="mb-6 pb-4 border-b border-cyan-500/15 dark:border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-poppins text-cyan-400 mb-1.5">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight size={12} className="opacity-60" />
                <Link href="/products/fancy-gift" className="hover:underline">Gift & Fancy Items</Link>
                {activeGiftFancySubCategory.slug !== 'fancy-gift' && (
                  <>
                    <ChevronRight size={12} className="opacity-60" />
                    <span className={isAvroraTheme ? 'text-white' : 'text-slate-900 font-bold'}>
                      {activeGiftFancySubCategory.name}
                    </span>
                  </>
                )}
              </div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide uppercase font-cinzel ${
                isAvroraTheme ? 'text-white' : 'text-slate-900'
              }`}>
                {activeGiftFancySubCategory.slug === 'fancy-gift' ? "Gift & Fancy Collection" : activeGiftFancySubCategory.name}
              </h1>
            </div>

            <p className={`text-xs tracking-wider uppercase ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
              Showing <span className="font-bold text-cyan-400">{sorted.length}</span> pieces
            </p>
          </div>
        )}

        {/* ── Page Header / Breadcrumb (Enhanced for Kids) ────────────────── */}
        {isKidsSection && (
          <div className="mb-6 pb-4 border-b border-cyan-500/15 dark:border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-poppins text-cyan-400 mb-1.5">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight size={12} className="opacity-60" />
                <Link href="/products/kids" className="hover:underline">Kids</Link>
                {activeKidsSubCategory.slug !== 'kids' && (
                  <>
                    <ChevronRight size={12} className="opacity-60" />
                    <span className={isAvroraTheme ? 'text-white' : 'text-slate-900 font-bold'}>
                      {activeKidsSubCategory.name}
                    </span>
                  </>
                )}
              </div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide uppercase font-cinzel ${
                isAvroraTheme ? 'text-white' : 'text-slate-900'
              }`}>
                {activeKidsSubCategory.slug === 'kids' ? "Kids Collection" : activeKidsSubCategory.name}
              </h1>
            </div>

            <p className={`text-xs tracking-wider uppercase ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
              Showing <span className="font-bold text-cyan-400">{sorted.length}</span> pieces
            </p>
          </div>
        )}

        {/* ── Page Header / Breadcrumb (Enhanced for Womenswear) ──────────── */}
        {isWomenSection && (
          <div className="mb-6 pb-4 border-b border-cyan-500/15 dark:border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-poppins text-cyan-400 mb-1.5">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight size={12} className="opacity-60" />
                <Link href="/products/women" className="hover:underline">Women</Link>
                {activeWomenSubCategory.slug !== 'women' && (
                  <>
                    <ChevronRight size={12} className="opacity-60" />
                    <span className={isAvroraTheme ? 'text-white' : 'text-slate-900 font-bold'}>
                      {activeWomenSubCategory.name}
                    </span>
                  </>
                )}
              </div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide uppercase font-cinzel ${
                isAvroraTheme ? 'text-white' : 'text-slate-900'
              }`}>
                {activeWomenSubCategory.slug === 'women' ? "Women's Collection" : activeWomenSubCategory.name}
              </h1>
            </div>

            <p className={`text-xs tracking-wider uppercase ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
              Showing <span className="font-bold text-cyan-400">{sorted.length}</span> pieces
            </p>
          </div>
        )}

        {/* ── Page Header / Breadcrumb (Enhanced for Menswear) ────────────── */}
        {isMensSection && (
          <div className="mb-6 pb-4 border-b border-cyan-500/15 dark:border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-poppins text-cyan-400 mb-1.5">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight size={12} className="opacity-60" />
                <Link href="/products/mens" className="hover:underline">Mens</Link>
                {activeMensSubCategory.slug !== 'mens' && (
                  <>
                    <ChevronRight size={12} className="opacity-60" />
                    <span className={isAvroraTheme ? 'text-white' : 'text-slate-900 font-bold'}>
                      {activeMensSubCategory.name}
                    </span>
                  </>
                )}
              </div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide uppercase font-cinzel ${
                isAvroraTheme ? 'text-white' : 'text-slate-900'
              }`}>
                {activeMensSubCategory.slug === 'mens' ? "Men's Collection" : activeMensSubCategory.name}
              </h1>
            </div>

            <p className={`text-xs tracking-wider uppercase ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
              Showing <span className="font-bold text-cyan-400">{sorted.length}</span> pieces
            </p>
          </div>
        )}

        {/* ── Mobile Horizontal Chip Bar for Bridal Subcategories ─────────── */}
        {isBridalSection && (
          <div className="md:hidden mb-5 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1.5">
            {BRIDAL_SUBCATEGORIES.map((sub) => {
              const active = isBridalSubActive(sub);
              return (
                <button
                  key={sub.slug}
                  onClick={() => {
                    navigate(sub.path, { state: { fromCategory: 'bridal-accessories' } });
                    setCurrentPage(1);
                  }}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? isAvroraTheme
                        ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)] font-bold'
                        : 'bg-slate-900 text-white shadow-sm font-bold'
                      : isAvroraTheme
                      ? 'bg-white/5 border border-cyan-500/25 text-slate-200 hover:bg-white/10'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sub.image && (
                    <img src={sub.image} alt={sub.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                  )}
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Mobile Horizontal Chip Bar for Gift & Fancy Subcategories ───── */}
        {isGiftFancySection && (
          <div className="md:hidden mb-5 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1.5">
            {GIFT_FANCY_SUBCATEGORIES.map((sub) => {
              const active = isGiftFancySubActive(sub);
              return (
                <button
                  key={sub.slug}
                  onClick={() => {
                    navigate(sub.path, { state: { fromCategory: 'gift-fancy' } });
                    setCurrentPage(1);
                  }}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? isAvroraTheme
                        ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)] font-bold'
                        : 'bg-slate-900 text-white shadow-sm font-bold'
                      : isAvroraTheme
                      ? 'bg-white/5 border border-cyan-500/25 text-slate-200 hover:bg-white/10'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sub.image && (
                    <img src={sub.image} alt={sub.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                  )}
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Mobile Horizontal Chip Bar for Kids Subcategories ───────────── */}
        {isKidsSection && (
          <div className="md:hidden mb-5 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1.5">
            {KIDS_SUBCATEGORIES.map((sub) => {
              const active = isKidsSubActive(sub);
              return (
                <button
                  key={sub.slug}
                  onClick={() => {
                    navigate(sub.path);
                    setCurrentPage(1);
                  }}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? isAvroraTheme
                        ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)] font-bold'
                        : 'bg-slate-900 text-white shadow-sm font-bold'
                      : isAvroraTheme
                      ? 'bg-white/5 border border-cyan-500/25 text-slate-200 hover:bg-white/10'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sub.image && (
                    <img src={sub.image} alt={sub.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                  )}
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Mobile Horizontal Chip Bar for Women Subcategories ──────────── */}
        {isWomenSection && (
          <div className="md:hidden mb-5 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1.5">
            {WOMEN_SUBCATEGORIES.map((sub) => {
              const active = isWomenSubActive(sub);
              return (
                <button
                  key={sub.slug}
                  onClick={() => {
                    navigate(sub.path);
                    setCurrentPage(1);
                  }}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? isAvroraTheme
                        ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)] font-bold'
                        : 'bg-slate-900 text-white shadow-sm font-bold'
                      : isAvroraTheme
                      ? 'bg-white/5 border border-cyan-500/25 text-slate-200 hover:bg-white/10'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sub.image && (
                    <img src={sub.image} alt={sub.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                  )}
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Mobile Horizontal Chip Bar for Mens Subcategories ───────────── */}
        {isMensSection && (
          <div className="md:hidden mb-5 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1.5">
            {MENS_SUBCATEGORIES.map((sub) => {
              const active = isMensSubActive(sub);
              return (
                <button
                  key={sub.slug}
                  onClick={() => {
                    navigate(sub.path);
                    setCurrentPage(1);
                  }}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? isAvroraTheme
                        ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)] font-bold'
                        : 'bg-slate-900 text-white shadow-sm font-bold'
                      : isAvroraTheme
                      ? 'bg-white/5 border border-cyan-500/25 text-slate-200 hover:bg-white/10'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sub.image && (
                    <img src={sub.image} alt={sub.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                  )}
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Two Column Main Container: Left Sidebar + Right Products Grid ── */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

          {/* ── Left Side: Bridalwears & Accessories Subcategories Sidebar ── */}
          {isBridalSection && (
            <aside className="w-full md:w-60 lg:w-64 shrink-0 md:sticky md:top-24 z-10 hidden md:block">
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isAvroraTheme
                    ? 'bg-[#09021e]/85 backdrop-blur-2xl border-cyan-500/30 text-white shadow-[0_10px_30px_rgba(6,182,212,0.18)]'
                    : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                {/* Sidebar Header */}
                <div className="pb-3 mb-3 border-b border-cyan-500/20 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-cyan-400" />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-[0.18em] font-poppins text-cyan-400">
                        CATEGORIES
                      </h3>
                      <p className={`text-[10px] tracking-wider uppercase mt-0.5 ${
                        isAvroraTheme ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Bridal & Accessories
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {BRIDAL_SUBCATEGORIES.length - 1} types
                  </span>
                </div>

                {/* Subcategories Buttons List */}
                <nav className="space-y-1">
                  {BRIDAL_SUBCATEGORIES.map((sub) => {
                    const active = isBridalSubActive(sub);
                    const count = getBridalSubCategoryCount(sub.slug);

                    return (
                      <button
                        key={sub.slug}
                        onClick={() => {
                          navigate(sub.path, { state: { fromCategory: 'bridal-accessories' } });
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12.5px] transition-all cursor-pointer group text-left ${
                          active
                            ? isAvroraTheme
                              ? 'bg-gradient-to-r from-cyan-500/25 via-teal-500/15 to-transparent border-l-4 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                              : 'bg-slate-900 text-white font-semibold shadow-xs border-l-4 border-slate-900'
                            : isAvroraTheme
                            ? 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {sub.image ? (
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className={`w-6 h-6 rounded-lg object-cover shrink-0 transition-transform ${
                                active ? 'ring-1 ring-cyan-400 scale-105' : 'group-hover:scale-105 opacity-85'
                              }`}
                            />
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                active
                                  ? 'bg-cyan-400/25 text-cyan-300 font-bold'
                                  : 'bg-white/10 text-slate-400 group-hover:text-cyan-300'
                              }`}
                            >
                              <Sparkles size={12} />
                            </div>
                          )}
                          <span className="truncate">{sub.name}</span>
                        </div>

                        {count > 0 && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1.5 transition-colors ${
                              active
                                ? isAvroraTheme
                                  ? 'bg-cyan-400/30 text-cyan-200'
                                  : 'bg-white/20 text-white'
                                : isAvroraTheme
                                ? 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}

          {/* ── Left Side: Gift & Fancy Items Subcategories Sidebar ── */}
          {isGiftFancySection && (
            <aside className="w-full md:w-60 lg:w-64 shrink-0 md:sticky md:top-24 z-10 hidden md:block">
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isAvroraTheme
                    ? 'bg-[#09021e]/85 backdrop-blur-2xl border-cyan-500/30 text-white shadow-[0_10px_30px_rgba(6,182,212,0.18)]'
                    : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                {/* Sidebar Header */}
                <div className="pb-3 mb-3 border-b border-cyan-500/20 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-cyan-400" />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-[0.18em] font-poppins text-cyan-400">
                        CATEGORIES
                      </h3>
                      <p className={`text-[10px] tracking-wider uppercase mt-0.5 ${
                        isAvroraTheme ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Gift & Fancy Items
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {GIFT_FANCY_SUBCATEGORIES.length - 1} types
                  </span>
                </div>

                {/* Subcategories Buttons List */}
                <nav className="space-y-1">
                  {GIFT_FANCY_SUBCATEGORIES.map((sub) => {
                    const active = isGiftFancySubActive(sub);
                    const count = getGiftFancySubCategoryCount(sub.slug);

                    return (
                      <button
                        key={sub.slug}
                        onClick={() => {
                          navigate(sub.path, { state: { fromCategory: 'gift-fancy' } });
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12.5px] transition-all cursor-pointer group text-left ${
                          active
                            ? isAvroraTheme
                              ? 'bg-gradient-to-r from-cyan-500/25 via-teal-500/15 to-transparent border-l-4 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                              : 'bg-slate-900 text-white font-semibold shadow-xs border-l-4 border-slate-900'
                            : isAvroraTheme
                            ? 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {sub.image ? (
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className={`w-6 h-6 rounded-lg object-cover shrink-0 transition-transform ${
                                active ? 'ring-1 ring-cyan-400 scale-105' : 'group-hover:scale-105 opacity-85'
                              }`}
                            />
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                active
                                  ? 'bg-cyan-400/25 text-cyan-300 font-bold'
                                  : 'bg-white/10 text-slate-400 group-hover:text-cyan-300'
                              }`}
                            >
                              <Sparkles size={12} />
                            </div>
                          )}
                          <span className="truncate">{sub.name}</span>
                        </div>

                        {count > 0 && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1.5 transition-colors ${
                              active
                                ? isAvroraTheme
                                  ? 'bg-cyan-400/30 text-cyan-200'
                                  : 'bg-white/20 text-white'
                                : isAvroraTheme
                                ? 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}
          
          {/* ── Left Side: Kids Subcategories Sidebar ── */}
          {isKidsSection && (
            <aside className="w-full md:w-60 lg:w-64 shrink-0 md:sticky md:top-24 z-10 hidden md:block">
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isAvroraTheme
                    ? 'bg-[#09021e]/85 backdrop-blur-2xl border-cyan-500/30 text-white shadow-[0_10px_30px_rgba(6,182,212,0.18)]'
                    : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                {/* Sidebar Header */}
                <div className="pb-3 mb-3 border-b border-cyan-500/20 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-cyan-400" />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-[0.18em] font-poppins text-cyan-400">
                        CATEGORIES
                      </h3>
                      <p className={`text-[10px] tracking-wider uppercase mt-0.5 ${
                        isAvroraTheme ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Kids Wear
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {KIDS_SUBCATEGORIES.length - 1} types
                  </span>
                </div>

                {/* Subcategories Buttons List */}
                <nav className="space-y-1">
                  {KIDS_SUBCATEGORIES.map((sub) => {
                    const active = isKidsSubActive(sub);
                    const count = getKidsSubCategoryCount(sub.slug);

                    return (
                      <button
                        key={sub.slug}
                        onClick={() => {
                          navigate(sub.path);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12.5px] transition-all cursor-pointer group text-left ${
                          active
                            ? isAvroraTheme
                              ? 'bg-gradient-to-r from-cyan-500/25 via-teal-500/15 to-transparent border-l-4 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                              : 'bg-slate-900 text-white font-semibold shadow-xs border-l-4 border-slate-900'
                            : isAvroraTheme
                            ? 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {sub.image ? (
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className={`w-6 h-6 rounded-lg object-cover shrink-0 transition-transform ${
                                active ? 'ring-1 ring-cyan-400 scale-105' : 'group-hover:scale-105 opacity-85'
                              }`}
                            />
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                active
                                  ? 'bg-cyan-400/25 text-cyan-300 font-bold'
                                  : 'bg-white/10 text-slate-400 group-hover:text-cyan-300'
                              }`}
                            >
                              <Sparkles size={12} />
                            </div>
                          )}
                          <span className="truncate">{sub.name}</span>
                        </div>

                        {count > 0 && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1.5 transition-colors ${
                              active
                                ? isAvroraTheme
                                  ? 'bg-cyan-400/30 text-cyan-200'
                                  : 'bg-white/20 text-white'
                                : isAvroraTheme
                                ? 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}

          {/* ── Left Side: Women Subcategories Sidebar ── */}
          {isWomenSection && (
            <aside className="w-full md:w-60 lg:w-64 shrink-0 md:sticky md:top-24 z-10 hidden md:block">
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isAvroraTheme
                    ? 'bg-[#09021e]/85 backdrop-blur-2xl border-cyan-500/30 text-white shadow-[0_10px_30px_rgba(6,182,212,0.18)]'
                    : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                {/* Sidebar Header */}
                <div className="pb-3 mb-3 border-b border-cyan-500/20 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-cyan-400" />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-[0.18em] font-poppins text-cyan-400">
                        CATEGORIES
                      </h3>
                      <p className={`text-[10px] tracking-wider uppercase mt-0.5 ${
                        isAvroraTheme ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Women's Wear
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {WOMEN_SUBCATEGORIES.length - 1} types
                  </span>
                </div>

                {/* Subcategories Buttons List */}
                <nav className="space-y-1">
                  {WOMEN_SUBCATEGORIES.map((sub) => {
                    const active = isWomenSubActive(sub);
                    const count = getWomenSubCategoryCount(sub.slug);

                    return (
                      <button
                        key={sub.slug}
                        onClick={() => {
                          navigate(sub.path);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12.5px] transition-all cursor-pointer group text-left ${
                          active
                            ? isAvroraTheme
                              ? 'bg-gradient-to-r from-cyan-500/25 via-teal-500/15 to-transparent border-l-4 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                              : 'bg-slate-900 text-white font-semibold shadow-xs border-l-4 border-slate-900'
                            : isAvroraTheme
                            ? 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {sub.image ? (
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className={`w-6 h-6 rounded-lg object-cover shrink-0 transition-transform ${
                                active ? 'ring-1 ring-cyan-400 scale-105' : 'group-hover:scale-105 opacity-85'
                              }`}
                            />
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                active
                                  ? 'bg-cyan-400/25 text-cyan-300 font-bold'
                                  : 'bg-white/10 text-slate-400 group-hover:text-cyan-300'
                              }`}
                            >
                              <Sparkles size={12} />
                            </div>
                          )}
                          <span className="truncate">{sub.name}</span>
                        </div>

                        {count > 0 && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1.5 transition-colors ${
                              active
                                ? isAvroraTheme
                                  ? 'bg-cyan-400/30 text-cyan-200'
                                  : 'bg-white/20 text-white'
                                : isAvroraTheme
                                ? 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}

          {/* ── Left Side: Mens Subcategories Sidebar ("Chuti Section Ekak") ── */}
          {isMensSection && (
            <aside className="w-full md:w-60 lg:w-64 shrink-0 md:sticky md:top-24 z-10 hidden md:block">
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isAvroraTheme
                    ? 'bg-[#09021e]/85 backdrop-blur-2xl border-cyan-500/30 text-white shadow-[0_10px_30px_rgba(6,182,212,0.18)]'
                    : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                {/* Sidebar Header */}
                <div className="pb-3 mb-3 border-b border-cyan-500/20 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-cyan-400" />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-[0.18em] font-poppins text-cyan-400">
                        CATEGORIES
                      </h3>
                      <p className={`text-[10px] tracking-wider uppercase mt-0.5 ${
                        isAvroraTheme ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Men's Wear
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {MENS_SUBCATEGORIES.length - 1} types
                  </span>
                </div>

                {/* Subcategories Buttons List */}
                <nav className="space-y-1">
                  {MENS_SUBCATEGORIES.map((sub) => {
                    const active = isMensSubActive(sub);
                    const count = getMensSubCategoryCount(sub.slug);

                    return (
                      <button
                        key={sub.slug}
                        onClick={() => {
                          navigate(sub.path);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12.5px] transition-all cursor-pointer group text-left ${
                          active
                            ? isAvroraTheme
                              ? 'bg-gradient-to-r from-cyan-500/25 via-teal-500/15 to-transparent border-l-4 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                              : 'bg-slate-900 text-white font-semibold shadow-xs border-l-4 border-slate-900'
                            : isAvroraTheme
                            ? 'text-slate-300 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {sub.image ? (
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className={`w-6 h-6 rounded-lg object-cover shrink-0 transition-transform ${
                                active ? 'ring-1 ring-cyan-400 scale-105' : 'group-hover:scale-105 opacity-85'
                              }`}
                            />
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                active
                                  ? 'bg-cyan-400/25 text-cyan-300 font-bold'
                                  : 'bg-white/10 text-slate-400 group-hover:text-cyan-300'
                              }`}
                            >
                              <Sparkles size={12} />
                            </div>
                          )}
                          <span className="truncate">{sub.name}</span>
                        </div>

                        {count > 0 && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-1.5 transition-colors ${
                              active
                                ? isAvroraTheme
                                  ? 'bg-cyan-400/30 text-cyan-200'
                                  : 'bg-white/20 text-white'
                                : isAvroraTheme
                                ? 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>
          )}

          {/* ── Right Side: Toolbar + Products Grid ────────────────────────── */}
          <div className="flex-1 w-full min-w-0">
            <ProductListToolbar
              pageId={isKidsSection ? 'kids' : isWomenSection ? 'women' : isMensSection ? 'mens' : 'products'}
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

            {/* ── Product Grid ────────────────────────────────────────────── */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                  isAvroraTheme ? 'border-cyan-400' : 'border-slate-900'
                }`} />
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className={`text-lg font-light mb-4 ${isAvroraTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  No products found matching your criteria.
                </p>
                {hasActiveFilters ? (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 rounded-full border border-cyan-400 text-cyan-400 text-xs font-semibold uppercase tracking-wider hover:bg-cyan-400 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    Clear all filters
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(isKidsSection ? '/products/kids' : isWomenSection ? '/products/women' : '/products/mens')}
                    className="px-6 py-2 rounded-full border border-cyan-400 text-cyan-400 text-xs font-semibold uppercase tracking-wider hover:bg-cyan-400 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    {isKidsSection ? "View All Kids Wear" : isWomenSection ? "View All Ladieswear" : "View All Men's Wear"}
                  </button>
                )}
              </div>
            ) : (
              <div key={gridKey} className={`grid ${colClass} gap-5 lg:gap-6 animate-grid-in`}>
                {paginatedProducts.map((product, i) => (
                  <div
                    key={product._id}
                    className="animate-card-up"
                    style={{ animationDelay: `${i * 35}ms` }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            )}

            {/* ── Pagination ───────────────────────────────────────────────── */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                {/* Prev */}
                <button
                  id="products-page-prev"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:border-slate-800 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
                >
                  ‹
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    id={`products-page-${page}`}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? isAvroraTheme
                          ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-900 text-white font-bold'
                        : 'border border-slate-300 text-slate-600 hover:border-slate-800 hover:text-slate-900'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  id="products-page-next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:border-slate-800 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductsPage;
