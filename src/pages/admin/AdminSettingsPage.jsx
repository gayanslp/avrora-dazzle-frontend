import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Truck, Save, CheckCircle, AlertCircle, RefreshCw, Sliders, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminSettingsPage = () => {
  const [deliveryFee, setDeliveryFee] = useState(350);
  const [initialFee, setInitialFee] = useState(350);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/settings');
      if (res.data?.deliveryFee !== undefined) {
        setDeliveryFee(res.data.deliveryFee);
        setInitialFee(res.data.deliveryFee);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      toast.error('Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isNaN(Number(deliveryFee)) || Number(deliveryFee) < 0) {
      toast.error('Please enter a valid non-negative delivery fee.');
      return;
    }

    try {
      setSaving(true);
      const res = await axiosInstance.put('/settings', {
        deliveryFee: Number(deliveryFee),
      });

      if (res.data?.success) {
        setDeliveryFee(res.data.deliveryFee);
        setInitialFee(res.data.deliveryFee);
        toast.success(`Delivery fee successfully updated to Rs ${Number(deliveryFee).toFixed(2)}`);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
      toast.error(err.response?.data?.message || 'Failed to update delivery fee');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Store Settings</h1>
        <p className="text-slate-500 text-sm">Configure store shipping, delivery charges and checkout calculations</p>
      </div>

      {/* Delivery Fee Management Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Truck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Delivery Fee Configuration</h2>
              <p className="text-xs text-slate-500">
                This delivery charge is added to the customer's item price at checkout.
              </p>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle size={13} /> Active: Rs {Number(initialFee).toFixed(2)}
          </span>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          <div className="max-w-md">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Standard Delivery Price (Rs / LKR) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-sm font-bold text-slate-400">
                Rs
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                required
                placeholder="e.g. 350"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Enter 0 for free standard delivery across all orders.
            </p>
          </div>

          {/* Pricing Calculation Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle size={14} className="text-indigo-600" />
              Customer Checkout Calculation Preview
            </h4>
            <div className="text-xs space-y-1.5 text-slate-600 font-medium pt-1 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Item Price:</span>
                <span className="font-semibold text-slate-800">Rs 2,500.00</span>
              </div>
              <div className="flex justify-between text-indigo-700 font-semibold">
                <span>Delivery Price:</span>
                <span>Rs {Number(deliveryFee || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Price:</span>
                <span>Rs {(2500 + Number(deliveryFee || 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer text-sm"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Update Delivery Price</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={fetchSettings}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition text-sm cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Hero Banner Slides Management Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sliders size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Homepage Hero Banner Slides</h2>
              <p className="text-xs text-slate-500">
                Customize, upload, and arrange the high-fashion editorial rotating banner images on the storefront.
              </p>
            </div>
          </div>
          <Link
            to="/admin/hero-slides"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <span>Open Slides Manager</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="p-6 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-2xs">
              <ImageIcon size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Full Carousel Control</p>
              <p className="text-xs text-slate-500">
                Upload new editorial campaign images, change titles, button labels, and URLs anytime.
              </p>
            </div>
          </div>
          <Link
            to="/admin/hero-slides"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            Manage Slides & Uploads →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
