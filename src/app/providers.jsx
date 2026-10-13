'use client';

import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { CategoryProvider } from '../context/CategoryContext';
import { CartProvider } from '../context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationLoader from '../components/NavigationLoader';
import ScrollToTop from '../components/ScrollToTop';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <CategoryProvider>
        <CartProvider>
          <NavigationLoader />
          {children}
          <ScrollToTop />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="dark"
          />
        </CartProvider>
      </CategoryProvider>
    </ThemeProvider>
  );
}
