'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  CheckCircle2,
  Tag,
  X
} from 'lucide-react';

const CheckoutPage = () => {
    const router = useRouter();
    const { cartItems, subtotal, clearCart, isInitialized } = useCart();
    
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
    const [deliveryFee, setDeliveryFee] = useState(350);

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState(null);
    const [couponSuccess, setCouponSuccess] = useState(null);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            router.push('/login?redirect=/checkout');
        }

        const fetchSettings = async () => {
            try {
                const res = await axiosInstance.get('/settings');
                if (res.data?.deliveryFee !== undefined) {
                    setDeliveryFee(Number(res.data.deliveryFee));
                }
            } catch (err) {
                console.error('Failed to load delivery fee settings:', err);
            }
        };

        fetchSettings();
    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // -------------------------------------------------------------
    // Coupon Apply & Remove Handlers
    // -------------------------------------------------------------
    const handleApplyCoupon = async (e) => {
        if (e) e.preventDefault();
        const codeTrimmed = couponCode.trim();
        if (!codeTrimmed) {
            setCouponError('Please enter a discount code.');
            return;
        }

        setCouponLoading(true);
        setCouponError(null);
        setCouponSuccess(null);

        try {
            const response = await axiosInstance.post('/order/apply-coupon', {
                code: codeTrimmed,
                orderTotal: subtotal,
            });

            const data = response.data;
            setAppliedCoupon(data);
            setCouponSuccess(`Coupon "${data.code}" applied successfully!`);
            setCouponError(null);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Invalid or expired coupon code.';
            setCouponError(msg);
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError(null);
        setCouponSuccess(null);
    };

    const discountAmount = appliedCoupon ? Number(appliedCoupon.discount) || 0 : 0;
    const finalTotal = Math.max(0, subtotal - discountAmount + (deliveryFee || 0));

    // -------------------------------------------------------------
    // PayHere Modal Trigger Function
    // -------------------------------------------------------------
    const initiatePayHerePayment = (payhereParams) => {
        if (typeof window.payhere === 'undefined') {
            alert('PayHere SDK is not loaded. Please try again.');
            return;
        }

        window.payhere.onCompleted = function onCompleted(orderId) {
            clearCart();
            window.location.href = `/order-success/${orderId}`;
        };

        window.payhere.onDismissed = function onDismissed() {
            alert("Payment was cancelled.");
        };

        window.payhere.onError = function onError(error) {
            console.error("PayHere Error:", error);
            alert("Payment Error: " + error);
        };

        const payment = {
            sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true',
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
                    coupon: appliedCoupon ? appliedCoupon.code : null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const createdOrder = response.data;

            const orderId = createdOrder?._id;

            if (formData.paymentMethod === 'PayHere') {

                
                const hashResponse = await axiosInstance.post("/payment/payhere-hash", {
                    orderId: orderId
                });

                const payhereData = hashResponse.data;

                const payhereParams = {
                    merchant_id: payhereData.merchantId,
                    return_url: `${window.location.origin}/order-success/${payhereData.orderId}`,
                    cancel_url: `${window.location.origin}/checkout`,
                    notify_url: process.env.NEXT_PUBLIC_PAYHERE_NOTIFY_URL || `${window.location.origin}/api/payment/payhere-notify`,
                    order_id: payhereData.orderId,
                    items_name: payhereData.items,
                    amount: payhereData.amount,
                    currency: payhereData.currency,
                    hash: payhereData.hash,
                    first_name: payhereData.customer?.firstName || formData.fullName.split(' ')[0],
                    last_name: payhereData.customer?.lastName || formData.fullName.split(' ').slice(1).join(' ') || '',
                    email: payhereData.customer?.email || formData.email || 'customer@email.com',
                    phone: payhereData.customer?.phone || formData.phone,
                    address: payhereData.customer?.address || formData.street,
                    city: payhereData.customer?.city || formData.city,
                };

                initiatePayHerePayment(payhereParams);
            } else {
                clearCart();
                window.location.href = `/order-success/${createdOrder._id}`;
            }

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to place order. Try again.';
            setError(errorMsg);
            console.error("Order placement error:", err);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------------
    // GUARD 1: While cart context is hydrating from localStorage / API
    // -------------------------------------------------------------
    if (!isInitialized) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 font-sans">
                <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">
                    Loading Checkout...
                </p>
            </div>
        );
    }

    // -------------------------------------------------------------
    // GUARD 2: BLOCK CHECKOUT WHEN NO ITEMS ARE SELECTED (CART EMPTY)
    // -------------------------------------------------------------
    if (isInitialized && (!cartItems || cartItems.length === 0)) {
        return (
            <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-50 font-sans">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-slate-200/90 animate-fade-in">
                    <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-inner">
                        <ShoppingBag size={34} strokeWidth={1.8} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold uppercase tracking-wider mb-3">
                        Checkout Blocked
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                        No Items Selected
                    </h1>
                    <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                        You cannot proceed to checkout without selecting an item. Please browse our collections and add your desired items to your shopping bag first.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/products"
                            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/40 transition-all cursor-pointer transform active:scale-[0.99]"
                        >
                            <span>Browse & Select Items</span>
                            <ArrowRight size={15} />
                        </Link>
                        <Link
                            href="/"
                            className="w-full py-3.5 px-6 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-widest block transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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

                                <div>
                                    {/* PayHere Radio Option (COD Removed) */}
                                    <label 
                                        className="relative flex items-start gap-4 p-5 rounded-2xl border-2 border-cyan-500 bg-cyan-500/5 shadow-xs cursor-pointer transition-all"
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
                                                <CreditCard size={19} className="text-cyan-600" />
                                                <span className="font-bold text-sm text-slate-900">PayHere Gateway (Online Payment)</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                Visa, Mastercard, American Express, Koko, Genie & Mobile Banking.
                                            </p>
                                            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                                                <ShieldCheck size={14} /> 256-Bit Encrypted & Central Bank of Sri Lanka Approved
                                            </div>
                                        </div>
                                        <CheckCircle2 size={19} className="text-cyan-600 absolute top-5 right-5" />
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

                            {/* Terms & Privacy Compliance Notice */}
                            <p className="text-[11px] text-center text-slate-500 leading-relaxed px-2">
                                By placing your order, you agree to Avrora Dazzle's{' '}
                                <Link href="/terms-and-conditions" target="_blank" className="font-semibold text-slate-900 underline hover:text-cyan-600 transition-colors">
                                    Terms & Conditions
                                </Link>
                                {', '}
                                <Link href="/privacy-policy" target="_blank" className="font-semibold text-slate-900 underline hover:text-cyan-600 transition-colors">
                                    Privacy Policy
                                </Link>
                                {', and '}
                                <Link href="/refund-policy" target="_blank" className="font-semibold text-slate-900 underline hover:text-cyan-600 transition-colors">
                                    Refund Policy
                                </Link>.
                            </p>

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
                                                <div className="relative shrink-0">
                                                    <div className="w-14 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/70">
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                                                        {item.variant || `${item.color || 'White'} / ${item.size || 'Regular'}`}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-xs font-bold text-slate-900 whitespace-nowrap shrink-0">
                                                {item.currency || 'Rs '}{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 italic py-4 text-center">Your cart is empty.</p>
                                )}
                            </div>

                            {/* Coupon / Discount Code Input (Matching reference image) */}
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="text"
                                        placeholder="Discount code or gift card"
                                        value={couponCode}
                                        onChange={(e) => {
                                            setCouponCode(e.target.value);
                                            if (couponError) setCouponError(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleApplyCoupon();
                                            }
                                        }}
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-2xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading || !couponCode.trim()}
                                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                                            couponCode.trim()
                                                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/80'
                                        }`}
                                    >
                                        {couponLoading ? (
                                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            'Apply'
                                        )}
                                    </button>
                                </div>

                                {couponError && (
                                    <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                                        <span>•</span> {couponError}
                                    </p>
                                )}

                                {appliedCoupon && (
                                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Tag size={13} className="text-emerald-600" />
                                            <span className="font-bold tracking-wider">{appliedCoupon.code}</span>
                                            <span className="text-emerald-600 font-normal">
                                                (-Rs {Number(appliedCoupon.discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-slate-400 hover:text-rose-500 p-0.5 rounded-full transition-colors cursor-pointer"
                                            title="Remove discount"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Calculations (Matching image layout: Subtotal, Shipping, Total) */}
                            <div className="space-y-3 text-xs pt-4 border-t border-slate-100">
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-900">
                                        Rs {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span className="font-bold text-emerald-600">
                                            -Rs {Number(appliedCoupon.discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Shipping</span>
                                    <span className="font-bold text-slate-900">
                                        {deliveryFee === 0 ? 'FREE' : `Rs ${Number(deliveryFee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                                    </span>
                                </div>
                            </div>

                            {/* Total Bar (Matching image layout with LKR prefix) */}
                            <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
                                <span className="text-base font-bold text-slate-900">
                                    Total
                                </span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">LKR</span>
                                    <span className="text-2xl font-black text-slate-900">
                                        Rs {finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
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