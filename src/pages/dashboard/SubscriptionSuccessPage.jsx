import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { BASE_URL } from '../../config/URL';

const SubscriptionSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState(null);
    const [error, setError] = useState(null);

    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const fetchSessionDetails = async () => {
            if (!sessionId) {
                setError('No session ID found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/api/stripe/session/${sessionId}`);
                const data = await response.json();
                
                if (response.ok) {
                    setSessionData(data);
                } else {
                    setError(data.message || 'Failed to verify payment');
                }
            } catch (err) {
                setError('Error verifying payment');
            } finally {
                setLoading(false);
            }
        };

        fetchSessionDetails();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard/subscription')}
                        className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
                    >
                        Back to Plans
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for subscribing to our {sessionData?.metadata?.planName || 'plan'}!
                </p>
                
                {sessionData && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-gray-900 mb-2">Order Details:</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Plan:</span> {sessionData.metadata?.planName}</p>
                            <p><span className="font-medium">Amount:</span> ${sessionData.amountTotal?.toFixed(2)}/month</p>
                            {sessionData.customerEmail && (
                                <p><span className="font-medium">Email:</span> {sessionData.customerEmail}</p>
                            )}
                            <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium capitalize">{sessionData.status}</span></p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors w-full"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SubscriptionSuccessPage;
