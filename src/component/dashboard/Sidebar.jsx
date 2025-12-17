import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config/URL";
import countries from "../../data/countries";
import ukCities from "../../data/uk";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [expandedCountries, setExpandedCountries] = useState({});
    const [expandedStates, setExpandedStates] = useState({});

    // Fetch all categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/category`);
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to load categories:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: "Manage Categories",
            path: "/dashboard/category",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
            ),
        },
        {
            name: "Operations",
            path: "/dashboard/operations",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            name: "Message Automation",
            path: "/dashboard/message-automation",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            name: "Map",
            path: "/dashboard/heat-map",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            name: "Hire Cold Caller",
            path: "/dashboard/cold-caller",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            name: "WhatsApp Automation",
            path: "/dashboard/whatsapp-automation",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        }
    ];

    const countryFlags = {
        'USA': '🇺🇸',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'United Kingdom': '🇬🇧'
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const toggleCountry = (categoryId, countryName) => {
        const key = `${categoryId}-${countryName}`;
        setExpandedCountries(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const toggleState = (categoryId, countryName, stateName) => {
        const key = `${categoryId}-${countryName}-${stateName}`;
        setExpandedStates(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleCityClick = (countryName, stateName, cityName) => {
        navigate(`/dashboard/location/${encodeURIComponent(countryName)}/${encodeURIComponent(stateName)}/${encodeURIComponent(cityName)}`);
    };

    return (
        <aside
            className={`text-black h-screen fixed left-0 top-0 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
                } shadow-2xl z-50 overflow-y-auto bg-gray-50`}
        >
            <div className="flex items-center justify-between p-6 border-b border-purple-600 bg-white">
                {!isCollapsed && (
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        🗺️ Scraper
                    </h2>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                >
                    <svg
                        className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <nav className="mt-6">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-3 transition-all ${isActive
                                ? "bg-white text-purple-700 border-r-4 border-purple-700"
                                : "hover:bg-white hover:text-purple-700 text-gray-700"
                                }`}
                        >
                            <span className={isActive ? "text-purple-700" : ""}>{item.icon}</span>
                            {!isCollapsed && (
                                <span className="font-medium">{item.name}</span>
                            )}
                        </Link>
                    );
                })}

                {/* Categories Section */}
                {!isCollapsed && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <div className="px-6 py-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Categories & Locations
                            </h3>
                        </div>

                        {loading ? (
                            <div className="px-6 py-4 text-sm text-gray-500">Loading categories...</div>
                        ) : categories.length === 0 ? (
                            <div className="px-6 py-4 text-sm text-gray-500">No categories found</div>
                        ) : (
                            categories.map((category) => (
                                <div key={category._id}>
                                    {/* Category */}
                                    <button
                                        onClick={() => toggleCategory(category._id)}
                                        className="w-full flex items-center justify-between px-6 py-3 hover:bg-white transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">📁</span>
                                            <span className="font-medium text-gray-700">{category.name}</span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${expandedCategories[category._id] ? 'rotate-90' : ''
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {/* Countries under this category */}
                                    {expandedCategories[category._id] && (
                                        <div className="ml-4">
                                            {countries.map((country) => (
                                                <div key={country.name}>
                                                    {/* Country */}
                                                    <button
                                                        onClick={() => toggleCountry(category._id, country.name)}
                                                        className="w-full flex items-center justify-between px-6 py-2 hover:bg-purple-50 transition-colors text-left"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{countryFlags[country.name] || '🌍'}</span>
                                                            <span className="text-sm text-gray-600">{country.name}</span>
                                                        </div>
                                                        <svg
                                                            className={`w-3 h-3 transition-transform ${expandedCountries[`${category._id}-${country.name}`] ? 'rotate-90' : ''
                                                                }`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>

                                                    {/* States */}
                                                    {expandedCountries[`${category._id}-${country.name}`] && country.states && country.states.map((state) => (
                                                        <div key={state.name} className="ml-4">
                                                            <button
                                                                onClick={() => toggleState(category._id, country.name, state.name)}
                                                                className="w-full flex items-center justify-between px-6 py-2 hover:bg-blue-50 transition-colors text-left"
                                                            >
                                                                <span className="text-xs text-gray-500">{state.name}</span>
                                                                <svg
                                                                    className={`w-3 h-3 transition-transform ${expandedStates[`${category._id}-${country.name}-${state.name}`] ? 'rotate-90' : ''
                                                                        }`}
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </button>

                                                            {/* Cities */}
                                                            {expandedStates[`${category._id}-${country.name}-${state.name}`] && state.cities && (
                                                                <div className="ml-4 max-h-48 overflow-y-auto">
                                                                    {state.cities.map((city) => (
                                                                        <button
                                                                            key={city}
                                                                            onClick={() => handleCityClick(category.name, country.name, state.name, city)}
                                                                            className="w-full text-left px-6 py-1.5 text-xs text-gray-400 hover:bg-green-50 hover:text-green-700 transition-colors"
                                                                        >
                                                                            📍 {city}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}

                                            {/* United Kingdom - Special case (no states, just cities) */}
                                            <div>
                                                <button
                                                    onClick={() => toggleCountry(category._id, 'United Kingdom')}
                                                    className="w-full flex items-center justify-between px-6 py-2 hover:bg-purple-50 transition-colors text-left"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">🇬🇧</span>
                                                        <span className="text-sm text-gray-600">United Kingdom</span>
                                                    </div>
                                                    <svg
                                                        className={`w-3 h-3 transition-transform ${expandedCountries[`${category._id}-United Kingdom`] ? 'rotate-90' : ''
                                                            }`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>

                                                {/* UK Cities (no states) */}
                                                {expandedCountries[`${category._id}-United Kingdom`] && (
                                                    <div className="ml-4 max-h-64 overflow-y-auto">
                                                        {ukCities.map((city) => (
                                                            <button
                                                                key={city}
                                                                onClick={() => handleCityClick(category.name, 'United Kingdom', 'UK', city)}
                                                                className="w-full text-left px-6 py-1.5 text-xs text-gray-400 hover:bg-green-50 hover:text-green-700 transition-colors"
                                                            >
                                                                📍 {city}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;