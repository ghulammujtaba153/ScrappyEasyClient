import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCopy, FiCheck } from 'react-icons/fi';

const LocationDetails = () => {
    const { category, country, state, city } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    // Country flag mapping
    const countryFlags = {
        'USA': '🇺🇸',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'United Kingdom': '🇬🇧'
    };

    // Generate Google Maps search string
    const googleMapsSearchString = city
        ? `${decodeURIComponent(category)} in ${decodeURIComponent(city)}, ${decodeURIComponent(state)}, ${country}`
        : `${decodeURIComponent(category)} in ${decodeURIComponent(state)}, ${country}`;

    const handleCopySearchString = () => {
        navigator.clipboard.writeText(googleMapsSearchString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors mb-4"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>
                <h1 className="text-4xl font-bold text-gray-800">Location Details</h1>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
                {/* Country Flag */}
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4">
                        {countryFlags[country] || '🌍'}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">{country}</h2>
                </div>

                {/* Location Path */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-3 text-lg flex-wrap">
                        <span className="font-semibold text-purple-700">{decodeURIComponent(category)}</span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-semibold text-blue-700">{country}</span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-semibold text-green-700">{decodeURIComponent(state)}</span>
                        {city && (
                            <>
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="font-semibold text-orange-700">{decodeURIComponent(city)}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 ${city ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
                    {/* Category */}
                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">Category</h3>
                        </div>
                        <p className="text-xl font-bold text-purple-700">{decodeURIComponent(category)}</p>
                    </div>

                    {/* Country */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">Country</h3>
                        </div>
                        <p className="text-xl font-bold text-blue-700">{country}</p>
                    </div>

                    {/* State */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700">State</h3>
                        </div>
                        <p className="text-xl font-bold text-green-700">{decodeURIComponent(state)}</p>
                    </div>

                    {/* City */}
                    {city && (
                        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">City</h3>
                            </div>
                            <p className="text-xl font-bold text-orange-700">{decodeURIComponent(city)}</p>
                        </div>
                    )}
                </div>

                {/* Google Maps Search String */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Google Maps Search String
                        </h3>
                        <button
                            onClick={handleCopySearchString}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${copied
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <FiCopy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-gray-800 font-mono text-sm break-words">
                            {googleMapsSearchString}
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        💡 Copy this string and paste it into Google Maps search to find relevant locations
                    </p>
                </div>

                {/* Complete Address */}
                <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Complete Address</h3>
                    <p className="text-xl text-gray-800">
                        {city ? `${decodeURIComponent(city)}, ` : ''}{decodeURIComponent(state)}, {country}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LocationDetails;
