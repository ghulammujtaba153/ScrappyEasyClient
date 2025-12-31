import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { MdNotifications, MdKeyboardArrowDown } from "react-icons/md";

const Header = () => {
    const { user, logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // Sample notifications - replace with real data
    const notifications = [
        { id: 1, message: "New scraping job completed", time: "5 min ago", unread: true },
        { id: 2, message: "WhatsApp automation started", time: "1 hour ago", unread: true },
        { id: 3, message: "System update available", time: "2 hours ago", unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-gray-50">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                </div>

                <div className="flex items-center gap-6">
                    {/* Notification Bell */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 bg-gray-100 rounded-full transition-colors"
                        >
                            <MdNotifications className="w-6 h-6 text-gray-600 m-1" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 bg-[#0F792C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notification.unread ? "bg-blue-50" : ""
                                                    }`}
                                            >
                                                <p className="text-sm text-gray-800">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">
                                            No notifications
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-gray-200 text-center">
                                    <button className="text-sm text-[#0F792C] hover:underline font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0F792C] to-[#0a5a20] rounded-full flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <MdKeyboardArrowDown
                                className={`w-5 h-5 text-gray-600 transition-transform ${showProfileMenu ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="font-semibold text-gray-800">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
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
