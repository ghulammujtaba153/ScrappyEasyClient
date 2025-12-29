import React, { useState } from 'react';
import { FaCheck, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { BASE_URL } from '../../config/URL';

const SubscriptionCard = ({ plan }) => {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
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
                    packageId: plan.id || null,
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
                plan.featured
                    ? 'bg-green-700 text-white transform scale-105 relative'
                    : 'bg-white'
            }`}
        >
            {/* Badge */}
            {plan.badge && (
                <div className="absolute top-6 right-6 bg-white text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                    {plan.badge}
                </div>
            )}

            <div className="p-8">
                {/* Plan Name */}
                <h3
                    className={`text-lg font-semibold mb-4 ${
                        plan.featured ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                    <span
                        className={`text-5xl font-bold ${
                            plan.featured ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                        ${plan.price}
                    </span>
                    <span
                        className={`text-lg ${
                            plan.featured ? 'text-white/80' : 'text-gray-600'
                        }`}
                    >
                        {' '}
                        / month
                    </span>
                </div>

                {/* Description */}
                <p
                    className={`mb-6 ${
                        plan.featured ? 'text-white/90' : 'text-gray-600'
                    }`}
                >
                    {plan.description}
                </p>

                {/* CTA Button */}
                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all mb-8 ${
                        plan.featured
                            ? 'bg-white text-green-700 hover:bg-gray-50 disabled:opacity-70'
                            : 'bg-gray-100 text-green-700 hover:bg-green-50 disabled:opacity-70'
                    }`}
                >
                    {loading ? (
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
                            plan.featured ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                        What's Included:
                    </h4>
                    <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <FaCheck
                                    className={`mt-1 flex-shrink-0 ${
                                        plan.featured ? 'text-white' : 'text-gray-600'
                                    }`}
                                />
                                <span
                                    className={`text-sm ${
                                        plan.featured ? 'text-white/90' : 'text-gray-600'
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
