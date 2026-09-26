import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Layouts
import MainLayout from '../components/MainLayout';
import AdminLayout from '../components/AdminLayout';

// Protection Guard
import ProtectedRoute from './ProtectedRoutes';

// Pages
import HomePage from '../pages/HomePage';
import CartPage from '../pages/CartPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CheckoutPage from '../pages/CheckoutPage';
import Login from '../pages/Login';
import AdminHomepage from '../pages/admin/AdminHomepage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnAuthorized';

const AppRoute = () => {
  return (
    <Routes>
      
      {/* 1. CUSTOMER PAGES - Wrapped inside MainLayout (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/productDetails" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* User Protected Page */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          
        </Route>
      </Route>


      {/* 2. ADMIN PAGES - Wrapped inside AdminLayout (Admin Sidebar) */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminHomepage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />

        </Route>
      </Route>


      {/* 3. STANDALONE PAGES (without Layout Full-screen Pages) */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

export default AppRoute;