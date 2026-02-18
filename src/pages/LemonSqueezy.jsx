import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/URL';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/authContext';
import LemonSqueezyCard from '../components/dashboard/LemonSqueezyCard';
import { FaShieldAlt, FaRocket, FaGlobe } from 'react-icons/fa';

const LemonSqueezy = () => {
    const [loading, setLoading] = useState(true);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const { token, user } = useAuth();

    // Static pricing plans - Showing only the first item as requested
    const plans = [
        {
            id: 'starter',
            variantId: '1319387', // Using the one from .env
            name: 'Starter Plan',
            price: "20,000",
            interval: 'month',
            description: 'Perfect for beginners looking to automate their basic scraping tasks.',
            featured: true, // Mark it as featured to make it look premium
            features: ["5,000 Leads/mo", "Basic Automation", "24/7 Support", "Priority Updates"]
        }
    ];

    useEffect(() => {
        const fetchCurrentSubscription = async () => {
            if (!user?._id) return;
            try {
                const res = await axios.get(`${BASE_URL}/api/subscriptions/my-subscription/${user._id}`);
                setCurrentSubscription(res.data.subscription);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching current subscription:', error);
                setLoading(false);
            }
        };

        if (token) {
            fetchCurrentSubscription();
        } else {
            // Use a separate effect or just ensure this doesn't trigger a cascade if possible
            // But easiest is to just set it here since it's the initial render logic
            setLoading(false);
        }
    }, [token, user]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-green-100 selection:text-green-900">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-green-50/50 to-transparent pointer-events-none" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-green-600 font-bold tracking-widest uppercase text-sm">Pricing Plans</h2>
                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
                        Power up with <span className="text-green-600">Lemon Squeezy</span>
                    </h1>
                    <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        Choose the perfect plan for your business. Simple, transparent pricing with no hidden fees.
                    </p>
                </div>

                {/* Pricing Grid - Centered for single item */}
                <div className="flex justify-center mb-20">
                    <div className="w-full max-w-md">
                        {plans.map((plan) => (
                            <LemonSqueezyCard 
                                key={plan.id} 
                                plan={plan} 
                                isCurrentPlan={currentSubscription?.lsVariantId === plan.variantId}
                            />
                        ))}
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-12 border-t border-slate-200">
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md">
                        <div className="w-12 h-12 bg-green-100 flex items-center justify-center rounded-full mb-4">
                            <FaShieldAlt className="text-green-600 text-xl" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Secure Payments</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Processed securely by Lemon Squeezy with 256-bit encryption.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md">
                        <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-full mb-4">
                            <FaGlobe className="text-blue-600 text-xl" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Global Taxes</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Automatically handles VAT and global sales tax compliance.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md">
                        <div className="w-12 h-12 bg-purple-100 flex items-center justify-center rounded-full mb-4">
                            <FaRocket className="text-purple-600 text-xl" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Instant Setup</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Get access to your features immediately after successful payment.</p>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="bg-slate-900 rounded-[2rem] p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] -mr-32 -mt-32" />
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Still have questions?</h2>
                        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                            Need a custom plan for your enterprise? Contact our support team for a tailored solution.
                        </p>
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-green-900/20">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LemonSqueezy;