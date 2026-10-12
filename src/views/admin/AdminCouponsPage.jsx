'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { 
  Tag, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Calendar, 
  Percent, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Copy, 
  Check, 
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    value: '',
    type: 'percent',
    minOrder: '0',
    expiresAt: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/coupen');
      setCoupons(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to load coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    // Default expiration date to 30 days from now
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const defaultDateStr = nextMonth.toISOString().slice(0, 16);

    setFormData({
      code: '',
      value: '',
      type: 'percent',
      minOrder: '0',
      expiresAt: defaultDateStr,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    const dateStr = coupon.expiresAt 
      ? new Date(coupon.expiresAt).toISOString().slice(0, 16) 
      : '';

    setFormData({
      code: coupon.code || '',
      value: coupon.value || '',
      type: coupon.type || 'percent',
      minOrder: coupon.minOrder !== undefined ? coupon.minOrder : '0',
      expiresAt: dateStr,
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      toast.error('Coupon code is required.');
      return;
    }

    if (!formData.value || Number(formData.value) <= 0) {
      toast.error('Please enter a valid positive discount value.');
      return;
    }

    if (!formData.expiresAt) {
      toast.error('Please set an expiration date.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        code: formData.code.trim().toUpperCase(),
        value: Number(formData.value),
        type: formData.type,
        minOrder: Number(formData.minOrder) || 0,
        expiresAt: new Date(formData.expiresAt).toISOString(),
        isActive: Boolean(formData.isActive),
      };

      if (editingCoupon) {
        await axiosInstance.put(`/coupen/${editingCoupon._id || editingCoupon.code}`, payload);
        toast.success(`Coupon "${payload.code}" updated successfully!`);
      } else {
        await axiosInstance.post('/coupen', payload);
        toast.success(`Coupon "${payload.code}" created successfully!`);
      }

      handleCloseModal();
      fetchCoupons();
    } catch (error) {
      console.error('Failed to save coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (coupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/coupen/${coupon._id || coupon.code}`);
      toast.success(`Coupon "${coupon.code}" deleted successfully.`);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      const updatedStatus = !coupon.isActive;
      await axiosInstance.put(`/coupen/${coupon._id || coupon.code}`, {
        isActive: updatedStatus,
      });
      toast.success(`Coupon "${coupon.code}" ${updatedStatus ? 'activated' : 'deactivated'}.`);
      fetchCoupons();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update coupon status');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.info(`Copied "${code}" to clipboard!`);
  };

  // Helper to check if a coupon has expired
  const isExpired = (expiresAt) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  // Stats calculation
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.isActive && !isExpired(c.expiresAt)).length;
  const expiredCoupons = coupons.filter(c => isExpired(c.expiresAt)).length;

  // Filtering
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || coupon.type === filterType;
    
    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = coupon.isActive && !isExpired(coupon.expiresAt);
    } else if (filterStatus === 'inactive') {
      matchesStatus = !coupon.isActive;
    } else if (filterStatus === 'expired') {
      matchesStatus = isExpired(coupon.expiresAt);
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <Tag className="text-indigo-600" size={26} />
            Coupons & Discounts
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Create and manage promotional discount vouchers for customer checkout
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Tag size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Coupons</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalCoupons}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active & Redeemable</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{activeCoupons}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expired</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{expiredCoupons}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Discount Types</option>
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed Amount (Rs)</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="expired">Expired Only</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4 pl-6">Coupon Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Min. Order</th>
                  <th className="p-4">Expiration</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-slate-400">
                      <Tag className="mx-auto mb-2 text-slate-300" size={32} />
                      <p className="font-medium">No coupons found.</p>
                      <p className="text-xs text-slate-400 mt-1">Create a new coupon to start offering promotional discounts.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon) => {
                    const expired = isExpired(coupon.expiresAt);

                    return (
                      <tr key={coupon._id || coupon.code} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Coupon Code Pill */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm tracking-widest px-3 py-1 bg-indigo-50 border border-indigo-200/80 text-indigo-700 rounded-lg select-all">
                              {coupon.code}
                            </span>
                            <button
                              onClick={() => handleCopyCode(coupon.code)}
                              className="text-slate-400 hover:text-indigo-600 p-1 rounded-md transition-colors cursor-pointer"
                              title="Copy Code"
                            >
                              {copiedCode === coupon.code ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </td>

                        {/* Discount Value */}
                        <td className="p-4 font-semibold text-slate-900">
                          {coupon.type === 'percent' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                              {coupon.value}% OFF
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-cyan-700 font-bold">
                              Rs {Number(coupon.value).toFixed(2)} OFF
                            </span>
                          )}
                        </td>

                        {/* Min Order */}
                        <td className="p-4 text-slate-600">
                          {coupon.minOrder > 0 ? (
                            <span>Rs {Number(coupon.minOrder).toLocaleString('en-IN')}</span>
                          ) : (
                            <span className="text-slate-400 text-xs italic">No minimum</span>
                          )}
                        </td>

                        {/* Expiration */}
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className={`text-xs font-medium ${expired ? 'text-rose-600 line-through' : 'text-slate-700'}`}>
                              {new Date(coupon.expiresAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {expired ? (
                              <span className="text-[10px] font-bold uppercase text-rose-500">Expired</span>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                {Math.ceil((new Date(coupon.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days left
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Active Toggle Switch */}
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(coupon)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                              expired
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : coupon.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              expired ? 'bg-rose-500' : coupon.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                            }`} />
                            {expired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(coupon)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Coupon"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Coupon"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define discount voucher rules and expiration
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Coupon Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER25, FESTIVE500"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Type and Value Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Discount Value *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder={formData.type === 'percent' ? 'e.g. 20' : 'e.g. 500'}
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      required
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">
                      {formData.type === 'percent' ? '%' : 'Rs'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Min Order & Expiration Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Min. Order Amount (Rs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 for no minimum"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Expires At *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Coupon is Active</span>
                    <p className="text-[11px] text-slate-400">Customers can apply this coupon at checkout immediately.</p>
                  </div>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCouponsPage;
