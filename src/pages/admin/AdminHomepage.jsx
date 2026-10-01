import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Package, Users, ShoppingBag, Grid, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminHomepage = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
        axiosInstance.get('/product'),
        axiosInstance.get('/category'),
        axiosInstance.get('/order/all'),
        axiosInstance.get('/user')
      ]);

      const products = productsRes.data.products || [];
      const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data.categories || [];
      const orders = ordersRes.data || [];
      const users = usersRes.data.users || [];

      const revenue = orders.reduce((sum, order) => {
        if (order.status !== 'cancelled') {
          return sum + (order.grandTotal || 0);
        }
        return sum;
      }, 0);

      setStats({
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        users: users.length,
        revenue
      });
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-500' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-blue-500' },
    { title: 'Total Products', value: stats.products, icon: Package, color: 'bg-indigo-500' },
    { title: 'Total Users', value: stats.users, icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome back to your admin control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`p-4 rounded-xl text-white ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex flex-col items-center justify-center text-center">
          <TrendingUp className="text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-700">Analytics Overview</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm">Detailed charts and analytics will appear here as your store generates more data.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px] flex flex-col items-center justify-center text-center">
          <Grid className="text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-700">Recent Activity</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm">Activity logs and recent events will be tracked here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHomepage;