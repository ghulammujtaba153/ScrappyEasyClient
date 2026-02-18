import React, { useState } from 'react';
import { FaCheck, FaArrowRight, FaSpinner, FaCrown } from 'react-icons/fa';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const LemonSqueezyCard = ({ plan, isCurrentPlan = false }) => {
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuth();

    const handleSubscribe = async () => {
        if (isCurrentPlan) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/lemon-squeezy/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    variantId: plan.variantId,
                    userId: user?._id || null,
                }),
            });

            const data = await response.json();

            if (data.url) {
                // Redirect to Lemon Squeezy Checkout
                window.location.href = data.url;
            } else {
                console.error('Failed to create Lemon Squeezy checkout');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                isCurrentPlan
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white relative ring-4 ring-green-400 ring-opacity-50'
                    : plan.featured
                    ? 'bg-gradient-to-br from-green-700 to-green-900 text-white relative shadow-2xl'
                    : 'bg-white border border-gray-100'
            }`}
        >
            {/* Current Plan Badge */}
            {isCurrentPlan && (
                <div className="absolute top-4 right-4 bg-white text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                    <FaCrown className="text-yellow-500" />
                    ACTIVATED
                </div>
            )}
            
            {/* badge */}
            {!isCurrentPlan && plan.badge && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    {plan.badge}
                </div>
            )}

            <div className="p-8">
                {/* Plan Name */}
                <h3
                    className={`text-xl font-bold mb-4 ${
                        isCurrentPlan || plan.featured ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                        <span
                            className={`text-5xl font-extrabold ${
                                isCurrentPlan || plan.featured ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            {plan.price}
                        </span>
                        {plan.interval !== 'one-time' && (
                            <span
                                className={`text-lg font-medium ${
                                    isCurrentPlan || plan.featured ? 'text-white/80' : 'text-gray-500'
                                }`}
                            >
                                /{plan.interval}
                            </span>
                        )}
                        {plan.interval === 'one-time' && (
                             <span
                                 className={`text-sm font-medium uppercase tracking-wider ${
                                     isCurrentPlan || plan.featured ? 'text-white/70' : 'text-gray-400'
                                 }`}
                             >
                                 {' '} Lifetime
                             </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                <p
                    className={`mb-8 text-sm leading-relaxed ${
                        isCurrentPlan || plan.featured ? 'text-white/90' : 'text-gray-600'
                    }`}
                >
                    {plan.description || "Get access to all premium features and automation tools."}
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleSubscribe}
                    disabled={loading || isCurrentPlan}
                    className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group ${
                        isCurrentPlan
                            ? 'bg-white/20 text-white cursor-not-allowed backdrop-blur-sm border border-white/30'
                            : plan.featured
                            ? 'bg-white text-green-800 hover:bg-gray-50'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                    }`}
                >
                    {isCurrentPlan ? (
                        <>
                            <FaCheck className="text-sm" />
                            Your Current Plan
                        </>
                    ) : loading ? (
                        <>
                            <FaSpinner className="animate-spin text-sm" />
                            Redirecting...
                        </>
                    ) : (
                        <>
                            {plan.interval === 'one-time' ? 'Buy Now' : 'Start Subscription'}
                            <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </button>

                {/* Separator */}
                <div className={`my-8 border-t ${isCurrentPlan || plan.featured ? 'border-white/20' : 'border-gray-100'}`}></div>

                {/* Features */}
                <div>
                    <h4
                        className={`text-sm font-bold uppercase tracking-wider mb-4 ${
                            isCurrentPlan || plan.featured ? 'text-white/90' : 'text-gray-400'
                        }`}
                    >
                        Whats Included:
                    </h4>
                    <ul className="space-y-4">
                        {(plan.features || ["Premium Access", "Custom Reports", "Priority Support"]).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <div className={`mt-1 p-0.5 rounded-full ${isCurrentPlan || plan.featured ? 'bg-white/20 text-white' : 'bg-green-50 text-green-600'}`}>
                                    <FaCheck className="text-[10px]" />
                                </div>
                                <span
                                    className={`text-sm font-medium ${
                                        isCurrentPlan || plan.featured ? 'text-white/90' : 'text-gray-600'
                                    }`}
                                >
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LemonSqueezyCard;
