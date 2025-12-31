import React from 'react'
import SubscriptionCard from '../../components/dashboard/SubscriptionCard'

const SubscriptionPage = () => {
    const plans = [
        {
            name: 'Starter',
            price: 19,
            description: 'Perfect for small scraping needs.',
            featured: false,
            badge: null,
            features: [
                '1 AI Agent (basic logic)',
                'Unlimited Layout Generator',
                'Embed widgets & internal tools',
                'Auto-optimized landing pages',
                '500 site visits/month',
                'Email support'
            ]
        },
        {
            name: 'Pro',
            price: 39,
            description: 'Ideal for marketers and freelancers.',
            featured: true,
            badge: 'Save 20%',
            features: [
                'Everything in Starter',
                'Unlimited AI agents (advanced)',
                'Builder with smart templates',
                'Custom domain support',
                '10,000 site visits/month',
                'Priority support'
            ]
        },
        {
            name: 'Agency',
            price: 79,
            description: 'For high volume scraping and outreach.',
            featured: false,
            badge: null,
            features: [
                'Everything in Pro',
                'Unlimited projects workspaces',
                'Team collaboration (10+ users)',
                'White-labeling options',
                'Analytics dashboard',
                'Dedicated support manager'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
                    <p className="text-xl text-gray-600">Select the perfect plan for your scraping needs</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <SubscriptionCard key={index} plan={plan} />
                    ))}
                </div>

                {/* Footer Note */}
                <div className="text-center mt-12">
                    <p className="text-gray-600">
                        All plans include free updates and 24/7 customer support
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage
