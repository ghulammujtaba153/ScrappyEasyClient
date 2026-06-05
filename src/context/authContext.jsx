import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/URL";
import { checkAccessStatus } from "../api/subscriptionApi";

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
    const [accessStatus, setAccessStatus] = useState({
        isAuthorized: false,
        canCreateTeam: false,
        isTeamMember: false,
        type: 'none',
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const refreshAccessStatus = useCallback(async () => {
        if (!token) {
            setAccessStatus({ isAuthorized: false, canCreateTeam: false, isTeamMember: false, type: 'none' });
            return;
        }
        const status = await checkAccessStatus(null, token);
        setAccessStatus(status);
    }, [token]);

    useEffect(() => {
        sessionStorage.removeItem('activeTeam');

        const verifyToken = async () => {
            const storedToken = localStorage.getItem("token");
            const storedUserStr = localStorage.getItem("user");

            if (storedToken && storedUserStr) {
                try {
                    const storedUser = JSON.parse(storedUserStr);
                    const response = await fetch(`${BASE_URL}/api/auth/verifyToken`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${storedToken}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const freshUser = data.user || storedUser;
                        setToken(storedToken);
                        setUser(freshUser);
                        localStorage.setItem("user", JSON.stringify(freshUser));

                        const status = await checkAccessStatus(null, storedToken);
                        setAccessStatus(status);
                    } else {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Token verification error:", error);
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

    const login = useCallback(async (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));

        try {
            const status = await checkAccessStatus(null, authToken);
            setAccessStatus(status);
        } catch (error) {
            console.error("Error fetching access status on login:", error);
        }
    }, []);

    const logout = useCallback(async () => {
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
            }
        }

        setUser(null);
        setToken(null);
        setAccessStatus({ isAuthorized: false, canCreateTeam: false, isTeamMember: false, type: 'none' });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }, [token, user, navigate]);

    const isAuthenticated = useCallback(() => !!token && !!user, [token, user]);

    const updateUser = useCallback((updatedUserData) => {
        setUser(updatedUserData);
        localStorage.setItem("user", JSON.stringify(updatedUserData));
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        accessStatus,
        loading,
        login,
        logout,
        isAuthenticated,
        updateUser,
        refreshAccessStatus,
    }), [user, token, accessStatus, loading, login, logout, isAuthenticated, updateUser, refreshAccessStatus]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
