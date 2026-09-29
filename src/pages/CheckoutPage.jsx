import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        street: '',
        city: '',
        postalCode: '',
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
    // PayHere Modal Trigger Function (Placeholder)
    // -------------------------------------------------------------
    const initiatePayHerePayment = (payhereParams) => {
        // PayHere JavaScript SDK eka load veela thiyenna one (index.html eke script tag eka dammama `window.payhere` labe)
        if (typeof window.payhere === 'undefined') {
            alert('PayHere SDK is not loaded. Please try again.');
            return;
        }

        // PayHere Callbacks Setup
        window.payhere.onCompleted = function onCompleted(orderId) {
            console.log("Payment completed. Order ID:" + orderId);
            // Redirect to Order Success Page
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

        // Backend eken ewana PayHere Hash / Payment object eka ewanawa
        const payment = {
            sandbox: true, // Production daaddi FALSE karanna
            merchant_id: payhereParams.merchant_id,
            return_url: payhereParams.return_url,
            cancel_url: payhereParams.cancel_url,
            notify_url: payhereParams.notify_url,
            order_id: payhereParams.order_id,
            items: payhereParams.items_name,
            amount: payhereParams.amount,
            currency: payhereParams.currency,
            hash: payhereParams.hash, // Backend එකෙන් හදලා එවන Hash එක
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
        setLoading(true);
        setError(null);

        try {
            // 1. Backend ekata request eka yawala DB eke Order eka 'pending' status ekenn save karagannawa
            const response = await axiosInstance.post(
                '/order', // Oyage backend order endpoint eka
                {
                    shippingAddress: {
                        fullName: formData.fullName,
                        phone: formData.phone,
                        
                        street: formData.street,
                        city: formData.city,
                        postalCode: formData.postalCode,
                    },
                    paymentMethod: formData.paymentMethod,
                    email: formData.email,
                    coupon: null,
                },

                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // User auth token
                    },
                }
            );

            const createdOrder = response.data;

            console.log("Order Created:", createdOrder);

            const orderId = createdOrder?._id;


            // 2. Payment Method eka 'PayHere' nam PayHere flow eka initiate karanawa
            if (formData.paymentMethod === 'PayHere') {
                console.log("Initiating PayHere Payment for Order ID:", orderId);
                
                const hashResponse = await axiosInstance.post("/payment/payhere-hash", {
                    orderId: orderId
                })

                const payhereData = hashResponse.data;

                const payhereParams = {
                    merchant_id: payhereData.merchantId,
                    return_url: `${window.location.origin}/order-success/${payhereData.orderId}`,
                    cancel_url: `${window.location.origin}/checkout`,
                    notify_url: 'https://715j1v2s-3000.asse.devtunnels.ms/api/payment/payhere-notify', // ඔබගේ backend webhook live URL එක
                    order_id: payhereData.orderId,
                    items_name: payhereData.items,
                    amount: payhereData.amount,
                    currency: payhereData.currency,
                    hash: payhereData.hash,
                    first_name: payhereData.customer.firstName || formData.fullName.split(' ')[0], // fallback if null
                    last_name: payhereData.customer.lastName || formData.fullName.split(' ')[1] || '',
                    email: payhereData.customer.email || 'customer@email.com',
                    phone: payhereData.customer.phone || formData.phone,
                    address: payhereData.customer.address || formData.street,
                    city: payhereData.customer.city || formData.city,
                }

                initiatePayHerePayment(payhereParams);
            } else {
                // COD / Other payment steps
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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12">
                {/* Left Column: Shipping Form */}
                <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-xl">
                    <h2 className="text-3xl font-light tracking-tight text-slate-900 mb-8">Shipping Information</h2>

                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Street Address</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-900 mb-4">Payment Method</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${formData.paymentMethod === 'PayHere' ? 'border-cyan-500 bg-cyan-50 shadow-sm' : 'border-slate-200 hover:border-cyan-300'}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="PayHere"
                                    checked={formData.paymentMethod === 'PayHere'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-cyan-600 bg-white border-slate-300 focus:ring-cyan-500"
                                />
                                <span className="ml-3 text-sm font-medium text-slate-900">PayHere (Card / Mobile)</span>
                            </label>
                            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${formData.paymentMethod === 'COD' ? 'border-cyan-500 bg-cyan-50 shadow-sm' : 'border-slate-200 hover:border-cyan-300'}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={formData.paymentMethod === 'COD'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-cyan-600 bg-white border-slate-300 focus:ring-cyan-500"
                                />
                                <span className="ml-3 text-sm font-medium text-slate-900">Cash on Delivery</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-950 text-white rounded-full uppercase text-xs font-bold tracking-widest py-4 mt-8 transition-all duration-300 hover:shadow-lg hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-xl h-fit sticky top-28">
                <h2 className="text-2xl font-light tracking-tight text-slate-900 mb-6">Order Summary</h2>
                <div className="space-y-4 text-sm border-b border-slate-100 pb-6 mb-6">
                    <p className="flex justify-between items-center text-slate-600">
                        <span className="font-medium">Items Total</span>
                        <span className="font-semibold text-slate-900">Calculated on Server</span>
                    </p>
                    <p className="flex justify-between items-center text-slate-600">
                        <span className="font-medium">Shipping</span>
                        <span className="font-semibold text-slate-900 text-cyan-600">Free</span>
                    </p>
                </div>
                <div className="flex justify-between items-center font-bold text-xl text-slate-900">
                    <span>Grand Total</span>
                    <span>LKR --.--</span>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 text-center uppercase tracking-widest font-semibold">
                    100% Secure Checkout
                </div>
            </div>
        </div>
    </div>
    );
};

export default CheckoutPage;