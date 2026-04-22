import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const PendingReviewPage = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.status === "active") {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
                <div className="bg-primary p-8 text-white text-center relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 0 L100 0 L100 100 Z" fill="currentColor" />
                        </svg>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                            <FaClock className="text-4xl text-white animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Account Under Review</h1>
                        <p className="text-white/80">We're verifying your payment and information</p>
                    </div>
                </div>

                <div className="p-10 space-y-8">
                    <div className="space-y-4 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Hello, {user?.name || "Member"}!</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Thank you for joining us. Your account is currently in the <strong>under review</strong> state. 
                            Our team is currently verifying your payment screenshot and account details.
                        </p>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FaExclamationTriangle className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-blue-700 font-medium">
                                    Next Steps:
                                </p>
                                <ul className="mt-2 text-sm text-blue-600 list-disc list-inside space-y-1">
                                    <li>Automated payment verification is in progress.</li>
                                    <li>Manual review by our support team (usually 2-24 hours).</li>
                                    <li>You will receive an email once your access is granted.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={logout}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-300 text-center"
                        >
                            Sign Out
                        </button>
                        <Link
                            to="/lead-buddy-support"
                            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-primary/30 hover:shadow-2xl transition-all duration-300 text-center"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        Need immediate help? Reach out to us at <a href="mailto:support@leadbuddy.com" className="text-primary font-medium">support@leadbuddy.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PendingReviewPage;
