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
    if (isAuthenticated()) {
        const { user } = useAuth();
        if (user?.status === "under_review") {
            return <Navigate to="/dashboard/under-review" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
};

export default AuthRedirect;
