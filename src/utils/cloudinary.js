import axiosInstance from '../api/axiosInstance';

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.url; // Returns the uploaded image URL from backend
  } catch (error) {
    console.error('Error uploading image through backend:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};
