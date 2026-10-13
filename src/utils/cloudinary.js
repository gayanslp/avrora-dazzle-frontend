import axiosInstance from '../api/axiosInstance';

/**
 * Upload a single image file through backend (Cloudinary or local storage fallback)
 */
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.url;
  } catch (error) {
    console.error('Error uploading image through backend:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};

/**
 * Upload multiple image files at once through backend
 */
export const uploadMultipleImages = async (files) => {
  const fileArray = Array.from(files);
  if (fileArray.length === 0) return [];

  const formData = new FormData();
  fileArray.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const res = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.urls || (res.data.url ? [res.data.url] : []);
  } catch (error) {
    console.error('Error uploading images through backend:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload images');
  }
};
