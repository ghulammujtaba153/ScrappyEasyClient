import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Responsive behavior: hide sidebar on smaller screens, collapse on medium
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                // Hide sidebar completely on mobile (< md)
                setIsCollapsed(false);
                setIsMobileSidebarOpen(false);
            } else if (window.innerWidth < 1024) {
                // Collapse on tablet (md to lg)
                setIsCollapsed(true);
                setIsMobileSidebarOpen(false);
            } else {
                // Full sidebar on desktop
                setIsCollapsed(false);
                setIsMobileSidebarOpen(false);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile sidebar when navigating
    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobile={false} />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeMobileSidebar}
                />
            )}
            <div className="md:hidden">
                <Sidebar 
                    isCollapsed={false} 
                    setIsCollapsed={setIsCollapsed} 
                    isMobile={true}
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={closeMobileSidebar}
                />
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 overflow-x-hidden ${
                window.innerWidth >= 768 
                    ? (isCollapsed ? "md:ml-20 max-w-[calc(100vw-5rem)]" : "md:ml-64 max-w-[calc(100vw-16rem)]")
                    : "ml-0"
            }`}>
                {/* Header */}
                <Header onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

                {/* Page Content */}
                <main className="p-2 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;