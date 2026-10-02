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
import OrderSuccessPage from '../pages/OrderSuccessPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import Login from '../pages/Login';
import AdminHomepage from '../pages/admin/AdminHomepage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnAuthorized';
import ProductsPage from '../pages/ProductsPage';
import AdminSubCategoriesPage from '../pages/admin/AdminSubCategoriesPage';

const AppRoute = () => {
  return (
    <Routes>
      
      {/* 1. CUSTOMER PAGES - Wrapped inside MainLayout (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/productDetails" element={<HomePage />} />
        <Route path="/productDetails/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products" element={<ProductsPage   />} />
        <Route path="/products/:subSlug" element={<ProductsPage />} />

        {/* User Protected Page */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Route>
      </Route>


      {/* 2. ADMIN PAGES - Wrapped inside AdminLayout (Admin Sidebar) */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminHomepage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/subcategories" element={<AdminSubCategoriesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
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