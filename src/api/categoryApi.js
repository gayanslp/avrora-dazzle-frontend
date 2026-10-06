import axiosInstance from './axiosInstance';

let subCategoriesRequest;

const requestSubCategories = async () => {
  if (!subCategoriesRequest) {
    subCategoriesRequest = axiosInstance.get('/sub-category')
      .then((response) => response.data)
      .catch((error) => {
        // Allow a later mount to retry instead of caching a failed request.
        subCategoriesRequest = undefined;
        throw error;
      });
  }

  return subCategoriesRequest;
};

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
    return await requestSubCategories();
  } catch (error) {
    console.error("Failed to fetch sub-categories:", error.response?.data ?? error);
    return [];
  }
};

export const fetchSubCategories = async (id) => {
  try {
    // If no id → fetch ALL subcategories; if id → fetch one by its own _id
    if (!id) return await requestSubCategories();

    const response = await axiosInstance.get(`/sub-category/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sub-categories:", error.response?.data ?? error);
    return [];
  }
};

