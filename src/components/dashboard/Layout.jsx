import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Responsive behavior: collapse sidebar on smaller screens
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20 max-w-[calc(100vw-5rem)]" : "ml-64 max-w-[calc(100vw-16rem)]"} overflow-x-hidden`}>
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;