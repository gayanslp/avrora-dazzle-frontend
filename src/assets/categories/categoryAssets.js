// Helper module to resolve asset paths for categories and subcategories

export const getSubcategoryImagePath = (categorySlug, subcategorySlug, imageNumber = 1) => {
  return `/assets/categories/${categorySlug}/${subcategorySlug}/image-${imageNumber}.jpg`;
};

export const getSubcategoryImagesList = (categorySlug, subcategorySlug, count = 10) => {
  const list = [];
  for (let i = 1; i <= count; i++) {
    list.push(`/assets/categories/${categorySlug}/${subcategorySlug}/image-${i}.jpg`);
  }
  return list;
};

// Fallback Mock Subcategories with 10 linked asset images for each subcategory
export const mockSubCategoriesWithAssets = [
  // Women / Ladies Wear
  {
    _id: 'sub-women-dresses',
    name: 'Dresses',
    slug: 'dresses',
    mainCategory: { _id: 'cat-women', name: 'Ladies Wear', slug: 'women' },
    image: '/assets/categories/women/dresses/image-1.jpg',
    images: getSubcategoryImagesList('women', 'dresses', 10)
  },
  {
    _id: 'sub-women-skirts',
    name: 'Skirts',
    slug: 'skirts',
    mainCategory: { _id: 'cat-women', name: 'Ladies Wear', slug: 'women' },
    image: '/assets/categories/women/skirts/image-1.jpg',
    images: getSubcategoryImagesList('women', 'skirts', 10)
  },
  {
    _id: 'sub-women-jeans',
    name: "Women's Jeans",
    slug: 'womens-jeans',
    mainCategory: { _id: 'cat-women', name: 'Ladies Wear', slug: 'women' },
    image: '/assets/categories/women/womens-jeans/image-1.jpg',
    images: getSubcategoryImagesList('women', 'womens-jeans', 10)
  },
  {
    _id: 'sub-women-tops',
    name: 'Tops & Blouses',
    slug: 'tops-blouses',
    mainCategory: { _id: 'cat-women', name: 'Ladies Wear', slug: 'women' },
    image: '/assets/categories/women/tops-blouses/image-1.jpg',
    images: getSubcategoryImagesList('women', 'tops-blouses', 10)
  },
  {
    _id: 'sub-women-jackets',
    name: 'Jackets & Coats',
    slug: 'jackets-coats',
    mainCategory: { _id: 'cat-women', name: 'Ladies Wear', slug: 'women' },
    image: '/assets/categories/women/jackets-coats/image-1.jpg',
    images: getSubcategoryImagesList('women', 'jackets-coats', 10)
  },

  // Mens / Gents Wear
  {
    _id: 'sub-mens-shirts',
    name: "Men's Shirts",
    slug: 'mens-shirts',
    mainCategory: { _id: 'cat-mens', name: 'Gents Wear', slug: 'mens' },
    image: '/assets/categories/mens/mens-shirts/image-1.jpg',
    images: getSubcategoryImagesList('mens', 'mens-shirts', 10)
  },
  {
    _id: 'sub-mens-tshirts',
    name: "Men's T-Shirts",
    slug: 'mens-t-shirts',
    mainCategory: { _id: 'cat-mens', name: 'Gents Wear', slug: 'mens' },
    image: '/assets/categories/mens/mens-t-shirts/image-1.jpg',
    images: getSubcategoryImagesList('mens', 'mens-t-shirts', 10)
  },
  {
    _id: 'sub-mens-jeans',
    name: "Men's Jeans",
    slug: 'mens-jeans',
    mainCategory: { _id: 'cat-mens', name: 'Gents Wear', slug: 'mens' },
    image: '/assets/categories/mens/mens-jeans/image-1.jpg',
    images: getSubcategoryImagesList('mens', 'mens-jeans', 10)
  },
  {
    _id: 'sub-mens-trousers',
    name: "Men's Trousers",
    slug: 'mens-trousers',
    mainCategory: { _id: 'cat-mens', name: 'Gents Wear', slug: 'mens' },
    image: '/assets/categories/mens/mens-trousers/image-1.jpg',
    images: getSubcategoryImagesList('mens', 'mens-trousers', 10)
  },
  {
    _id: 'sub-mens-suits',
    name: 'Suits & Blazers',
    slug: 'suits-blazers',
    mainCategory: { _id: 'cat-mens', name: 'Gents Wear', slug: 'mens' },
    image: '/assets/categories/mens/suits-blazers/image-1.jpg',
    images: getSubcategoryImagesList('mens', 'suits-blazers', 10)
  },

  // Kids
  {
    _id: 'sub-kids-tshirts',
    name: 'Kids T-Shirts',
    slug: 'kids-t-shirts',
    mainCategory: { _id: 'cat-kids', name: 'Kids Wear', slug: 'kids' },
    image: '/assets/categories/kids/kids-t-shirts/image-1.jpg',
    images: getSubcategoryImagesList('kids', 'kids-t-shirts', 10)
  },
  {
    _id: 'sub-kids-dresses',
    name: 'Kids Dresses',
    slug: 'kids-dresses',
    mainCategory: { _id: 'cat-kids', name: 'Kids Wear', slug: 'kids' },
    image: '/assets/categories/kids/kids-dresses/image-1.jpg',
    images: getSubcategoryImagesList('kids', 'kids-dresses', 10)
  },
  {
    _id: 'sub-kids-school',
    name: 'School Wear',
    slug: 'school-wear',
    mainCategory: { _id: 'cat-kids', name: 'Kids Wear', slug: 'kids' },
    image: '/assets/categories/kids/school-wear/image-1.jpg',
    images: getSubcategoryImagesList('kids', 'school-wear', 10)
  },
  {
    _id: 'sub-kids-bottoms',
    name: 'Kids Bottoms',
    slug: 'kids-bottoms',
    mainCategory: { _id: 'cat-kids', name: 'Kids Wear', slug: 'kids' },
    image: '/assets/categories/kids/kids-bottoms/image-1.jpg',
    images: getSubcategoryImagesList('kids', 'kids-bottoms', 10)
  },

  // Accessories
  {
    _id: 'sub-acc-bags',
    name: 'Bags',
    slug: 'bags',
    mainCategory: { _id: 'cat-accessories', name: 'Accessories', slug: 'accessories' },
    image: '/assets/categories/accessories/bags/image-1.jpg',
    images: getSubcategoryImagesList('accessories', 'bags', 10)
  },
  {
    _id: 'sub-acc-belts',
    name: 'Belts',
    slug: 'belts',
    mainCategory: { _id: 'cat-accessories', name: 'Accessories', slug: 'accessories' },
    image: '/assets/categories/accessories/belts/image-1.jpg',
    images: getSubcategoryImagesList('accessories', 'belts', 10)
  },
  {
    _id: 'sub-acc-caps',
    name: 'Caps',
    slug: 'caps',
    mainCategory: { _id: 'cat-accessories', name: 'Accessories', slug: 'accessories' },
    image: '/assets/categories/accessories/caps/image-1.jpg',
    images: getSubcategoryImagesList('accessories', 'caps', 10)
  },
  {
    _id: 'sub-acc-sunglasses',
    name: 'Sunglasses',
    slug: 'sunglasses',
    mainCategory: { _id: 'cat-accessories', name: 'Accessories', slug: 'accessories' },
    image: '/assets/categories/accessories/sunglasses/image-1.jpg',
    images: getSubcategoryImagesList('accessories', 'sunglasses', 10)
  },

  // Bridal Wear
  {
    _id: 'sub-bridal-gowns',
    name: 'Bridal Gowns',
    slug: 'bridal-gowns',
    mainCategory: { _id: 'cat-bridal', name: 'Bridal Wear', slug: 'bridal-wear' },
    image: '/assets/categories/bridal-wear/bridal-gowns/image-1.jpg',
    images: getSubcategoryImagesList('bridal-wear', 'bridal-gowns', 10)
  },
  {
    _id: 'sub-bridal-bridesmaid',
    name: 'Bridesmaid Dresses',
    slug: 'bridesmaid-dresses',
    mainCategory: { _id: 'cat-bridal', name: 'Bridal Wear', slug: 'bridal-wear' },
    image: '/assets/categories/bridal-wear/bridesmaid-dresses/image-1.jpg',
    images: getSubcategoryImagesList('bridal-wear', 'bridesmaid-dresses', 10)
  },
  {
    _id: 'sub-bridal-acc',
    name: 'Bridal Accessories',
    slug: 'bridal-accessories',
    mainCategory: { _id: 'cat-bridal', name: 'Bridal Wear', slug: 'bridal-wear' },
    image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg',
    images: getSubcategoryImagesList('bridal-wear', 'bridal-accessories', 10)
  },

  // Gym & Activewear
  {
    _id: 'sub-gym-bras',
    name: 'Sports Bras',
    slug: 'sports-bras',
    mainCategory: { _id: 'cat-gym', name: 'GYM & Activewear', slug: 'gym-activewear' },
    image: '/assets/categories/gym-activewear/sports-bras/image-1.jpg',
    images: getSubcategoryImagesList('gym-activewear', 'sports-bras', 10)
  },
  {
    _id: 'sub-gym-leggings',
    name: 'Leggings & Tights',
    slug: 'leggings-tights',
    mainCategory: { _id: 'cat-gym', name: 'GYM & Activewear', slug: 'gym-activewear' },
    image: '/assets/categories/gym-activewear/leggings-tights/image-1.jpg',
    images: getSubcategoryImagesList('gym-activewear', 'leggings-tights', 10)
  },
  {
    _id: 'sub-gym-tops',
    name: 'Workout Tops',
    slug: 'workout-tops',
    mainCategory: { _id: 'cat-gym', name: 'GYM & Activewear', slug: 'gym-activewear' },
    image: '/assets/categories/gym-activewear/workout-tops/image-1.jpg',
    images: getSubcategoryImagesList('gym-activewear', 'workout-tops', 10)
  }
];
