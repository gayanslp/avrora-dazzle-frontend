import axios from 'axios';

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://api.avroradazzle.com/api'
  );
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to all requests if present in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired or invalid token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Auth token invalid or expired. Clearing token from storage.");
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('avora_cart');
        window.dispatchEvent(new Event('storage'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;