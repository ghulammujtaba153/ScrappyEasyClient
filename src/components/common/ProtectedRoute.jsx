import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const { user } = useAuth();
    const isUnderReview = user?.status === "under_review";
    const isUnderReviewPage = window.location.pathname === "/dashboard/under-review";

    if (isUnderReview && !isUnderReviewPage) {
        return <Navigate to="/dashboard/under-review" replace />;
    }

    return children;
};

export default ProtectedRoute;
