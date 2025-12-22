import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config/URL";
import countries from "../../data/countries";
import ukCities from "../../data/uk";
import {
    MdDashboard,
    MdCategory,
    MdSettings,
    MdMessage,
    MdMap,
    MdPhone,
    MdWhatsapp,
    MdChevronLeft,
    MdChevronRight,
    MdFolder,
    MdLocationOn
} from "react-icons/md";

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
            icon: <MdDashboard className="w-5 h-5" />,
        },
        {
            name: "Manage Categories",
            path: "/dashboard/category",
            icon: <MdCategory className="w-5 h-5" />,
        },
        {
            name: "Operations",
            path: "/dashboard/operations",
            icon: <MdSettings className="w-5 h-5" />,
        },
        {
            name: "Message Automation",
            path: "/dashboard/message-automation",
            icon: <MdMessage className="w-5 h-5" />,
        },
        {
            name: "Map",
            path: "/dashboard/heat-map",
            icon: <MdMap className="w-5 h-5" />,
        },
        {
            name: "Hire Cold Caller",
            path: "/dashboard/cold-caller",
            icon: <MdPhone className="w-5 h-5" />,
        },
        {
            name: "WhatsApp Automation",
            path: "/dashboard/whatsapp-automation",
            icon: <MdWhatsapp className="w-5 h-5" />,
        },
        {
            name: "Call Automation",
            path: "/dashboard/call",
            icon: <MdPhone className="w-5 h-5" />,
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
                } shadow-2xl z-50 overflow-y-auto bg-gray-50 custom-scrollbar`}
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#0F792C #f3f4f6'
            }}
        >
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f3f4f6;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #0F792C;
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #0a5a20;
                }
            `}</style>
            <div className="flex items-center justify-between p-6 bg-white">
                {!isCollapsed && (
                    <img src="/logo.png" alt="" />
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-[#0F792C] hover:text-white rounded-lg transition-colors"
                >
                    {isCollapsed ? (
                        <MdChevronRight className="w-5 h-5" />
                    ) : (
                        <MdChevronLeft className="w-5 h-5" />
                    )}
                </button>
            </div>

            <nav className="mt-6">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-3 transition-all mx-3 ${isActive
                                ? "bg-[#0F792C] text-white rounded-[30px]"
                                : "hover:bg-white hover:text-[#0F792C] text-gray-700 rounded-[30px]"
                                }`}
                        >
                            <span className={isActive ? "text-white" : ""}>{item.icon}</span>
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
                                            <MdFolder className="text-lg" />
                                            <span className="font-medium text-gray-700">{category.name}</span>
                                        </div>
                                        <MdChevronRight
                                            className={`w-4 h-4 transition-transform ${expandedCategories[category._id] ? 'rotate-90' : ''}`}
                                        />
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
                                                        <MdChevronRight
                                                            className={`w-3 h-3 transition-transform ${expandedCountries[`${category._id}-${country.name}`] ? 'rotate-90' : ''}`}
                                                        />
                                                    </button>

                                                    {/* States */}
                                                    {expandedCountries[`${category._id}-${country.name}`] && country.states && country.states.map((state) => (
                                                        <div key={state.name} className="ml-4">
                                                            <button
                                                                onClick={() => toggleState(category._id, country.name, state.name)}
                                                                className="w-full flex items-center justify-between px-6 py-2 hover:bg-blue-50 transition-colors text-left"
                                                            >
                                                                <span className="text-xs text-gray-500">{state.name}</span>
                                                                <MdChevronRight
                                                                    className={`w-3 h-3 transition-transform ${expandedStates[`${category._id}-${country.name}-${state.name}`] ? 'rotate-90' : ''}`}
                                                                />
                                                            </button>

                                                            {/* Cities */}
                                                            {expandedStates[`${category._id}-${country.name}-${state.name}`] && state.cities && (
                                                                <div className="ml-4 max-h-48 overflow-y-auto">
                                                                    {state.cities.map((city) => (
                                                                        <button
                                                                            key={city}
                                                                            onClick={() => handleCityClick(category.name, country.name, state.name, city)}
                                                                            className="w-full text-left px-6 py-1.5 text-xs text-gray-400 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center gap-2"
                                                                        >
                                                                            <MdLocationOn className="text-sm" /> {city}
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
                                                    <MdChevronRight
                                                        className={`w-3 h-3 transition-transform ${expandedCountries[`${category._id}-United Kingdom`] ? 'rotate-90' : ''}`}
                                                    />
                                                </button>

                                                {/* UK Cities (no states) */}
                                                {expandedCountries[`${category._id}-United Kingdom`] && (
                                                    <div className="ml-4 max-h-64 overflow-y-auto">
                                                        {ukCities.map((city) => (
                                                            <button
                                                                key={city}
                                                                onClick={() => handleCityClick(category.name, 'United Kingdom', 'UK', city)}
                                                                className="w-full text-left px-6 py-1.5 text-xs text-gray-400 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center gap-2"
                                                            >
                                                                <MdLocationOn className="text-sm" /> {city}
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