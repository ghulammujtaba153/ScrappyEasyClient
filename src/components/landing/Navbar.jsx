import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaStar, FaBars, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import {
    HiOutlineMap,
    HiOutlineMail,
    HiOutlineUserGroup,
    HiOutlineLink,
    HiOutlinePhone,
    HiOutlineChatAlt2,
    HiOutlineGlobe,
    HiOutlineEye,
    HiOutlineLightBulb,
    HiOutlineUsers,
} from "react-icons/hi";
import { IoChevronDown } from "react-icons/io5";

export const products = [
    {
        icon: HiOutlineMap,
        label: "Google Maps Scraper",
        desc: "Extract leads from any location",
        bg: "bg-green-100",
        color: "text-green-600",
    },
    {
        icon: HiOutlineMail,
        label: "Email Extractor",
        desc: "Find verified business emails",
        bg: "bg-blue-100",
        color: "text-blue-600",
    },
    {
        icon: HiOutlineChatAlt2,
        label: "WhatsApp Outreach",
        desc: "Verify numbers & send messages",
        bg: "bg-teal-100",
        color: "text-teal-600",
    },
    {
        icon: HiOutlinePhone,
        label: "Cold Calling System",
        desc: "Call leads directly from the app",
        bg: "bg-amber-100",
        color: "text-amber-600",
    },
    {
        icon: HiOutlineEye,
        label: "Website Swiper",
        desc: "Preview & qualify sites instantly",
        bg: "bg-purple-100",
        color: "text-purple-600",
    },
    {
        icon: HiOutlineUserGroup,
        label: "Decision Maker Finder",
        desc: "Reach the right person every time",
        bg: "bg-pink-100",
        color: "text-pink-600",
    },
    {
        icon: HiOutlineLightBulb,
        label: "Smart Suggestions",
        desc: "AI-powered suburb & niche tips",
        bg: "bg-yellow-100",
        color: "text-yellow-600",
    },
    {
        icon: HiOutlineLink,
        label: "Social Links Extractor",
        desc: "Grab socials from any business",
        bg: "bg-indigo-100",
        color: "text-indigo-600",
    },
    {
        icon: HiOutlineUsers,
        label: "Team Management",
        desc: "Add sales reps & collaborate",
        bg: "bg-rose-100",
        color: "text-rose-600",
    },
    {
        icon: HiOutlineGlobe,
        label: "Live Collaboration",
        desc: "Connect with freelancers via Meet",
        bg: "bg-cyan-100",
        color: "text-cyan-600",
    },
];

