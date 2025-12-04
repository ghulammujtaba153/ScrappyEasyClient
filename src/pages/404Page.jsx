import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-5">
            <div className="text-center">
                <div className="mb-8 animate-bounce">
                    <svg
                        className="mx-auto h-32 w-32 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h1 className="text-9xl font-bold text-black mb-4 animate-pulse">404</h1>
                <h2 className="text-4xl font-bold text-black mb-4">Page Not Found</h2>
                <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/dashboard"
                        className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        to="/login"
                        className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-2 border-white"
                    >
                        Back to Login
                    </Link>
                </div>

                <div className="mt-12">
                    <p className="text-purple-200 text-sm">
                        Error Code: 404 | Page Not Found
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
