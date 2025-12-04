import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "./Layout";

const DashboardLayout = () => {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

export default DashboardLayout;