const Navbar = () => {
    const [productsOpen, setProductsOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);
    const location = useLocation();

    // Order: Home, Products (dropdown), Who Wins With This ⭐, Our Story, Pricing
    const navLinks = [
        { label: "Home", href: "/landing" },
        { label: "Who Wins With This", href: "/who-wins", star: true },
        { label: "Our Story", href: "/about" },
        { label: "Pricing", href: "/pricing" },
        { label: "Get Extension", href: "https://chromewebstore.google.com/detail/lead-buddy-business-conta/lkacglodcmpgjejflajjdcglneamnnim?hl=en-US&utm_source=ext_sidebar" },
    ];

    const openDropdown = () => {
        clearTimeout(timeoutRef.current);
        setProductsOpen(true);
    };

    const closeDropdown = () => {
        timeoutRef.current = setTimeout(() => setProductsOpen(false), 200);
    };

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        setMobileProductsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    return (
        <>
            <div className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 w-[96%] sm:w-[95%] max-w-7xl z-50">
                <nav className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-full px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between">
                    
                    {/* Logo */}
                    <Link to="/landing" className="flex items-center gap-3 shrink-0">
                        <img 
                            src="/logo.png" 
                            alt="Map Harvest Logo" 
                            className="h-8 sm:h-10 w-auto hover:scale-110 transition-transform duration-300" 
                        />
                    </Link>

                    {/* Desktop Menu — Home, Products, Who Wins ⭐, Our Story, Pricing */}
                    <div className="hidden lg:flex items-center gap-5 xl:gap-7">
                        {/* Home */}
                        <Link
                            to="/landing"
                            className="text-gray-900 font-semibold hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#0F792C] hover:after:w-full after:transition-all"
                        >
                            Home
                        </Link>

                        {/* Products Dropdown */}
                        <div
                            ref={dropdownRef}
                            className="relative"
                            onMouseEnter={openDropdown}
                            onMouseLeave={closeDropdown}
                        >
                            <button className="flex items-center gap-1 text-gray-900 font-semibold hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#0F792C] hover:after:w-full after:transition-all">
                                Products
                                <IoChevronDown
                                    size={13}
                                    className={`transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            <AnimatePresence>
                                {productsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-[680px] bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-gray-100 p-6 overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F792C] via-emerald-400 to-[#BBF7D0]" />

                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            Everything you need to find & close clients
                                        </p>

                                        <div className="grid grid-cols-2 gap-2">
                                            {products.map((product, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.03, duration: 0.2 }}
                                                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                                                >
                                                    <div className={`w-11 h-11 rounded-xl ${product.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                                        <product.icon className={`${product.color}`} size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 leading-tight">
                                                            {product.label}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {product.desc}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <p className="text-xs text-gray-400">
                                                10 powerful tools. One platform.
                                            </p>
                                            <Link
                                                to="/pricing"
                                                onClick={() => setProductsOpen(false)}
                                                className="text-xs font-bold text-[#0F792C] hover:underline"
                                            >
                                                View Pricing →
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Who Wins With This ⭐ */}
                        <Link
                            to="/who-wins"
                            className="flex items-center gap-1.5 text-gray-900 font-semibold hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#0F792C] hover:after:w-full after:transition-all"
                        >
                            Who Wins With This
                            <FaStar size={11} className="text-amber-400" />
                        </Link>

                        {/* Our Story */}
                        <Link
                            to="/about"
                            className="text-gray-900 font-semibold hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#0F792C] hover:after:w-full after:transition-all"
                        >
                            Our Story
                        </Link>

                        {/* Pricing */}
                        <Link
                            to="/pricing"
                            className="text-gray-900 font-semibold hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#0F792C] hover:after:w-full after:transition-all"
                        >
                            Pricing
                        </Link>
                        <Link
                            to="https://chromewebstore.google.com/detail/lead-buddy-business-conta/lkacglodcmpgjejflajjdcglneamnnim?hl=en-US&utm_source=ext_sidebar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 font-semibold hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#0F792C] hover:after:w-full after:transition-all"
                        >
                            Get Extension
                        </Link>
                    </div>

                    {/* Right side: Auth + Mobile hamburger */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <Link 
                            to="/register" 
                            className="bg-black font-semibold hover:bg-gray-800 text-white px-5 sm:px-8 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm transition-all shadow-lg hover:shadow-black/20 hover:scale-105"
                        >
                            Sign Up
                        </Link>
                        <Link 
                            to="/login" 
                            className="hidden sm:block text-gray-900 font-semibold hover:text-[#0F792C] font-black text-sm tracking-tight transition-colors"
                        >
                            Sign In
                        </Link>
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Open menu"
                        >
                            <FaBars size={18} className="text-gray-800" />
                        </button>
                    </div>
                </nav>
            </div>

            {/* ── Mobile slide-out menu ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        {/* Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl overflow-y-auto"
                        >
                            {/* Close + logo */}
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                                <img src="/logo.png" alt="Map Harvest" className="h-8" />
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <FaTimes size={18} className="text-gray-600" />
                                </button>
                            </div>

                            <div className="px-6 py-6 space-y-1">
                                {/* Home */}
                                <Link to="/landing" className="block py-3 text-gray-900 font-black font-semibold text-base hover:text-[#0F792C] transition-colors">
                                    Home
                                </Link>

                                {/* Products accordion */}
                                <div>
                                    <button
                                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                                        className="flex items-center justify-between w-full py-3 text-gray-900 font-black font-semibold text-base hover:text-[#0F792C] transition-colors"
                                    >
                                        Products
                                        <IoChevronDown
                                            size={16}
                                            className={`transition-transform duration-300 ${mobileProductsOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {mobileProductsOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-3 space-y-1">
                                                    {products.map((product, i) => (
                                                        <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                                                            <div className={`w-9 h-9 rounded-lg ${product.bg} flex items-center justify-center shrink-0`}>
                                                                <product.icon className={product.color} size={17} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-800 leading-tight">{product.label}</p>
                                                                <p className="text-[11px] text-gray-400">{product.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Who Wins ⭐ */}
                                <Link to="/who-wins" className="flex items-center gap-2 py-3 text-gray-900 font-black font-semibold text-base hover:text-[#0F792C] transition-colors">
                                    Who Wins With This <FaStar size={12} className="text-amber-400" />
                                </Link>

                                {/* Our Story */}
                                <Link to="/about" className="block py-3 text-gray-900 font-black font-semibold text-base hover:text-[#0F792C] transition-colors">
                                    Our Story
                                </Link>

                                {/* Pricing */}
                                <Link to="/pricing" className="block py-3 text-gray-900 font-black font-semibold text-base hover:text-[#0F792C] transition-colors">
                                    Pricing
                                </Link>
                            </div>

                            {/* Mobile auth buttons */}
                            <div className="px-6 pb-8 pt-4 border-t border-gray-100 space-y-3">
                                <Link to="/register" className="block w-full text-center bg-black text-white py-3 rounded-full font-black font-semibold text-sm hover:bg-gray-800 transition-colors">
                                    Sign Up
                                </Link>
                                <Link to="/login" className="block w-full text-center text-gray-700 py-3 rounded-full font-black font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                                    Sign In
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;