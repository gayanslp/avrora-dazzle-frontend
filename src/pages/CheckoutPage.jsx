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
        <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Shipping Form */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Street Address</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="PayHere"
                                    checked={formData.paymentMethod === 'PayHere'}
                                    onChange={handleChange}
                                />
                                <span>PayHere (Card / Mobile Banking)</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={formData.paymentMethod === 'COD'}
                                    onChange={handleChange}
                                />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mt-6 disabled:opacity-50"
                    >
                        {loading ? 'Processing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg border h-fit">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm border-b pb-4">
                    <p className="flex justify-between">
                        <span>Items Total</span>
                        <span className="font-semibold">Calculated on Server</span>
                    </p>
                    <p className="flex justify-between text-gray-500">
                        <span>Shipping</span>
                        <span>LKR 0.00</span>
                    </p>
                </div>
                <div className="pt-4 flex justify-between font-bold text-lg">
                    <span>Grand Total</span>
                    <span>LKR --.--</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;