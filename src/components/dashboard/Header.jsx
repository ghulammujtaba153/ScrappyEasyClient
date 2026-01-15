import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { MdKeyboardArrowDown, MdMenu } from "react-icons/md";
import NotificationDropdown from "./NotificationDropdown";

const Header = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-gray-50 sticky top-0 z-40">
            <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Toggle menu"
                    >
                        <MdMenu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Dashboard</h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
                    {/* Notification Dropdown Component */}
                    <NotificationDropdown />

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-1 sm:gap-3 hover:bg-gray-100 px-2 sm:px-3 py-2 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#0F792C] to-[#0a5a20] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <MdKeyboardArrowDown
                                className={`hidden sm:block w-5 h-5 text-gray-600 transition-transform ${showProfileMenu ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-3 sm:p-4 border-b border-gray-200">
                                    <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{user?.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm sm:text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
