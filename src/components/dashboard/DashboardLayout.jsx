import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "./Layout";
import GlobalCaptureProgress from "./GlobalCaptureProgress";

const DashboardLayout = () => {
    return (
        <Layout>
            <Outlet />
            <GlobalCaptureProgress />
        </Layout>
    );
};

export default DashboardLayout;
