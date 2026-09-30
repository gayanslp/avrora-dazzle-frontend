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
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnAuthorized';
import LadiesWarePage from '../pages/LadiesWarePage';
import GentsWarePage from '../pages/GentsWarepage';
import TenPrecentOffPage from '../pages/TenPrecentOffPage';
import KidsWarePage from '../pages/KidsWarePage';
import BridalWarePage from '../pages/BridalWarePage';
import GymAndActivewarePage from '../pages/GymAndActivewarePage';
import FancyAndGiftPage from '../pages/FancyAndGiftPage';

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
        <Route path="/ladies-wear" element={<LadiesWarePage />} />
        <Route path="/gents-wear" element={<GentsWarePage />} />
        <Route path="/sale" element={<TenPrecentOffPage />} />
        <Route path="/kids-wear" element={<KidsWarePage />} />
        <Route path="/bridal-wear" element={<BridalWarePage />} />
        <Route path="/gym-activewear" element={<GymAndActivewarePage />} />
        <Route path="/fancy-gift" element={<FancyAndGiftPage />} />

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