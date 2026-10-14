export const NAV_CATEGORIES = [
  {
    id: 'mens',
    label: 'Mens',
    path: '/products/mens',
    items: [
      { name: 'Shirts', path: '/products/mens-shirts', image: '/assets/categories/mens/mens-shirts/image-1.jpg' },
      { name: "T'shirts", path: '/products/mens-t-shirts', image: '/assets/categories/mens/mens-t-shirts/image-1.jpg' },
      { name: 'Jeans', path: '/products/mens-jeans', image: '/assets/categories/mens/mens-jeans/image-1.jpg' },
      { name: 'Trousers', path: '/products/mens-trousers', image: '/assets/categories/mens/mens-trousers/image-1.jpg' },
      { name: 'Gym wears', path: '/products/gym-activewear', image: '/assets/categories/gym-activewear/workout-tops/image-1.jpg' },
      { name: 'Suits & Blazers', path: '/products/suits-blazers', image: '/assets/categories/mens/suits-blazers/image-1.jpg' },
      { name: 'Bags', path: '/products/bags', image: '/assets/categories/accessories/bags/image-1.jpg' },
      { name: 'Belts caps', path: '/products/belts-caps', image: '/assets/categories/accessories/caps/image-1.jpg' },
      { name: 'Sunglasses', path: '/products/sunglasses', image: '/assets/categories/accessories/sunglasses/image-1.jpg' },
    ]
  },
  {
    id: 'women',
    label: 'Women',
    path: '/products/women',
    items: [
      { name: 'Ladieswear', path: '/products/women', image: '/assets/categories/women/dresses/image-1.jpg' },
      { name: 'Dresses', path: '/products/dresses', image: '/assets/categories/women/dresses/image-1.jpg' },
      { name: 'Blouses & Tops', path: '/products/blouses-tops', image: '/assets/categories/women/tops-blouses/image-1.jpg' },
      { name: 'Pants & Jeans', path: '/products/pants-jeans', image: '/assets/categories/women/womens-jeans/image-1.jpg' },
      { name: 'Skirts', path: '/products/skirts', image: '/assets/categories/women/skirts/image-1.jpg' },
      { name: 'Gym & Active wears', path: '/products/women-activewear', image: '/assets/categories/gym-activewear/workout-tops/image-1.jpg' },
      { name: 'Undergarments', path: '/products/undergarments', image: '/assets/categories/gym-activewear/sports-bras/image-1.jpg' },
      { name: 'Jewellery & Watches', path: '/products/jewellery-watches', image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg' },
      { name: 'Beauty products', path: '/products/beauty-products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600' },
      { name: 'Handbags', path: '/products/handbags', image: '/assets/categories/accessories/bags/image-1.jpg' },
      { name: 'Footwear', path: '/products/footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600' },
      { name: 'Other Accessories', path: '/products/other-accessories', image: '/assets/categories/accessories/belts/image-1.jpg' },
    ]
  },
  {
    id: 'kids',
    label: 'Kids',
    path: '/products/kids',
    items: [
      { name: 'Baby Boy & Girl', path: '/products/baby-boy-girl', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=600' },
      { name: 'Toddler Boys', path: '/products/toddler-boys', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=600' },
      { name: 'Toddler Girls', path: '/products/toddler-girls', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=600' },
      { name: 'Footwear', path: '/products/kids-footwear', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=600' },
      { name: 'Toys', path: '/products/toys', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 'bridal-accessories',
    label: 'Bridalwears & Accessories',
    path: '/products/bridal-wear',
    items: [
      { name: 'Bridal Gowns', path: '/products/bridal-gowns', image: '/assets/categories/bridal-wear/bridal-gowns/image-1.jpg' },
      { name: 'Bridesmaid Dresses', path: '/products/bridesmaid-dresses', image: '/assets/categories/bridal-wear/bridesmaid-dresses/image-1.jpg' },
      { name: 'Bridal Jewellery & Sets', path: '/products/bridal-accessories', image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg' },
      { name: 'Veils & Hair Accessories', path: '/products/bridal-veils', image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg' },
      { name: 'Clutches & Bridal Bags', path: '/products/bridal-bags', image: '/assets/categories/accessories/bags/image-1.jpg' },
      { name: 'Bridal Heels & Footwear', path: '/products/bridal-footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600' },
    ]
  },
  {
    id: 'gift-fancy',
    label: 'Gift & Fancy Items',
    path: '/products/fancy-gift',
    items: [
      { name: 'Fancy Watches & Jewellery', path: '/products/jewellery', image: '/assets/categories/bridal-wear/bridal-accessories/image-1.jpg' },
      { name: 'Designer Sunglasses', path: '/products/sunglasses', image: '/assets/categories/accessories/sunglasses/image-1.jpg' },
      { name: 'Belts & Wallets', path: '/products/belts', image: '/assets/categories/accessories/belts/image-1.jpg' },
      { name: 'Luxury Perfumes & Scents', path: '/products/beauty-products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600' },
      { name: 'Caps & Trendy Headwear', path: '/products/caps', image: '/assets/categories/accessories/caps/image-1.jpg' },
      { name: 'Gift Sets & Hampers', path: '/products/gift-sets', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=600' },
    ]
  }
];
