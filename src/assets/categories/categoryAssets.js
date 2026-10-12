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
