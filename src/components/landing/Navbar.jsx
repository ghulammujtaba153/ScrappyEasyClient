import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const navLinks = [
        { label: "Home", href: "#hero" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Benefits", href: "#benefits" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ's", href: "#faq" },
        { label: "Contact", href: "/lead-buddy-support" }
    ];

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
            <nav className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-full px-6 md:px-10 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between">
                
                {/* Logo Section */}
                <Link to="/landing" className="flex items-center gap-3 shrink-0">
                    <img 
                        src="/logo.png" 
                        alt="Map Harvest Logo" 
                        className="h-10 w-auto hover:scale-110 transition-transform duration-300" 
                    />
                </Link>

                {/* Desktop Menu - Centralized */}
                <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {navLinks.map((link, i) => (
                        <div key={i}>
                            {link.href.startsWith("#") ? (
                                <a 
                                    href={link.href}
                                    className="text-gray-900 hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#0F792C] hover:after:w-full after:transition-all"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link 
                                    to={link.href}
                                    className="text-gray-900 hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#0F792C] hover:after:w-full after:transition-all"
                                >
                                    {link.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <Link 
                        to="/register" 
                        className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-2.5 rounded-full font-black text-sm transition-all shadow-lg hover:shadow-black/20 hover:scale-105"
                    >
                        Sign Up
                    </Link>
                    <Link 
                        to="/login" 
                        className="text-gray-900 hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors"
                    >
                        Sign In
                    </Link>
                </div>

            </nav>
        </div>
    );
};

export default Navbar;