import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle, FaCoffee, FaBuilding, FaSearch, FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaStar, FaEnvelope } from "react-icons/fa";
import { motion, useInView } from "framer-motion";

const FeatureSection = () => {
    const features = [
        {
            title: "Google Maps Lead Harvesting",
            description: "Map Harvest allows you to extract premium business data directly from Google Maps with just a few clicks.",
            points: [
                "Extract names, phone numbers, and addresses.",
                "Harvest verified website and social media links.",
                "Filter by rating and review count for quality."
            ],
            bgColor: "bg-[#DCFCE7]/60",
            layout: "flex-col lg:flex-row",
            visual: <HarvestingVisual />
        },
        {
            title: "Built-in CRM",
            description: "Manage your entire sales pipeline within Map Harvest. No more external tools or messy spreadsheets.",
            points: [
                "Automatic lead categorization and tagging.",
                "Track interaction history and outreach status.",
                "One-click export to Excel or Google Sheets."
            ],
            bgColor: "bg-[#DCFCE7]/40",
            layout: "flex-col lg:flex-row-reverse",
            visual: <CRMVisual />
        },
        {
            title: "WhatsApp Verification",
            description: "Ensure your outreach reaches target prospects by verifying their WhatsApp status instantly.",
            points: [
                "Check if phone numbers have active WhatsApp accounts.",
                "Filter and export only verified WhatsApp contacts.",
                "Reduce bounce rates and improve outreach success."
            ],
            bgColor: "bg-[#DCFCE7]/60",
            layout: "flex-col lg:flex-row",
            visual: <WhatsAppVisual />
        },
        {
            title: "Outreach Automation",
            description: "Scale your engagement by sending automatic personalized messages to harvested leads.",
            points: [
                "Send bulk automated messages via WhatsApp.",
                "Personalize outreach with custom tags and values.",
                "Schedule campaigns for maximum engagement."
            ],
            bgColor: "bg-[#DCFCE7]/40",
            layout: "flex-col lg:flex-row-reverse",
            visual: <OutreachVisual />
        },
        {
            title: "Cold Calling Dashboard",
            description: "Directly dial your leads from the Map Harvest dashboard and close deals instantly.",
            points: [
                "Built-in one-click dialer for fast cold calling.",
                "Record and log call results within the CRM.",
                "Manage your follow-ups and pipeline efficiency."
            ],
            bgColor: "bg-[#DCFCE7]/60",
            layout: "flex-col lg:flex-row",
            visual: <ColdCallVisual />
        },
        {
            title: "Nearby Recommendations",
            description: "Don't miss out on untapped suburbs. Map Harvest suggests nearby cities to broaden your search.",
            points: [
                "Automated suburb and adjacent city discovery.",
                "Expand your lead pool effortlessly by location.",
                "Stay ahead of competitors in local markets."
            ],
            bgColor: "bg-[#DCFCE7]/40",
            layout: "flex-col lg:flex-row-reverse",
            visual: <NearbyVisual />
        }
    ];

    return (
        <section className="py-32 bg-white overflow-hidden shadow-sm" id="features">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header Section */}
                <div className="text-center space-y-4 mb-32">
                    <h2 className="text-3xl md:text-6xl font-black font-semibold text-gray-900 tracking-tight">
                        Feature Highlights
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-normal leading-relaxed">
                        Map Harvest offers a specialized set of tools to automate each stage
                        of your lead generation and sales outreach.
                    </p>
                </div>

                {/* Features List */}
                <div className="space-y-40">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex ${feature.layout} items-center gap-16 md:gap-24`}
                        >
                            {/* Text Content */}
                            <div className="w-full lg:w-[45%] space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl md:text-3xl font-black font-semibold text-gray-900 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-lg font-normal leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                <ul className="space-y-4">
                                    {feature.points.map((point, i) => (
                                        <li key={i} className="flex items-center gap-3 group">
                                            <FaCheckCircle className="text-primary text-2xl flex-shrink-0 transition-transform group-hover:scale-110" />
                                            <span className="text-gray-700 text-lg">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visual Side */}
                            {feature.visual}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ─── Visual 1: Google Maps Harvesting ─── */
function HarvestingVisual() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, amount: 0.4 });
    const leads = [
        { name: "Downtown Coffee", rating: 4.8, reviews: 120, icon: FaCoffee, iconBg: "bg-green-50", iconColor: "text-primary", address: "123 Main St, New York" },
        { name: "Tech Solutions Inc", rating: 5.0, reviews: 85, icon: FaBuilding, iconBg: "bg-green-50", iconColor: "text-primary", address: "45 Tech Park, SF" },
        { name: "Urban Solar Co", rating: 4.6, reviews: 204, icon: FaBuilding, iconBg: "bg-green-50", iconColor: "text-primary", address: "78 Sunset Blvd, LA" },
    ];

    return (
        <div className="w-full lg:w-[55%] relative group" ref={ref}>
            <div className="absolute inset-0 bg-[#DCFCE7] rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10 opacity-50"></div>
            <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                <div className="w-full max-w-md space-y-3">
                    {/* Search bar */}
                    <motion.div
                        className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3 mb-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <FaSearch className="text-green-500" size={14} />
                        <span className="text-sm text-gray-500">Plumbers in New York</span>
                        <motion.div
                            className="ml-auto bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
                            animate={inView ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            Scraping...
                        </motion.div>
                    </motion.div>
                    {/* Lead cards appearing one by one */}
                    {leads.map((lead, i) => (
                        <motion.div
                            key={lead.name}
                            className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm flex items-start gap-3"
                            initial={{ opacity: 0, x: -30 }}
                            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                            transition={{ duration: 0.5, delay: 0.3 + i * 0.25 }}
                        >
                            <div className={`${lead.iconBg} p-2 rounded-xl ${lead.iconColor}`}><lead.icon size={16} /></div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm">{lead.name}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-yellow-400 text-xs">★</span>
                                    <span className="text-[10px] font-semibold text-gray-400">{lead.rating} ({lead.reviews})</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-0.5">{lead.address}</p>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={inView ? { scale: 1 } : { scale: 0 }}
                                transition={{ delay: 0.6 + i * 0.25, type: "spring" }}
                            >
                                <FaCheckCircle className="text-green-400" size={14} />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Visual 2: Built-in CRM ─── */
function CRMVisual() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, amount: 0.4 });
    const rows = [
        { name: "Global Fixers", status: "Qualified", statusColor: "bg-green-50 text-green-600", progress: "85%" },
        { name: "Urban Solar", status: "In Outreach", statusColor: "bg-blue-50 text-blue-600", progress: "60%" },
        { name: "Prime Realty", status: "New", statusColor: "bg-yellow-50 text-yellow-600", progress: "20%" },
        { name: "Downtown Café", status: "Closed", statusColor: "bg-purple-50 text-purple-600", progress: "100%" },
    ];

    return (
        <div className="w-full lg:w-[55%] relative group" ref={ref}>
            <div className="absolute inset-0 bg-[#DCFCE7] rounded-[2.5rem] transform -translate-x-4 translate-y-4 -z-10 opacity-50"></div>
            <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                <div className="w-full max-w-sm">
                    {/* CRM header */}
                    <motion.div
                        className="flex items-center justify-between mb-4"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-primary px-2 py-0.5 rounded text-[9px] font-bold text-white">CRM</div>
                            <span className="text-xs font-semibold text-gray-400">Pipeline Overview</span>
                        </div>
                        <motion.span
                            className="text-[10px] font-bold text-primary bg-green-50 px-2 py-0.5 rounded-full"
                            animate={inView ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            4 Active
                        </motion.span>
                    </motion.div>
                    {/* Rows animate in */}
                    <div className="space-y-2.5">
                        {rows.map((row, i) => (
                            <motion.div
                                key={row.name}
                                className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 space-y-2"
                                initial={{ opacity: 0, y: 15 }}
                                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                                transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-800">{row.name}</span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${row.statusColor}`}>{row.status}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={inView ? { width: row.progress } : { width: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Visual 3: WhatsApp Verification ─── */
function WhatsAppVisual() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, amount: 0.4 });
    const [checked, setChecked] = useState(0);
    const numbers = [
        { number: "+1 202-257-8136", active: true },
        { number: "+1 206-687-6408", active: true },
        { number: "+1 253-347-8275", active: false },
        { number: "+1 425-894-5265", active: true },
    ];

    useEffect(() => {
        if (inView) {
            setChecked(0);
            const interval = setInterval(() => {
                setChecked((c) => {
                    if (c >= numbers.length) { clearInterval(interval); return c; }
                    return c + 1;
                });
            }, 600);
            return () => clearInterval(interval);
        } else {
            setChecked(0);
        }
    }, [inView]);

    return (
        <div className="w-full lg:w-[55%] relative group" ref={ref}>
            <div className="absolute inset-0 bg-[#DCFCE7] rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10 opacity-50"></div>
            <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                <div className="w-full max-w-sm space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-50 p-2.5 rounded-xl"><FaWhatsapp className="text-green-500" size={20} /></div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">WhatsApp Verification</h4>
                            <p className="text-[10px] text-gray-400">Checking {numbers.length} numbers...</p>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-green-500 rounded-full"
                            animate={{ width: `${(checked / numbers.length) * 100}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                    {/* Numbers list */}
                    <div className="space-y-2">
                        {numbers.map((n, i) => (
                            <motion.div
                                key={n.number}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100"
                                initial={{ opacity: 0.4 }}
                                animate={i < checked ? { opacity: 1 } : { opacity: 0.4 }}
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-xs font-mono text-gray-700">{n.number}</span>
                                {i < checked ? (
                                    <motion.span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${n.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring" }}
                                    >
                                        {n.active ? "✓ Active" : "✗ Inactive"}
                                    </motion.span>
                                ) : (
                                    <div className="w-12 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Visual 4: Outreach Automation ─── */
function OutreachVisual() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, amount: 0.4 });
    const messages = [
        { to: "Downtown Coffee", preview: "Hi! We noticed your business could benefit from...", time: "2m ago", status: "Delivered" },
        { to: "Tech Solutions", preview: "Hello! We'd love to help you scale your...", time: "5m ago", status: "Read" },
        { to: "Urban Solar", preview: "Hey! Are you looking to generate more leads...", time: "8m ago", status: "Sent" },
    ];

    return (
        <div className="w-full lg:w-[55%] relative group" ref={ref}>
            <div className="absolute inset-0 bg-[#DCFCE7] rounded-[2.5rem] transform -translate-x-4 translate-y-4 -z-10 opacity-50"></div>
            <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                <div className="w-full max-w-sm space-y-3">
                    {/* Campaign header */}
                    <motion.div
                        className="flex items-center justify-between mb-2"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-green-50 p-2 rounded-lg"><FaEnvelope className="text-primary" size={14} /></div>
                            <span className="text-xs font-bold text-gray-700">Bulk Campaign</span>
                        </div>
                        <motion.div
                            className="text-[10px] font-bold text-primary bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1"
                            animate={inView ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                            Sending...
                        </motion.div>
                    </motion.div>
                    {/* Messages flying out */}
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.to}
                            className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm"
                            initial={{ opacity: 0, x: 40 }}
                            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                            transition={{ duration: 0.5, delay: 0.3 + i * 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-bold text-gray-800">{msg.to}</span>
                                <span className="text-[9px] text-gray-400">{msg.time}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed truncate">{msg.preview}</p>
                            <motion.div
                                className="mt-2 flex items-center gap-1"
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ delay: 0.8 + i * 0.3 }}
                            >
                                <FaCheckCircle className={`${msg.status === "Read" ? "text-primary" : "text-green-400"}`} size={10} />
                                <span className="text-[9px] font-semibold text-gray-400">{msg.status}</span>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Visual 5: Cold Calling ─── */
function ColdCallVisual() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, amount: 0.4 });
    const [callTime, setCallTime] = useState(0);

    useEffect(() => {
        if (inView) {
            setCallTime(0);
            const interval = setInterval(() => setCallTime((t) => t + 1), 1000);
            return () => clearInterval(interval);
        } else {
            setCallTime(0);
        }
    }, [inView]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div className="w-full lg:w-[55%] relative group" ref={ref}>
            <div className="absolute inset-0 bg-[#DCFCE7] rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10 opacity-50"></div>
            <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                <div className="w-full max-w-xs text-center space-y-6">
                    {/* Calling animation */}
                    <div className="relative mx-auto w-20 h-20">
                        <motion.div
                            className="absolute inset-0 bg-green-100 rounded-full"
                            animate={inView ? { scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-0 bg-green-100 rounded-full"
                            animate={inView ? { scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] } : {}}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-green-50 rounded-full flex items-center justify-center">
                            <motion.div
                                animate={inView ? { rotate: [0, 15, -15, 0] } : {}}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                            >
                                <FaPhoneAlt className="text-primary" size={24} />
                            </motion.div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 text-base">Calling Downtown Coffee</h4>
                        <p className="text-gray-400 text-xs mt-1">+1 202-257-8136</p>
                    </div>

                    <motion.div
                        className="text-2xl font-mono font-bold text-primary"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    >
                        {formatTime(callTime)}
                    </motion.div>

                    <div className="flex justify-center gap-4">
                        <motion.div
                            className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                        >
                            <FaPhoneAlt className="text-red-500 rotate-[135deg]" size={14} />
                        </motion.div>
                        <motion.div
                            className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                            animate={inView ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <FaCheckCircle className="text-green-500" size={14} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Visual 6: Nearby Recommendations ─── */
function NearbyVisual() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, amount: 0.4 });
    const cities = [
        { name: "Brooklyn, NY", leads: 342, distance: "4 mi" },
        { name: "Jersey City, NJ", leads: 189, distance: "7 mi" },
        { name: "Queens, NY", leads: 276, distance: "9 mi" },
        { name: "Hoboken, NJ", leads: 124, distance: "6 mi" },
    ];

    return (
        <div className="w-full lg:w-[55%] relative group" ref={ref}>
            <div className="absolute inset-0 bg-[#DCFCE7] rounded-[2.5rem] transform -translate-x-4 translate-y-4 -z-10 opacity-50"></div>
            <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                <div className="w-full max-w-sm space-y-3">
                    {/* Header */}
                    <motion.div
                        className="flex items-center gap-2 mb-3"
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    >
                        <div className="bg-green-50 p-2 rounded-lg"><FaMapMarkerAlt className="text-primary" size={14} /></div>
                        <span className="text-xs font-bold text-gray-700">Nearby suggestions for <span className="text-primary">New York</span></span>
                    </motion.div>
                    {/* City cards expanding outward */}
                    {cities.map((city, i) => (
                        <motion.div
                            key={city.name}
                            className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm flex items-center justify-between"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: 0.2 + i * 0.2 }}
                        >
                            <div className="flex items-center gap-2.5">
                                <motion.div
                                    className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center"
                                    animate={inView ? { y: [0, -2, 0] } : {}}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                >
                                    <FaMapMarkerAlt className="text-primary" size={12} />
                                </motion.div>
                                <div>
                                    <span className="text-sm font-bold text-gray-800">{city.name}</span>
                                    <p className="text-[10px] text-gray-400">{city.distance} away</p>
                                </div>
                            </div>
                            <motion.div
                                className="text-[10px] font-bold text-primary bg-green-50 px-2.5 py-1 rounded-full"
                                initial={{ scale: 0 }}
                                animate={inView ? { scale: 1 } : { scale: 0 }}
                                transition={{ type: "spring", delay: 0.5 + i * 0.2 }}
                            >
                                {city.leads} leads
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FeatureSection;