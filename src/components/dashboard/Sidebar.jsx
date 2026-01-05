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
    MdLocationOn,
    MdSupport,
    MdBuild,
    MdCall,
    MdCardMembership,
    MdAccountCircle,
    MdLogout,
    MdMeetingRoom
} from "react-icons/md";
import { useAuth } from "../../context/authContext";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [expandedCountries, setExpandedCountries] = useState({});
    const [expandedStates, setExpandedStates] = useState({});
    const {logout} = useAuth();

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
        // {
        //     name: "Manage Categories",
        //     path: "/dashboard/category",
        //     icon: <MdCategory className="w-5 h-5" />,
        // },
        {
            name: "Operations",
            path: "/dashboard/operations",
            icon: <MdBuild className="w-5 h-5" />,
        },
        {
            name: "Qualified Leads",
            path: "/dashboard/qualified-leads",
            icon: <MdBuild className="w-5 h-5" />,
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
            name: "Collabortion",
            path: "/dashboard/collaboration",
            icon: <MdMeetingRoom className="w-5 h-5" />,
        },
        // {
        //     name: "Call Automation",
        //     path: "/dashboard/call",
        //     icon: <MdCall className="w-5 h-5" />,
        // },
        {
            name: "Subscription",
            path: "/dashboard/subscription",
            icon: <MdCardMembership className="w-5 h-5" />,
        },
        {
            name: "Twilio Settings",
            path: "/dashboard/twilio-settings",
            icon: <MdSettings className="w-5 h-5" />,
        },
        {
            name: "Support",
            path: "/dashboard/support",
            icon: <MdSupport className="w-5 h-5" />,
        },
        {
            name: "Profile Settings",
            path: "/dashboard/profile-settings",
            icon: <MdAccountCircle className="w-5 h-5" />,
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
                } shadow-2xl z-50 overflow-y-auto overflow-x-hidden bg-gray-50 custom-scrollbar`}
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
                    // Handle active state for nested routes
                    const isActive = item.path === '/dashboard'
                        ? location.pathname === '/dashboard'
                        : location.pathname.startsWith(item.path);
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

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-6 py-3 transition-all mx-3 w-[calc(100%-1.5rem)] hover:bg-red-50 hover:text-red-600 text-gray-700 rounded-[30px] mt-4"
                >
                    <MdLogout className="w-5 h-5" />
                    {!isCollapsed && (
                        <span className="font-medium">Logout</span>
                    )}
                </button>

                {/* Categories Section */}
                
                


            </nav>
        </aside>
    );
};

export default Sidebar;