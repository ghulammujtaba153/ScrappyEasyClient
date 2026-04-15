import React from "react";
import { FaPaintBrush, FaSearchDollar, FaVideo, FaImage, FaCogs, FaBullhorn, FaEnvelopeOpenText, FaFunnelDollar, FaShopify, FaUserTie } from "react-icons/fa";

const ROLES = [
    { label: "Website Designers", icon: FaPaintBrush },
    { label: "SEO Specialists", icon: FaSearchDollar },
    { label: "Video Editors", icon: FaVideo },
    { label: "Thumbnail Designers", icon: FaImage },
    { label: "Automation Experts", icon: FaCogs },
    { label: "Ads Managers", icon: FaBullhorn },
    { label: "Email Marketing Experts", icon: FaEnvelopeOpenText },
    { label: "Funnel Builders", icon: FaFunnelDollar },
    { label: "Shopify Experts", icon: FaShopify },
    { label: "Agency Owners", icon: FaUserTie },
];

const BestForSection = () => {
    const items = [...ROLES, ...ROLES, ...ROLES];

    return (
        <section className="bg-white py-16 md:py-20 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                {/* Left: Static heading */}
                <div className="lg:w-1/3 shrink-0 text-center lg:text-left">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                        Built for<br />Finding Clients
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg mt-4 font-normal leading-relaxed">
                        No matter your niche — if you need clients, Map Harvest gets them to your door.
                    </p>
                </div>

                {/* Right: Infinite carousel */}
                <div className="lg:w-2/3 relative overflow-hidden">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                    {/* Row 1 - moves left */}
                    <div className="flex animate-scroll-x mb-4">
                        {items.map((role, i) => (
                            <div key={`r1-${i}`} className="flex-shrink-0 mx-2">
                                <div className="bg-[#f0fdf4] border border-green-100 rounded-full px-5 md:px-6 py-2.5 md:py-3 flex items-center gap-2.5 hover:bg-[#dcfce7] transition-colors cursor-default group">
                                    <role.icon className="text-primary group-hover:scale-110 transition-transform" size={16} />
                                    <span className="text-gray-800 font-semibold text-sm md:text-base whitespace-nowrap">
                                        {role.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Row 2 - moves right */}
                    <div className="flex animate-scroll-x-reverse">
                        {items.map((role, i) => (
                            <div key={`r2-${i}`} className="flex-shrink-0 mx-2">
                                <div className="bg-[#f0fdf4] border border-green-100 rounded-full px-5 md:px-6 py-2.5 md:py-3 flex items-center gap-2.5 hover:bg-[#dcfce7] transition-colors cursor-default group">
                                    <role.icon className="text-primary group-hover:scale-110 transition-transform" size={16} />
                                    <span className="text-gray-800 font-semibold text-sm md:text-base whitespace-nowrap">
                                        {role.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BestForSection;
