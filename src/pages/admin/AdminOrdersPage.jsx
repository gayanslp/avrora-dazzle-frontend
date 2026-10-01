import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { Search, ShoppingBag, Eye, X, Calendar, User, MapPin, Mail, Phone, FileText } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status mapping for colors
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/order/all');
      setOrders(res.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/order/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) || 
    o.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 text-sm">Manage customer orders and fulfillment</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Search by ID, email, or name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-mono text-slate-600">{order._id.slice(-8).toUpperCase()}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{order.shippingAddress?.fullName}</span>
                          <span className="text-xs text-slate-500">{order.userEmail}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        ${order.grandTotal?.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer outline-none ring-1 ring-inset focus:ring-2 focus:ring-indigo-500 ${statusColors[order.status] || 'bg-slate-100 text-slate-700'} ring-black/5`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Order Details</h2>
                <p className="text-sm text-slate-500 font-mono mt-1">ID: {selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Top Meta Data */}
              <div className="flex flex-wrap gap-4 justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Date Placed</p>
                  <p className="text-sm font-medium text-slate-800 mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Payment Method</p>
                  <p className="text-sm font-medium text-slate-800 mt-1">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</p>
                  <div className="mt-1">
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer outline-none ring-1 ring-inset focus:ring-2 focus:ring-indigo-500 ${statusColors[selectedOrder.status] || 'bg-slate-100 text-slate-700'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery & Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-indigo-600" />
                  Customer & Delivery Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-slate-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Customer Name</p>
                        <p className="text-sm text-slate-800">{selectedOrder.shippingAddress?.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail size={16} className="text-slate-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Email</p>
                        <p className="text-sm text-slate-800">{selectedOrder.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="text-slate-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                        <p className="text-sm text-slate-800">{selectedOrder.shippingAddress?.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Delivery Address</p>
                        <p className="text-sm text-slate-800 mt-0.5 leading-relaxed">
                          {selectedOrder.shippingAddress?.street}<br/>
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.shippingAddress?.instructions && (
                      <div className="flex items-start gap-3 pt-2">
                        <FileText size={16} className="text-amber-500 mt-1 shrink-0" />
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 w-full">
                          <p className="text-xs text-amber-700 font-medium mb-1">Delivery Instructions</p>
                          <p className="text-sm text-amber-900">{selectedOrder.shippingAddress.instructions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-indigo-600" />
                  Order Items
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Item</th>
                        <th className="p-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Variant</th>
                        <th className="p-3 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">Qty</th>
                        <th className="p-3 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Price</th>
                        <th className="p-3 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index} className="bg-white">
                          <td className="p-3 text-sm font-medium text-slate-800">{item.name}</td>
                          <td className="p-3 text-sm text-slate-500">{item.color} / {item.size}</td>
                          <td className="p-3 text-sm text-slate-800 text-center">{item.qty}</td>
                          <td className="p-3 text-sm text-slate-600 text-right">${item.price.toFixed(2)}</td>
                          <td className="p-3 text-sm font-medium text-slate-800 text-right">${(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Totals Footer */}
                  <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>${selectedOrder.itemsTotal?.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>Discount</span>
                        <span>-${selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Shipping</span>
                      <span>${selectedOrder.shipping?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200 mt-2">
                      <span>Grand Total</span>
                      <span>${selectedOrder.grandTotal?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;