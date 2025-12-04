import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Loader from "../common/Loader";

const AuthRedirect = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    // If user is authenticated, redirect to dashboard
    // Otherwise, redirect to login
    return isAuthenticated() ? (
        <Navigate to="/dashboard" replace />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default AuthRedirect;
