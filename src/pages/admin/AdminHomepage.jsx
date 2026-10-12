import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Package, Users, ShoppingBag, Grid, TrendingUp, DollarSign, Truck, Save, CheckCircle, RefreshCw, Tag, Plus, ArrowRight, Sliders } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminHomepage = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    coupons: 0,
    heroSlides: 0,
  });
  const [couponsList, setCouponsList] = useState([]);
  const [heroSlidesList, setHeroSlidesList] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(350);
  const [isUpdatingFee, setIsUpdatingFee] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, ordersRes, usersRes, settingsRes, couponsRes] = await Promise.all([
        axiosInstance.get('/product'),
        axiosInstance.get('/category'),
        axiosInstance.get('/order/all'),
        axiosInstance.get('/user'),
        axiosInstance.get('/settings').catch(() => ({ data: { deliveryFee: 350 } })),
        axiosInstance.get('/coupen').catch(() => ({ data: [] }))
      ]);

      const products = productsRes.data.products || [];
      const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data.categories || [];
      const orders = ordersRes.data || [];
      const users = usersRes.data.users || [];
      const coupons = Array.isArray(couponsRes.data) ? couponsRes.data : [];
      const slides = Array.isArray(settingsRes.data?.heroSlides) ? settingsRes.data.heroSlides : [];

      setCouponsList(coupons);
      setHeroSlidesList(slides);

      if (settingsRes.data?.deliveryFee !== undefined) {
        setDeliveryFee(settingsRes.data.deliveryFee);
      }

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
        revenue,
        coupons: coupons.length,
        heroSlides: slides.length,
      });
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDeliveryFee = async (e) => {
    e.preventDefault();
    if (isNaN(Number(deliveryFee)) || Number(deliveryFee) < 0) {
      toast.error('Please enter a valid non-negative delivery fee.');
      return;
    }

    try {
      setIsUpdatingFee(true);
      const res = await axiosInstance.put('/settings', {
        deliveryFee: Number(deliveryFee),
      });

      if (res.data?.success) {
        setDeliveryFee(res.data.deliveryFee);
        toast.success(`Delivery Price successfully updated to Rs ${Number(deliveryFee).toFixed(2)}`);
      }
    } catch (err) {
      console.error('Failed to update delivery fee:', err);
      toast.error(err.response?.data?.message || 'Failed to update delivery fee');
    } finally {
      setIsUpdatingFee(false);
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
    { title: 'Total Revenue', value: `Rs ${stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'bg-emerald-500' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-blue-500' },
    { title: 'Total Products', value: stats.products, icon: Package, color: 'bg-indigo-500' },
    { title: 'Delivery Fee', value: `Rs ${Number(deliveryFee).toFixed(2)}`, icon: Truck, color: 'bg-cyan-600' },
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

      {/* Delivery Fee Management Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-50 text-cyan-700 rounded-xl">
              <Truck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Delivery Price Settings</h2>
              <p className="text-xs text-slate-500">
                Change the standard shipping/delivery cost automatically calculated at customer checkout.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto bg-cyan-50 text-cyan-700 text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-200 flex items-center gap-1.5">
            <CheckCircle size={14} /> Active Price: Rs {Number(deliveryFee).toFixed(2)}
          </span>
        </div>

        <form onSubmit={handleUpdateDeliveryFee} className="mt-6 flex flex-col sm:flex-row items-start sm:items-end gap-4 max-w-xl">
          <div className="w-full sm:flex-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Delivery Price (Rs / LKR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">Rs</span>
              <input
                type="number"
                min="0"
                step="1"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isUpdatingFee}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm whitespace-nowrap disabled:opacity-50"
          >
            {isUpdatingFee ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Delivery Price</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Homepage Hero Banner Slides Quick Card */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-100 min-h-[260px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Hero Banner Slides</h3>
                  <p className="text-xs text-slate-400">Rotating homepage editorial images</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                {stats.heroSlides} {stats.heroSlides === 1 ? 'Slide' : 'Slides'}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {heroSlidesList.length > 0 ? (
                heroSlidesList.slice(0, 3).map((slide, sIdx) => (
                  <div key={slide._id || sIdx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={slide.image} 
                        alt={slide.category} 
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" 
                      />
                      <span className="font-semibold text-slate-800 truncate">
                        {slide.category || 'Hero Slide'}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      slide.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {slide.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center italic">No slides found in database.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <Link
              to="/admin/hero-slides"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Manage all hero slides</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/admin/hero-slides"
              className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              title="Add New Slide"
            >
              <Plus size={16} />
            </Link>
          </div>
        </div>
        
        {/* Active Coupons Quick Overview Card */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-slate-100 min-h-[260px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Tag size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Coupons & Discounts</h3>
                  <p className="text-xs text-slate-400">Manage promotional checkout vouchers</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                {stats.coupons} {stats.coupons === 1 ? 'Coupon' : 'Coupons'}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {couponsList.length > 0 ? (
                couponsList.slice(0, 3).map((coupon) => (
                  <div key={coupon._id || coupon.code} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100">
                      {coupon.code}
                    </span>
                    <span className="font-semibold text-slate-700">
                      {coupon.type === 'percent' ? `${coupon.value}% OFF` : `Rs ${Number(coupon.value).toFixed(2)} OFF`}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      coupon.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center italic">No coupons created yet.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
            <Link
              to="/admin/coupons"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
            >
              <span>Manage all coupons</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/admin/coupons"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all"
            >
              <Plus size={13} />
              <span>New Coupon</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomepage;