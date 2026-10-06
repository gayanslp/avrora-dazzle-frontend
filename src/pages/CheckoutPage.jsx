import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  ShoppingBag, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const CheckoutPage = () => {
    const { cartItems, subtotal } = useCart();
    
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        street: '',
        city: '',
        postalCode: '',
        instructions: '',
        paymentMethod: 'PayHere', // Default payment method
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // -------------------------------------------------------------
    // PayHere Modal Trigger Function
    // -------------------------------------------------------------
    const initiatePayHerePayment = (payhereParams) => {
        if (typeof window.payhere === 'undefined') {
            alert('PayHere SDK is not loaded. Please try again.');
            return;
        }

        window.payhere.onCompleted = function onCompleted(orderId) {
            console.log("Payment completed. Order ID:" + orderId);
            window.location.href = `/order-success/${orderId}`;
        };

        window.payhere.onDismissed = function onDismissed() {
            console.log("Payment dismissed");
            alert("Payment was cancelled.");
        };

        window.payhere.onError = function onError(error) {
            console.log("PayHere Error: " + error);
            alert("Payment Error: " + error);
        };

        const payment = {
            sandbox: true,
            merchant_id: payhereParams.merchant_id,
            return_url: payhereParams.return_url,
            cancel_url: payhereParams.cancel_url,
            notify_url: payhereParams.notify_url,
            order_id: payhereParams.order_id,
            items: payhereParams.items_name,
            amount: payhereParams.amount,
            currency: payhereParams.currency,
            hash: payhereParams.hash,
            first_name: payhereParams.first_name,
            last_name: payhereParams.last_name,
            email: payhereParams.email,
            phone: payhereParams.phone,
            address: payhereParams.address,
            city: payhereParams.city,
            country: 'Sri Lanka',
        };

        window.payhere.startPayment(payment);
    };

    // -------------------------------------------------------------
    // Submit Handler
    // -------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post(
                '/order',
                {
                    shippingAddress: {
                        fullName: formData.fullName,
                        phone: formData.phone,
                        street: formData.street,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        instructions: formData.instructions,
                    },
                    paymentMethod: formData.paymentMethod,
                    email: formData.email,
                    coupon: null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const createdOrder = response.data;
            console.log("Order Created:", createdOrder);
            const orderId = createdOrder?._id;

            if (formData.paymentMethod === 'PayHere') {
                console.log("Initiating PayHere Payment for Order ID:", orderId);
                
                const hashResponse = await axiosInstance.post("/payment/payhere-hash", {
                    orderId: orderId
                });

                const payhereData = hashResponse.data;

                const payhereParams = {
                    merchant_id: payhereData.merchantId,
                    return_url: `${window.location.origin}/order-success/${payhereData.orderId}`,
                    cancel_url: `${window.location.origin}/checkout`,
                    notify_url: 'https://8r2k27zw-3000.asse.devtunnels.ms/api/payment/payhere-notify',
                    order_id: payhereData.orderId,
                    items_name: payhereData.items,
                    amount: payhereData.amount,
                    currency: payhereData.currency,
                    hash: payhereData.hash,
                    first_name: payhereData.customer.firstName || formData.fullName.split(' ')[0],
                    last_name: payhereData.customer.lastName || formData.fullName.split(' ')[1] || '',
                    email: payhereData.customer.email || 'customer@email.com',
                    phone: payhereData.customer.phone || formData.phone,
                    address: payhereData.customer.address || formData.street,
                    city: payhereData.customer.city || formData.city,
                };

                initiatePayHerePayment(payhereParams);
            } else {
                window.location.href = `/order-success/${createdOrder._id}`;
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Try again.');
            console.log("Error is: ", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 font-sans text-slate-900 py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Title & Trust Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-600 mb-1">
                            <Lock size={14} /> Encrypted & Secure Checkout
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                            COMPLETE YOUR ORDER
                        </h1>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck size={18} className="text-emerald-500" />
                            <span>100% Authentic Guarantee</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Truck size={18} className="text-cyan-600" />
                            <span>Express Doorstep Delivery</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Shipping & Payment Form */}
                    <div className="lg:col-span-7 space-y-8">
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-center gap-3 text-sm font-medium animate-shake">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Section 1: Customer Contact Information */}
                            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
                                        1
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                                        Contact Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-3 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g. Eleanor Vance"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                            Phone Number *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-3 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g. +94 77 123 4567"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. eleanor@example.com"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Delivery Address */}
                            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
                                        2
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                                        Shipping Address
                                    </h2>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        Street Address *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-3 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. 45th Main Street, Suite 102"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Colombo"
                                            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. 00700"
                                            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        Delivery Instructions <span className="text-slate-400 font-normal lowercase">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3.5 top-3 text-slate-400" size={18} />
                                        <textarea
                                            name="instructions"
                                            value={formData.instructions}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="e.g. Leave at security desk or gate"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Payment Method */}
                            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
                                        3
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                                        Payment Method
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    
                                    {/* PayHere Radio Option */}
                                    <label 
                                        className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                            formData.paymentMethod === 'PayHere' 
                                                ? 'border-cyan-500 bg-cyan-500/5 shadow-sm' 
                                                : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="PayHere"
                                            checked={formData.paymentMethod === 'PayHere'}
                                            onChange={handleChange}
                                            className="mt-1 accent-cyan-600 cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={18} className="text-cyan-600" />
                                                <span className="font-bold text-sm text-slate-900">PayHere Gateway</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                Visa, Mastercard, Koko, Genie & Mobile Banking.
                                            </p>
                                        </div>
                                        {formData.paymentMethod === 'PayHere' && (
                                            <CheckCircle2 size={18} className="text-cyan-600 absolute top-4 right-4" />
                                        )}
                                    </label>

                                    {/* COD Radio Option */}
                                    <label 
                                        className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                            formData.paymentMethod === 'COD' 
                                                ? 'border-cyan-500 bg-cyan-500/5 shadow-sm' 
                                                : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={formData.paymentMethod === 'COD'}
                                            onChange={handleChange}
                                            className="mt-1 accent-cyan-600 cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Truck size={18} className="text-slate-800" />
                                                <span className="font-bold text-sm text-slate-900">Cash on Delivery</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                Pay cash directly to courier upon doorstep delivery.
                                            </p>
                                        </div>
                                        {formData.paymentMethod === 'COD' && (
                                            <CheckCircle2 size={18} className="text-cyan-600 absolute top-4 right-4" />
                                        )}
                                    </label>

                                </div>
                            </div>

                            {/* Submit Order Button */}
                            <button
                                type="submit"
                                disabled={loading || cartItems.length === 0}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-slate-900/10 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer text-base uppercase tracking-wider"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Processing Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Place Order</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm sticky top-28 space-y-6">
                            
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <ShoppingBag size={20} className="text-slate-900" />
                                    <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
                                        Order Summary
                                    </h2>
                                </div>
                                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                                    {cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)} items
                                </span>
                            </div>

                            {/* Cart Items List */}
                            <div className="max-h-80 overflow-y-auto pr-1 space-y-4 divide-y divide-slate-100 no-scrollbar">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item, idx) => (
                                        <div key={item.id || idx} className={`${idx > 0 ? 'pt-4' : ''} flex items-center justify-between gap-4 group`}>
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-14 h-18 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60 relative">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <span className="absolute top-1 right-1 bg-slate-900/80 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                                                        {item.variant || `${item.color || 'Standard'} / ${item.size || 'Regular'}`}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-xs font-extrabold text-slate-900 whitespace-nowrap shrink-0">
                                                {item.currency || 'Rs '}{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 italic py-4 text-center">Your cart is empty.</p>
                                )}
                            </div>

                            {/* Calculations */}
                            <div className="space-y-3 text-xs pt-4 border-t border-slate-100">
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Items Subtotal</span>
                                    <span className="font-bold text-slate-900">
                                        Rs {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Shipping & Handling</span>
                                    <span className="font-bold text-emerald-600 uppercase tracking-wide">
                                        FREE
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Estimated Taxes</span>
                                    <span className="font-bold text-slate-900">Rs 0.00</span>
                                </div>
                            </div>

                            {/* Total Bar */}
                            <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                        Grand Total
                                    </span>
                                    <span className="text-[10px] text-slate-400">Includes all applicable taxes</span>
                                </div>
                                <span className="text-2xl font-black text-slate-900">
                                    Rs {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center gap-3">
                                <Lock className="text-slate-400 shrink-0" size={18} />
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    Your personal data will be encrypted and used strictly to process your order.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;