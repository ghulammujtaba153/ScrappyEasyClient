import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { BASE_URL } from "../../config/URL";
import Notification from "../../components/common/Notification";
import { FaCamera, FaWallet, FaUniversity, FaTimes, FaSpinner, FaCheck, FaRocket, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { PLANS } from "../../config/plans";

const SubscriptionPage = () => {
    const { user, token, updateUser, accessStatus } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Prioritize subscription data from accessStatus if available
    const displayUser = accessStatus?.subscription || user || {};

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    const handleSelectPlan = (plan) => {
        if (user?.planId === plan.id && (user?.status === "active" || user?.subscriptionId)) return;
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            setScreenshotPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!screenshot) {
            setNotification({ message: "Please upload a payment screenshot", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("planId", selectedPlan.id);
            formData.append("planName", selectedPlan.name);
            formData.append("planAmount", selectedPlan.price);
            formData.append("screenshot", screenshot);

            const response = await axios.post(`${BASE_URL}/api/user/request-subscription/${user._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setNotification({ 
                    message: "Subscription request submitted! Our team will verify it shortly.", 
                    type: "success" 
                });
                updateUser(response.data.user);
                setIsModalOpen(false);
                setScreenshot(null);
                setScreenshotPreview(null);
            }
        } catch (error) {
            console.error("Subscription error:", error);
            setNotification({ 
                message: error.response?.data?.message || "Failed to submit request", 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="max-w-7xl mx-auto">
                {(user?.status === "active" || accessStatus?.isAuthorized) && (
                    <div className="mb-12 max-w-lg">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Subscription Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Card: Plan Name */}
                            <div className="bg-white/60 backdrop-blur-sm p-6 py-8 rounded-[2rem] border border-gray-100/50 flex flex-col gap-5 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <FaRocket size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan Name</p>
                                    <p className="text-xl font-bold text-gray-900 leading-tight">
                                        {displayUser.planName || displayUser.name || "Pro Plan"}
                                    </p>
                                </div>
                            </div>

                            {/* Card: Amount Paid */}
                            <div className="bg-white/60 backdrop-blur-sm p-6 py-8 rounded-[2rem] border border-gray-100/50 flex flex-col gap-5 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <FaWallet size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</p>
                                    <p className="text-2xl font-bold text-gray-900 leading-tight">
                                        {(displayUser.planAmount || displayUser.amount || "0").startsWith('$') 
                                            ? (displayUser.planAmount || displayUser.amount) 
                                            : `$${displayUser.planAmount || displayUser.amount || "0"}`}
                                    </p>
                                </div>
                            </div>

                            {/* Card: Expiry Date */}
                            <div className="bg-white/60 backdrop-blur-sm p-6 py-8 rounded-[2rem] border border-gray-100/50 flex flex-col gap-5 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <FaCalendarAlt size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry Date</p>
                                    <p className="text-lg font-bold text-gray-900 leading-tight whitespace-pre-line">
                                        {formatDate(displayUser.expiryDate || displayUser.planExpiry).replace(', ', ',\n')}
                                    </p>
                                </div>
                            </div>

                            {/* Card: Member Since */}
                            <div className="bg-white/60 backdrop-blur-sm p-6 py-8 rounded-[2rem] border border-gray-100/50 flex flex-col gap-5 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <FaCalendarAlt size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Since</p>
                                    <p className="text-lg font-bold text-gray-900 leading-tight whitespace-pre-line">
                                        {formatDate(displayUser.createdAt).replace(', ', ',\n')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Simple, Transparent Pricing</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that fits your growth strategy. No hidden fees, cancel anytime.
                    </p>
                </div>

                {user?.status === "under_review" && (
                    <div className="mb-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl animate-pulse">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FaSpinner className="animate-spin text-yellow-600 h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-yellow-700 font-bold">
                                    Your subscription request for <span className="underline">{user.planName}</span> is currently under manual review.
                                </p>
                                <p className="text-yellow-600 text-sm mt-1">
                                    Average verification time: 2-4 hours. Check back soon!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {PLANS.map((plan) => {
                        const isCurrent = user?.planId === plan.id && user?.status === "active";
                        const isPending = user?.planId === plan.id && user?.status === "under_review";
                        
                        return (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-300 ${
                                    plan.highlight 
                                        ? "bg-gray-900 text-white shadow-2xl scale-105 z-10 ring-4 ring-primary ring-opacity-20" 
                                        : "bg-white text-gray-900 border-2 border-gray-100 hover:border-primary/30"
                                }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-4 right-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                        {plan.badge}
                                    </div>
                                )}
                                
                                <div className="mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                                        plan.highlight ? "bg-white/10" : "bg-primary/10"
                                    }`}>
                                        <plan.icon className={plan.highlight ? "text-white" : "text-primary"} size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black">{plan.price}</span>
                                        <span className={plan.highlight ? "text-gray-400" : "text-gray-500"}>
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className={`mt-4 text-sm ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="flex-1 space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <FaCheck className="mt-1 text-primary flex-shrink-0" size={12} />
                                            <span className={`text-sm ${plan.highlight ? "text-gray-300" : "text-gray-600"}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={isCurrent || isPending}
                                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                                        isCurrent 
                                            ? "bg-green-500 text-white cursor-default" 
                                            : isPending
                                            ? "bg-yellow-500 text-white cursor-default"
                                            : plan.highlight
                                            ? "bg-primary text-white hover:bg-primary/90 hover:-translate-y-1 shadow-xl hover:shadow-primary/30"
                                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                    }`}
                                >
                                    {isCurrent ? "Active Plan" : isPending ? "Pending Review" : plan.btnText}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Payment Modal */}
            {isModalOpen && selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
                        <div className="bg-gray-900 p-8 text-white flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black mb-1">Manual Payment Activation</h2>
                                <p className="text-gray-400 text-sm italic">Submit screenshot for {selectedPlan.name}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Payment Methods</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary flex-shrink-0">
                                                <FaWallet size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">JazzCash / EasyPaisa</p>
                                                <p className="font-mono font-bold text-gray-900">0335-1066628</p>
                                                <p className="text-[10px] text-gray-500 italic">Title: Map Harvest Admin</p>
                                            </div>

                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                                <FaUniversity size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Bank Transfer (HBL)</p>
                                                <p className="font-mono font-bold text-gray-900">1234567890</p>
                                                <p className="text-[10px] text-gray-500 italic">Branch Code: 1234</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                        <p className="text-xs text-primary font-medium leading-relaxed">
                                            Transfer exactly <span className="font-bold underline">{selectedPlan.price}</span> and upload the receipt. Your account will be activated within 2-4 hours after verification.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Upload Screenshot</h3>
                                    
                                    <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all overflow-hidden">
                                        {screenshotPreview ? (
                                            <img src={screenshotPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                                    <FaCamera size={20} />
                                                </div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Click to Upload</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading || !screenshot}
                                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(15,121,44,0.3)] hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <FaSpinner className="animate-spin" />
                                        <span>Submitting Receipt...</span>
                                    </div>
                                ) : "Submit for Activation"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPage;
