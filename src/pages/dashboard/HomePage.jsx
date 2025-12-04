import React from "react";
import { useAuth } from "../../context/authContext";

const HomePage = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-gray-600">
                    Here's an overview of your account and recent activity.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Total Scrapes</p>
                            <p className="text-3xl font-bold mt-2">0</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0 2.21 3.582 4 8 4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Data Points</p>
                            <p className="text-3xl font-bold mt-2">0</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Success Rate</p>
                            <p className="text-3xl font-bold mt-2">100%</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                        <p className="text-sm text-gray-600 font-medium">Full Name</p>
                        <p className="text-gray-800 font-semibold mt-1">{user?.name}</p>
                    </div>
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                        <p className="text-sm text-gray-600 font-medium">Email</p>
                        <p className="text-gray-800 font-semibold mt-1">{user?.email}</p>
                    </div>
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                        <p className="text-sm text-gray-600 font-medium">Phone</p>
                        <p className="text-gray-800 font-semibold mt-1">{user?.phone}</p>
                    </div>
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                        <p className="text-sm text-gray-600 font-medium">Country</p>
                        <p className="text-gray-800 font-semibold mt-1">{user?.country}</p>
                    </div>
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                        <p className="text-sm text-gray-600 font-medium">Role</p>
                        <p className="text-gray-800 font-semibold mt-1 capitalize">{user?.role}</p>
                    </div>
                    <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                        <p className="text-sm text-gray-600 font-medium">Status</p>
                        <p className="text-green-600 font-semibold mt-1 capitalize">{user?.status}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;