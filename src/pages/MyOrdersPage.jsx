import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Package, Calendar, Clock, CheckCircle, XCircle, Truck, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/order/myorders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-indigo-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'payment_failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'payment_failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[90vh] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-gray-900" />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
            <Link 
              to="/productDetails" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Header info */}
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
                    <p className="font-mono font-semibold text-gray-900">#{order._id}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Placed On
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
                      <p className="font-bold text-gray-900">LKR {order.grandTotal?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Items List */}
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Items in this order</h4>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                          <p className="text-sm text-gray-500 mt-1 flex gap-3">
                            <span><strong className="text-gray-700">Qty:</strong> {item.qty}</span>
                            <span><strong className="text-gray-700">Size:</strong> {item.size}</span>
                            <span><strong className="text-gray-700">Color:</strong> {item.color}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-lg">LKR {(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Extra info footer */}
                <div className="bg-gray-50 p-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div>
                    <strong className="text-gray-900 block mb-2 text-xs uppercase tracking-wide">Shipping Details</strong>
                    <div className="text-gray-700 space-y-1">
                      <p className="font-medium">{order.shippingAddress?.fullName}</p>
                      <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                      <p>{order.shippingAddress?.phone}</p>
                    </div>
                  </div>
                  <div>
                    <strong className="text-gray-900 block mb-2 text-xs uppercase tracking-wide">Payment Information</strong>
                    <div className="text-gray-700 space-y-1">
                      <p>Method: <span className="font-medium">{order.paymentMethod}</span></p>
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
