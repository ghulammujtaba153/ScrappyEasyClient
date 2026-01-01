import React, { useState, useEffect } from 'react'
import SubscriptionCard from '../../components/dashboard/SubscriptionCard'
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/authContext';

const SubscriptionPage = () => {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentSubscription, setCurrentSubscription] = useState(null)
    const { token } = useAuth();

    const {user} = useAuth();

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/packages`);
            // Transform backend data to match frontend plan structure
            const transformedPlans = res.data.packages.map((pkg, index) => ({
                id: pkg._id,
                name: pkg.name,
                price: pkg.price,
                interval: pkg.interval,
                description: pkg.description || '',
                featured: index === 1, // Make second plan featured by default
                badge: index === 1 ? 'Popular' : null,
                features: pkg.features || []
            }));
            setPlans(transformedPlans);
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCurrentSubscription = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/subscriptions/my-subscription/${user._id}`);
            setCurrentSubscription(res.data.subscription);
        } catch (error) {
            console.error('Error fetching current subscription:', error);
        }
    }

    useEffect(() => {
        fetchPackages();
        if (token) {
            fetchCurrentSubscription();
        }
    }, [token]);

    if(loading) {
        return <Loader/>
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
                    <p className="text-xl text-gray-600">Select the perfect plan for your scraping needs</p>
                </div>

                {/* Current Subscription Banner */}
                {currentSubscription && (
                    <div className="mb-8 max-w-6xl mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Current Plan</p>
                                <h3 className="text-2xl font-bold">{currentSubscription.packageName}</h3>
                                <p className="text-green-100 mt-1">
                                    ${currentSubscription.amount}/{currentSubscription.isOneTime ? 'one-time' : currentSubscription.package?.interval}
                                </p>
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur">
                                    <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                                    {currentSubscription.status}
                                </span>
                                {currentSubscription.endDate && (
                                    <p className="text-green-100 text-sm mt-2">
                                        Renews on {new Date(currentSubscription.endDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <SubscriptionCard 
                            key={index} 
                            plan={plan} 
                            isCurrentPlan={currentSubscription?.packageId === plan.id}
                        />
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
