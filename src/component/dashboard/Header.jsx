import React from "react";
import { useAuth } from "../../context/authContext";

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-md border-b border-gray-200">
            <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
