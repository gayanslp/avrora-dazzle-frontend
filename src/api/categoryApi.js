import axiosInstance from './axiosInstance';

export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/category');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

export const fetchSubCategoriesForSideBar = async () => {
  try {
    const response = await axiosInstance.get(`/sub-category`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sub-categories:", error);
    return [];
  }
}

export const fetchSubCategories = async (id) => {
  try {
    // If no id → fetch ALL subcategories; if id → fetch one by its own _id
    const url = id ? `/sub-category/${id}` : '/sub-category';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sub-categories:", error);
    return [];
  }
}


