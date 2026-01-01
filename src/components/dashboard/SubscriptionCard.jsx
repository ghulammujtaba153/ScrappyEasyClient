import React, { useState } from 'react';
import { FaCheck, FaArrowRight, FaSpinner, FaCrown } from 'react-icons/fa';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const SubscriptionCard = ({ plan, isCurrentPlan = false }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSubscribe = async () => {
        if (isCurrentPlan) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planName: plan.name,
                    price: plan.price,
                    interval: plan.interval,
                    packageId: plan.id || null,
                    userId: user?._id || null,
                }),
            });

            const data = await response.json();

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                console.error('Failed to create checkout session');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                isCurrentPlan
                    ? 'bg-gradient-to-br from-green-600 to-green-700 text-white transform scale-105 relative ring-4 ring-green-400 ring-opacity-50'
                    : plan.featured
                    ? 'bg-green-700 text-white transform scale-105 relative'
                    : 'bg-white'
            }`}
        >
            {/* Current Plan Badge */}
            {isCurrentPlan && (
                <div className="absolute top-6 right-6 bg-white text-green-700 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FaCrown className="text-yellow-500" />
                    Current Plan
                </div>
            )}
            
            {/* Badge */}
            {!isCurrentPlan && plan.badge && (
                <div className="absolute top-6 right-6 bg-white text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                    {plan.badge}
                </div>
            )}

            <div className="p-8">
                {/* Plan Name */}
                <h3
                    className={`text-lg font-semibold mb-4 ${
                        isCurrentPlan || plan.featured ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                    <span
                        className={`text-5xl font-bold ${
                            isCurrentPlan || plan.featured ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                        ${plan.price}
                    </span>
                    {plan.interval !== 'one-time' && (
                        <span
                            className={`text-lg ${
                                isCurrentPlan || plan.featured ? 'text-white/80' : 'text-gray-600'
                            }`}
                        >
                            {' '}
                            / {plan.interval === 'month' ? 'month' : plan.interval === 'year' ? 'year' : plan.interval === 'week' ? 'week' : plan.interval}
                        </span>
                    )}
                    {plan.interval === 'one-time' && (
                        <span
                            className={`text-lg ${
                                isCurrentPlan || plan.featured ? 'text-white/80' : 'text-gray-600'
                            }`}
                        >
                            {' '}
                            one-time
                        </span>
                    )}
                </div>

                {/* Description */}
                <p
                    className={`mb-6 ${
                        isCurrentPlan || plan.featured ? 'text-white/90' : 'text-gray-600'
                    }`}
                >
                    {plan.description}
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleSubscribe}
                    disabled={loading || isCurrentPlan}
                    className={`w-full py-3 px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all mb-8 ${
                        isCurrentPlan
                            ? 'bg-green-100 text-green-700 cursor-not-allowed border-2 border-green-500'
                            : plan.featured
                            ? 'bg-white text-green-700 hover:bg-gray-50 disabled:opacity-70'
                            : 'bg-gray-100 text-green-700 hover:bg-green-50 disabled:opacity-70'
                    }`}
                >
                    {isCurrentPlan ? (
                        <>
                            <FaCrown className="text-sm text-yellow-500" />
                            Current Package
                        </>
                    ) : loading ? (
                        <>
                            <FaSpinner className="animate-spin text-sm" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Get Started Now
                            <FaArrowRight className="text-sm" />
                        </>
                    )}
                </button>

                {/* Features */}
                <div>
                    <h4
                        className={`font-semibold mb-4 ${
                            isCurrentPlan || plan.featured ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                        What's Included:
                    </h4>
                    <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <FaCheck
                                    className={`mt-1 flex-shrink-0 ${
                                        isCurrentPlan || plan.featured ? 'text-white' : 'text-gray-600'
                                    }`}
                                />
                                <span
                                    className={`text-sm ${
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

export default SubscriptionCard;
