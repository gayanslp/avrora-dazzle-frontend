import axiosInstance from './axiosInstance';

/**
 * Fetch cart from backend
 */
export const fetchCart = async () => {
  const response = await axiosInstance.get('/cart');
  return response.data;
};

/**
 * Add item to backend cart
 * @param {Object} itemData - { productId, qty, size, color, name, price, image, currency }
 */
export const addToCartApi = async (itemData) => {
  const response = await axiosInstance.post('/cart', itemData);
  return response.data;
};

/**
 * Update quantity of an item in backend cart
 * @param {string} itemId 
 * @param {number} qty 
 */
export const updateCartItemQuantityApi = async (itemId, qty) => {
  const response = await axiosInstance.put(`/cart/${itemId}`, { qty });
  return response.data;
};

/**
 * Remove an item from backend cart
 * @param {string} itemId 
 */
export const removeFromCartApi = async (itemId) => {
  const response = await axiosInstance.delete(`/cart/${itemId}`);
  return response.data;
};

/**
 * Clear all items from backend cart
 */
export const clearCartApi = async () => {
  const response = await axiosInstance.delete('/cart/clear');
  return response.data;
};
