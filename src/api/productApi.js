import axiosInstance from './axiosInstance';

export const fetchProducts = async () => {
    const response = await axiosInstance.get('/product');
    return response.data;
};

export const fetchProductById = async (id) => {
    const response = await axiosInstance.get(`/product/${id}`);
    return response.data;
};
