import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaMapMarkedAlt, FaCoffee, FaBuilding, FaGlobe, FaSearch, FaPhoneAlt, FaStar, FaWhatsapp, FaChrome, FaFilter, FaEnvelope, FaCheckCircle, FaBullhorn } from "react-icons/fa";

const HowWorkSection = () => {
    const cards = [
        {
            id: "card-1",
            bg: "bg-[#DCFCE7]",
            icon: FaChrome,
            iconColor: "text-[#0F792C]",
            title: "Install Lead Buddy",
            description: "Install our powerful Lead Buddy Chrome extension in seconds. It’s the engine that turns Google Maps listings into a stream of high-quality business leads for your agency.",
            dashboardLink: "/get-extension",
            btnText: "Install Extension",
            layout: "lg:flex-row",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4 mb-4">
                            <div className="bg-primary/10 p-2.5 rounded-xl text-primary"><FaChrome size={18} /></div>
                            <div className="flex-1">
                                <h4 className="font-black font-bold text-gray-900 text-sm">Lead Buddy Extension</h4>
                                <p className="text-[10px] font-normal text-gray-400">Ready to harvest leads</p>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4 opacity-90 scale-[0.98]">
                            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500"><FaBuilding size={18} /></div>
                            <div className="flex-1">
                                <h4 className="font-black font-bold text-gray-900 text-sm">Targeted Search</h4>
                                <p className="text-[10px] text-gray-400 mt-1">Extracting data...</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-full py-2.5 px-5 shadow-2xl border border-gray-50 flex items-center gap-2 animate-bounce-subtle whitespace-nowrap z-10">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <span className="font-bold font-semibold text-gray-800 text-xs tracking-tight">Lead Buddy Active</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "card-2",
            bg: "bg-[#FFEDD5]",
            icon: FaSearch,
            iconColor: "text-[#F97316]",
            title: "Scrape Google Maps",
            description: "Use Map Harvest to navigate any niche or location. Our advanced scrapper automatically pulls business names, verified phone numbers, addresses, and social links in real-time.",
            dashboardLink: "/dashboard/operations",
            btnText: "Start Scraping",
            layout: "lg:flex-row-reverse",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative min-h-[250px] flex flex-col justify-center">
                        <div className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl p-5 flex items-center gap-3 shadow-inner">
                            <FaSearch className="text-orange-400" size={18} />
                            <div className="flex-1">
                                <p className="text-gray-700 font-bold font-semibold text-lg">"Plumbers in New York"</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-full py-2.5 px-5 shadow-2xl border border-gray-50 flex items-center gap-2 animate-bounce-subtle whitespace-nowrap z-10">
                            <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                            <span className="font-bold font-semibold text-gray-800 text-xs tracking-tight">842 leads harvested</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "card-3",
            bg: "bg-[#FEF9C3]",
            icon: "CRM",
            iconColor: "text-yellow-600",
            title: "Export to CRM",
            description: "Directly sync your fresh leads into the Map Harvest CRM. Say goodbye to spreadsheets and keep your sales team organized with a centralized database of prospects and interaction history.",
            dashboardLink: "/dashboard/qualified-leads",
            btnText: "Go to CRM",
            layout: "lg:flex-row",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative">
                        <div className="bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100">
                            <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-2">
                                <div className="bg-yellow-400 px-2 py-0.5 rounded text-[10px] font-black font-bold text-white">CRM</div>
                                <span className="text-xs font-bold font-semibold text-gray-500 italic">Centralized Leads</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    { name: "Global Fixers", status: "Qualified" },
                                    { name: "Urban Solar", status: "In Outreach" },
                                    { name: "Prime Realty", status: "New" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400"><FaBuilding size={12} /></div>
                                            <h5 className="text-sm font-black font-bold text-gray-900 leading-none">{item.name}</h5>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-black font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-full">{item.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "card-4",
            bg: "bg-[#DBEAFE]",
            icon: FaFilter,
            iconColor: "text-blue-600",
            title: "Filter & Refine Data",
            description: "Narrow down your leads using powerful filters. Sort by reviews, phone number availability, email presence, and more to focus only on the highest-value prospects worth pursuing.",
            dashboardLink: "/dashboard/qualified-leads",
            btnText: "Filter Leads",
            layout: "lg:flex-row-reverse",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative">
                        <div className="bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100">
                            <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-2">
                                <FaFilter className="text-blue-500" size={12} />
                                <span className="text-xs font-bold text-gray-700">Active Filters</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    { label: "Reviews", value: "50+", active: true },
                                    { label: "Phone Number", value: "Available", active: true },
                                    { label: "Email", value: "Has Email", active: false },
                                ].map((filter, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                                        <span className="text-sm font-bold text-gray-800">{filter.label}</span>
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${filter.active ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-gray-50 text-gray-400 border border-gray-100"}`}>{filter.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-full py-2.5 px-5 shadow-2xl border border-gray-50 flex items-center gap-2 animate-bounce-subtle whitespace-nowrap z-10">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                            <span className="font-bold font-semibold text-gray-800 text-xs tracking-tight">328 leads matched</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "card-5",
            bg: "bg-[#DCFCE7]",
            icon: FaWhatsapp,
            iconColor: "text-green-600",
            title: "WhatsApp Verify & Message",
            description: "Instantly verify WhatsApp availability for every phone number harvested. Then launch bulk message campaigns to reach prospects directly where they're most active.",
            dashboardLink: "/dashboard/operations",
            btnText: "Verify WhatsApp",
            layout: "lg:flex-row",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 mb-4">
                            <div className="bg-green-50 p-2.5 rounded-xl text-green-500"><FaWhatsapp size={18} /></div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm">WhatsApp Verification</h4>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-green-500 w-[85%] animate-pulse rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-green-600">85%</span>
                        </div>
                        <div className="space-y-2">
                            {[
                                { name: "+1 202-257-8136", status: "✓ Active", color: "text-green-600 bg-green-50" },
                                { name: "+1 253-347-8275", status: "✓ Active", color: "text-green-600 bg-green-50" },
                                { name: "+1 425-894-5265", status: "✗ Inactive", color: "text-red-500 bg-red-50" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl">
                                    <span className="text-xs font-mono text-gray-700">{item.name}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color}`}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-full py-2.5 px-5 shadow-2xl border border-gray-50 flex items-center gap-2 animate-bounce-subtle whitespace-nowrap z-10">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <span className="font-bold font-semibold text-gray-800 text-xs tracking-tight">Bulk Message Ready</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "card-6",
            bg: "bg-[#FFEDD5]",
            icon: FaEnvelope,
            iconColor: "text-orange-600",
            title: "Email Extraction",
            description: "Automatically extract email addresses from business websites and listings. Build a verified email list ready for outreach campaigns — no manual research needed.",
            dashboardLink: "/dashboard/operations",
            btnText: "Extract Emails",
            layout: "lg:flex-row-reverse",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative">
                        <div className="bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100">
                            <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-2">
                                <FaEnvelope className="text-orange-500" size={12} />
                                <span className="text-xs font-bold text-gray-700">Extracted Emails</span>
                                <span className="ml-auto text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">47 found</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    { email: "info@globalfixers.com", source: "Website" },
                                    { email: "hello@urbansolar.co", source: "Google" },
                                    { email: "contact@primerealty.com", source: "Website" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-orange-300" size={10} />
                                            <span className="text-xs font-semibold text-gray-800">{item.email}</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{item.source}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "card-7",
            bg: "bg-[#EDE9FE]",
            icon: FaCheckCircle,
            iconColor: "text-purple-600",
            title: "Qualify Leads",
            description: "Use our built-in swiper to quickly browse business websites and qualify leads based on your own criteria. Rate, tag, and sort prospects to build a pipeline of genuinely interested buyers.",
            dashboardLink: "/dashboard/qualified-leads",
            btnText: "Qualify Now",
            layout: "lg:flex-row",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative">
                        <div className="space-y-3">
                            {[
                                { name: "Global Fixers", rating: "★★★★★", tag: "Hot Lead", tagColor: "bg-red-50 text-red-600" },
                                { name: "Urban Solar", rating: "★★★★☆", tag: "Warm", tagColor: "bg-yellow-50 text-yellow-600" },
                                { name: "Prime Realty", rating: "★★★☆☆", tag: "Review", tagColor: "bg-blue-50 text-blue-600" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-50 p-2 rounded-xl text-purple-500"><FaBuilding size={14} /></div>
                                        <div>
                                            <h5 className="text-sm font-bold text-gray-900">{item.name}</h5>
                                            <p className="text-[10px] text-yellow-500">{item.rating}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${item.tagColor}`}>{item.tag}</span>
                                </div>
                            ))}
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-full py-2.5 px-5 shadow-2xl border border-gray-50 flex items-center gap-2 animate-bounce-subtle whitespace-nowrap z-10">
                            <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
                            <span className="font-bold font-semibold text-gray-800 text-xs tracking-tight">12 leads qualified today</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "card-8",
            bg: "bg-[#FEE2E2]",
            icon: FaBullhorn,
            iconColor: "text-red-600",
            title: "Launch Campaigns",
            description: "Run full outreach campaigns from one dashboard — send bulk emails, cold call via the built-in dialer, test funnels, and manage multi-channel outreach to close deals faster.",
            dashboardLink: "/dashboard/qualified-leads",
            btnText: "Start Outreach",
            layout: "lg:flex-row-reverse",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative">
                        <div className="bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100">
                            <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-2">
                                <FaBullhorn className="text-red-500" size={12} />
                                <span className="text-xs font-bold text-gray-700">Active Campaigns</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    { name: "Email Outreach", icon: FaEnvelope, iconColor: "text-orange-500", stat: "1,240 sent", bg: "bg-orange-50" },
                                    { name: "Cold Calling", icon: FaPhoneAlt, iconColor: "text-red-500", stat: "86 calls", bg: "bg-red-50" },
                                    { name: "Funnel Testing", icon: FaGlobe, iconColor: "text-purple-500", stat: "3 funnels", bg: "bg-purple-50" },
                                    { name: "WhatsApp Blast", icon: FaWhatsapp, iconColor: "text-green-500", stat: "520 reached", bg: "bg-green-50" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`${item.bg} p-1.5 rounded-lg`}><item.icon className={item.iconColor} size={10} /></div>
                                            <span className="text-xs font-bold text-gray-800">{item.name}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500">{item.stat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-full py-2.5 px-5 shadow-2xl border border-gray-50 flex items-center gap-2 animate-bounce-subtle whitespace-nowrap z-10">
                            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="font-bold font-semibold text-gray-800 text-xs tracking-tight">4 campaigns running</span>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section className="bg-white py-16 px-4 shadow-sm">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-6xl font-black font-semibold text-gray-900 tracking-tight">
                        How It Works
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
                        Map Harvest streamlines your entire lead generation pipeline. From harvesting 
                        data with Lead Buddy to closing deals via our integrated outreach tools.
                    </p>
                </div>

                {/* Video Demo Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col gap-8"
                    >
                        <div className="relative group p-1.5 bg-gradient-to-tr from-slate-200 via-white to-slate-200 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                            <div className="bg-slate-950 rounded-[2.3rem] overflow-hidden border border-white/10 aspect-video">
                                <iframe 
                                    src="https://www.loom.com/embed/d04652b8c80845e897a20fc390ac8fcd" 
                                    frameBorder="0" 
                                    webkitallowfullscreen="true" 
                                    mozallowfullscreen="true" 
                                    allowFullScreen 
                                    className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                                ></iframe>
                            </div>
                        </div>
                        <div className="space-y-4 px-4">
                            <h3 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-[0.15em] text-center leading-relaxed">
                                MAP HARVEST VID 1 - DATA EXTRACTION, WHATSAPP VERIFICATION, EMAIL, SOCIALS, GROWING LIST FOR OUTREACH AND MORE!
                            </h3>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col gap-8"
                    >
                        <div className="relative group p-1.5 bg-gradient-to-tr from-slate-200 via-white to-slate-200 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                            <div className="bg-slate-950 rounded-[2.3rem] overflow-hidden border border-white/10 aspect-video">
                                <iframe 
                                    src="https://www.loom.com/embed/aa527e4975c548d48c5ba2a8334f01da" 
                                    frameBorder="0" 
                                    webkitallowfullscreen="true" 
                                    mozallowfullscreen="true" 
                                    allowFullScreen 
                                    className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                                ></iframe>
                            </div>
                        </div>
                        <div className="space-y-4 px-4">
                            <h3 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-[0.15em] text-center leading-relaxed">
                                MAP HARVEST VID 2 - HOW I QUALIFY LEADS, COLD CALL, EMAIL AND COLLABORATE
                            </h3>
                        </div>
                    </motion.div>
                </div>

                {/* Stacking Cards Container */}
                <div className="relative">
                    {cards.map((card, index) => (
                        <div 
                            key={card.id} 
                            className="sticky top-0 h-[70vh] flex items-center justify-center pointer-events-none"
                            style={{ 
                                zIndex: index + 1,
                                top: `${index * 2}rem`
                            }}
                        >
                            <div className={`${card.bg} relative w-full rounded-[3rem] p-8 md:p-14 lg:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white/60 backdrop-blur-md flex flex-col lg:flex-row items-center gap-12 lg:gap-20 overflow-hidden group pointer-events-auto`}>
                                
                                {/* Visual Side */}
                                {card.visual}

                                {/* Content Side */}
                                <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
                                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg transition-transform group-hover:scale-110">
                                        {typeof card.icon === 'string' ? (
                                            <span className={`${card.iconColor} font-black font-bold text-lg`}>{card.icon}</span>
                                        ) : (
                                            <card.icon className={card.iconColor} size={28} />
                                        )}
                                    </div>

                                    <div className="space-y-3 md:space-y-4">
                                        <h3 className="text-xl md:text-3xl font-black font-semibold text-gray-900 leading-[1.1]">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-600 text-base md:text-lg font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                                            {card.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                                        <Link 
                                            to={card.dashboardLink}
                                            className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-3 shadow-lg transition-all hover:scale-105 group/btn"
                                        >
                                            {card.btnText}
                                            <FaArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Added Bottom Spacing for last card to scroll properly */}
            <div className="h-[10vh]"></div>
        </section>
    );
};

export default HowWorkSection;