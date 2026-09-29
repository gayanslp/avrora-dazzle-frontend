import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out transform">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 flex justify-center">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <CheckCircle className="text-emerald-500 w-16 h-16 animate-pulse" />
          </div>
        </div>
        
        <div className="p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been placed and is currently being processed.
          </p>
          
          <div className="bg-emerald-50 rounded-lg p-4 mb-8 border border-emerald-100">
            <p className="text-sm text-emerald-700 font-medium mb-1">Transaction Reference</p>
            <p className="text-lg font-mono font-bold text-emerald-900 break-all">
              #{orderId || 'N/A'}
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link 
              to="/productDetails" 
              className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
            
            <Link 
              to="/" 
              className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors border border-transparent hover:bg-gray-100"
            >
              <span>Return to Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
