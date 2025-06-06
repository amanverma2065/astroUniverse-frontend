import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function AstrologerDetail() {

    const { allHomeAstrologer, user, axios, refreshUser } = useAppContext();
    const [loading, setLoading] = useState();
    const { id } = useParams();
    const selectedAstrologer = allHomeAstrologer.find((astrologer) => astrologer._id === id);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (amount, selectedPlan) => {

        if (!user || !user._id) {
            toast.error("You must be logged in to make a payment.");
            return;
        }

        const res = await loadRazorpayScript();
        if (!res) {
            toast.error("Failed to load Razorpay SDK. Are you online?");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Processing payment...");

        try {
            const { data } = await axios.post("/api/payment/create-order", { amount, userId: user._id, astrologerId: selectedAstrologer._id, });

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                order_id: data.orderId,
                name: "AstroUniverse",
                description: "Subscription Plan",
                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post("/api/payment/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: user._id,
                            astrologerId: selectedAstrologer._id,
                            planType: selectedPlan
                        });

                        if (verifyRes.data.success) {
                            await refreshUser();
                            toast.success("Payment Successful & Subscription Activated", { id: loadingToast });
                        } else {
                            toast.error("Payment verification failed", { id: loadingToast });
                        }
                    } catch (error) {
                        toast.error(error.response?.data?.message || "Payment verification failed", { id: loadingToast });
                    } finally {
                        setLoading(false);
                        toast.dismiss(loadingToast);
                    }
                },
                prefill: {
                    name: user.firstName + " " + user.lastName,
                    email: user.email,
                },
                theme: {
                    color: "#7e22ce",
                },
                modal: {
                    ondismiss: () => {
                        toast.dismiss(loadingToast);
                        setLoading(false);
                        toast.error("Payment cancelled");
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400 && error.response.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Payment initiation failed");
            }
            setLoading(false);
            toast.dismiss(loadingToast);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="max-w-4xl mx-auto">
                    {/* Astrologer Profile Section */}
                    <div className="bg-gray-800 rounded-2xl shadow-xl border border-purple-500/20 p-8 mb-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Profile Image */}
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500/30">
                                <img
                                    src={selectedAstrologer?.profileImage || "N/A"}
                                    alt="Astrologer"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                                    {`${selectedAstrologer?.firstName} ${selectedAstrologer?.lastName}`}
                                </h1>
                                <div className="space-y-3 text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Experience:</span>
                                        <span>{selectedAstrologer?.experience}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Languages:</span>
                                        <span>{selectedAstrologer?.languages.join(", ")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Specialization:</span>
                                        <span>Vedic Astrology, Numerology</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-gray-800 rounded-2xl shadow-xl border border-purple-500/20 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                            About Me
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            {selectedAstrologer?.bio}
                        </p>
                    </div>

                    {/* Subscription Plans */}
                    <div className="bg-gray-800 rounded-2xl shadow-xl border border-purple-500/20 p-8">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
                            Choose Your Subscription Plan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* 1 Day Plan */}
                            <div className="bg-gray-700/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                                <h3 className="text-xl font-semibold text-white mb-2">1 Day Plan</h3>
                                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                                    ₹{selectedAstrologer?.subscriptionPlans?.oneDay || "N/A"}
                                </p>
                                <ul className="text-gray-300 space-y-2 mb-6">
                                    <li>• 24-hour access</li>
                                    <li>• One detailed reading</li>
                                    <li>• Basic consultation</li>
                                </ul>
                                <button onClick={() => { handlePayment(selectedAstrologer?.subscriptionPlans?.oneDay, "oneDay") }} className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                                    Subscribe Now
                                </button>
                            </div>

                            {/* 1 Week Plan */}
                            <div className="bg-gray-700/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                                <h3 className="text-xl font-semibold text-white mb-2">1 Week Plan</h3>
                                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                                    ₹{selectedAstrologer?.subscriptionPlans?.oneWeek || "N/A"}
                                </p>
                                <ul className="text-gray-300 space-y-2 mb-6">
                                    <li>• 7-day access</li>
                                    <li>• Three detailed readings</li>
                                    <li>• Priority consultation</li>
                                </ul>
                                <button onClick={() => { handlePayment(selectedAstrologer?.subscriptionPlans?.oneWeek, "oneWeek") }} className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                                    Subscribe Now
                                </button>
                            </div>

                            {/* 1 Month Plan */}
                            <div className="bg-gray-700/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                                <h3 className="text-xl font-semibold text-white mb-2">1 Month Plan</h3>
                                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                                    ₹{selectedAstrologer?.subscriptionPlans?.oneMonth || "N/A"}
                                </p>
                                <ul className="text-gray-300 space-y-2 mb-6">
                                    <li>• 30-day access</li>
                                    <li>• Unlimited readings</li>
                                    <li>• VIP consultation</li>
                                </ul>
                                <button onClick={() => { handlePayment(selectedAstrologer?.subscriptionPlans?.oneMonth, "oneMonth") }} className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                                    Subscribe Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AstrologerDetail