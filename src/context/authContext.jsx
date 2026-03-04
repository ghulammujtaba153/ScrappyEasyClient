import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/URL";
import { checkAccessStatus } from "../api/subscriptionApi";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Error parsing user from localStorage:", e);
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [accessStatus, setAccessStatus] = useState({ isAuthorized: false, type: 'subscription' });
    const [loading, setLoading] = useState(true);
    const [activeTeam, setActiveTeam] = useState(null);
    const navigate = useNavigate();

    // Derived effective user state based on active team
    const effectiveUser = activeTeam ? (activeTeam.owner?._id ? activeTeam.owner : { _id: activeTeam.owner }) : user;

    // Axios interceptor for active team context
    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            if (activeTeam && activeTeam._id) {
                config.headers['x-active-team'] = activeTeam._id;
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [activeTeam]);

    // Verify token with backend on mount
    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = localStorage.getItem("token");
            const storedUserStr = localStorage.getItem("user");

            if (storedToken && storedUserStr) {
                try {
                    const storedUser = JSON.parse(storedUserStr);
                    // Verify token with backend
                    const response = await fetch(`${BASE_URL}/api/auth/verifyToken`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${storedToken}`,
                        },
                    });

                    if (response.ok) {
                        // Token is valid, set user and token
                        setToken(storedToken);
                        setUser(storedUser);

                        // Also fetch access status
                        const status = await checkAccessStatus(storedUser._id || storedUser.id, storedToken);
                        setAccessStatus(status);
                    } else {
                        // Token is invalid, clear localStorage
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Token verification error:", error);
                    // Clear invalid token
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, []);

    // Login function
    const login = async (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Fetch access status on login
        try {
            const status = await checkAccessStatus(userData._id || userData.id, authToken);
            setAccessStatus(status);
        } catch (error) {
            console.error("Error fetching access status on login:", error);
        }
    };

    // Logout function
    const logout = async () => {
        // Disconnect WhatsApp session before logging out
        const currentToken = token || localStorage.getItem("token");
        if (currentToken && user) {
            try {
                await fetch(`${BASE_URL}/api/verification/disconnect`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${currentToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId: user._id || user.id })
                });
            } catch (error) {
                console.error("Failed to disconnect WhatsApp:", error);
                // Continue with logout even if disconnect fails
            }
        }

        setUser(null);
        setToken(null);
        setAccessStatus({ isAuthorized: false, type: 'subscription' });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!token && !!user;
    };

    // Update user data
    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
    };

    const refreshAccessStatus = async () => {
        if (activeTeam && activeTeam.owner) {
            const ownerId = activeTeam.owner._id || activeTeam.owner;
            const status = await checkAccessStatus(ownerId, token);
            setAccessStatus(status);
        } else if (user && token) {
            const status = await checkAccessStatus(user._id || user.id, token);
            setAccessStatus(status);
        }
    };

    // React to activeTeam changes
    useEffect(() => {
        refreshAccessStatus();
    }, [activeTeam]);

    const value = {
        user,
        token,
        accessStatus,
        loading,
        activeTeam,
        setActiveTeam,
        effectiveUser,
        login,
        logout,
        isAuthenticated,
        updateUser,
        refreshAccessStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
