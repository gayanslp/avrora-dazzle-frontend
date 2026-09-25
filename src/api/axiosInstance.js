import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // ඔයාගේ Express Backend URL එක
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT Token එක Request Headers වලට Auto Attach කිරීම
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;