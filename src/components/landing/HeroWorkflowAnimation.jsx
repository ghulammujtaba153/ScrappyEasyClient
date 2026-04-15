import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChrome, FaPhoneAlt, FaWhatsapp, FaFilter, FaMapMarkerAlt, FaDownload, FaTrash, FaStar, FaSearch, FaCloudUploadAlt, FaCheckCircle, FaEnvelope, FaGlobe, FaLightbulb, FaUsers, FaVideo } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const LEADS = [
    { name: "Downtown Coffee", status: "New", color: "bg-green-100 text-green-700" },
    { name: "Tech Solutions", status: "Qualified", color: "bg-blue-100 text-blue-700" },
    { name: "Prime Realty", status: "In Outreach", color: "bg-purple-100 text-purple-700" },
    { name: "Urban Solar", status: "New", color: "bg-green-100 text-green-700" },
    { name: "Global Fixers", status: "Qualified", color: "bg-blue-100 text-blue-700" },
];

const MAP_RESULTS = [
    { name: "District Detail", rating: 5.0, reviews: 48, type: "Car detailing service", phone: "+1 202-257-8136" },
    { name: "Miguel Auto Detailing", rating: 5.0, reviews: 13, type: "Car detailing service", phone: "+1 206-687-6408" },
    { name: "Royal Car Detailing", rating: 5.0, reviews: 166, type: "Car detailing service", phone: "+1 253-347-8275" },
    { name: "Sno-Valley Auto Detail", rating: 5.0, reviews: 14, type: "Car detailing service", phone: "+1 425-894-5265" },
];

/* ─── Stage 1: Scrape Panel (Maps + Extension) ─── */
const ScrapePanel = ({ phase }) => {
    const savedCount = phase >= 0 ? Math.min((phase + 1) * 4 + 5, 17) : 0;
    const highlightedRow = phase % MAP_RESULTS.length;

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white overflow-hidden h-full">
            {/* Browser chrome */}
            <div className="bg-gray-50 border-b border-gray-100 px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-300"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
                    <div className="w-2 h-2 rounded-full bg-green-300"></div>
                </div>
                <div className="flex-1 bg-white rounded-md px-2 py-1 flex items-center gap-1.5 text-[9px] text-gray-400 border border-gray-100">
                    <FcGoogle size={10} />
                    <span className="truncate">maps.google.com</span>
                </div>
                <div className="flex items-center gap-1 bg-white rounded-md px-2 py-1 border border-gray-100">
                    <FaChrome className="text-primary" size={10} />
                    <span className="text-[8px] font-bold text-primary">Lead Buddy</span>
                </div>
            </div>

            {/* Split view: Maps results + Extension */}
            <div className="flex h-56 md:h-64">
                {/* Left: Google Maps search results */}
                <div className="w-1/2 border-r border-gray-100 overflow-hidden">
                    {/* Search bar */}
                    <div className="px-2 py-1.5 border-b border-gray-100 flex items-center gap-1.5">
                        <FaSearch className="text-gray-300" size={8} />
                        <span className="text-[9px] text-gray-600 font-medium">car detailing in washington</span>
                    </div>
                    {/* Results list */}
                    <div className="p-1.5 space-y-1">
                        {MAP_RESULTS.map((result, i) => (
                            <motion.div
                                key={result.name}
                                className={`p-1.5 rounded-lg transition-colors duration-300 ${i === highlightedRow ? "bg-green-50 border border-green-200" : "bg-white border border-transparent"}`}
                                animate={i === highlightedRow ? { x: [0, 2, 0] } : {}}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-[9px] font-bold text-gray-900 leading-tight truncate">{result.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-[8px] text-gray-900 font-semibold">{result.rating}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, s) => (
                                            <FaStar key={s} className="text-yellow-400" size={6} />
                                        ))}
                                    </div>
                                    <span className="text-[7px] text-gray-400">({result.reviews})</span>
                                </div>
                                <p className="text-[7px] text-gray-400 truncate">{result.type}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Lead Buddy Extension Panel */}
                <div className="w-1/2 bg-gray-50/50 flex flex-col">
                    {/* Extension header */}
                    <div className="px-3 py-2 text-center border-b border-gray-100">
                        <div className="w-7 h-7 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-1">
                            <FaChrome className="text-primary" size={12} />
                        </div>
                        <p className="text-[8px] font-bold text-gray-700">Lead Buddy</p>
                        <p className="text-[7px] text-primary font-semibold">Premium Plan</p>
                    </div>

                    {/* Saved counter */}
                    <div className="px-3 py-1.5 text-center">
                        <motion.div
                            key={savedCount}
                            className="inline-flex items-center gap-1 text-[9px] font-bold text-primary"
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="text-green-500">✅</span>
                            Saved {savedCount} unique contacts!
                        </motion.div>
                    </div>

                    {/* Action buttons */}
                    <div className="px-2 space-y-1.5 flex-1">
                        <motion.div
                            className="bg-primary text-white rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5 cursor-default"
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <FaSearch size={7} />
                            <span className="text-[8px] font-bold">Analyze Page for Leads</span>
                        </motion.div>

                        <div className="bg-white border border-gray-200 rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5">
                            <FaCloudUploadAlt className="text-primary" size={7} />
                            <span className="text-[8px] font-semibold text-gray-700">Export to CRM</span>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5">
                            <FaDownload className="text-gray-500" size={7} />
                            <span className="text-[8px] font-semibold text-gray-700">Download CSV</span>
                        </div>
                    </div>

                    {/* Bottom mini table preview */}
                    <div className="px-2 py-1.5 border-t border-gray-100 mt-auto">
                        <div className="flex items-center justify-between text-[7px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1">
                            <span>Name</span>
                            <span>Rating</span>
                        </div>
                        {MAP_RESULTS.slice(0, 2).map((r, i) => (
                            <motion.div
                                key={r.name}
                                className="flex items-center justify-between text-[7px] px-1 py-0.5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.3 + 1 }}
                            >
                                <span className="text-gray-600 truncate max-w-[60px]">{r.name}</span>
                                <span className="text-gray-800 font-semibold">{r.rating}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Stage 2: CRM Panel ─── */
const CRMPanel = ({ phase, leadCount }) => {
    const visibleLeads = phase >= 1 ? Math.min(phase, LEADS.length) : 0;

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white overflow-hidden h-full flex flex-col">
            {/* CRM header */}
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary px-2 py-0.5 rounded text-[9px] font-bold text-white">CRM</div>
                    <span className="text-xs font-semibold text-gray-500">Map Harvest</span>
                </div>
                <motion.div
                    key={leadCount}
                    className="bg-green-50 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-100"
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {leadCount} leads
                </motion.div>
            </div>

            {/* Lead rows */}
            <div className="flex-1 p-3 space-y-2 overflow-hidden">
                {LEADS.map((lead, i) => (
                    <motion.div
                        key={lead.name}
                        className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-50 shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={i < visibleLeads
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{ duration: 0.4, delay: i * 0.12 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-primary">{lead.name.charAt(0)}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-800 truncate max-w-[100px]">{lead.name}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${lead.color}`}>
                            {lead.status}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

/* ─── Stage 3: Action Panel (features appear one by one) ─── */
const ACTION_FEATURES = [
    { icon: FaCheckCircle, color: "text-blue-500", bg: "bg-blue-50", label: "Lead Qualification" },
    { icon: FaWhatsapp, color: "text-green-500", bg: "bg-green-50", label: "WhatsApp Number Verification" },
    { icon: FaWhatsapp, color: "text-green-600", bg: "bg-green-50", label: "WhatsApp Message Sending" },
    { icon: FaEnvelope, color: "text-orange-500", bg: "bg-orange-50", label: "Email Extractor" },
    { icon: FaGlobe, color: "text-purple-500", bg: "bg-purple-50", label: "Website Swiper & Qualifying" },
    { icon: FaLightbulb, color: "text-yellow-500", bg: "bg-yellow-50", label: "Smart Suburb Suggestions" },
    { icon: FaPhoneAlt, color: "text-red-500", bg: "bg-red-50", label: "Cold Calling" },
    { icon: FaUsers, color: "text-indigo-500", bg: "bg-indigo-50", label: "Team Management for Sales" },
    { icon: FaVideo, color: "text-teal-500", bg: "bg-teal-50", label: "Global Collaboration via Meet" },
];

const ActionPanel = ({ visibleCount }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white overflow-hidden h-full flex flex-col">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Actions</span>
                <motion.div
                    key={visibleCount}
                    className="bg-green-50 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-100"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                >
                    {visibleCount}/{ACTION_FEATURES.length}
                </motion.div>
            </div>

            <div className="flex-1 p-2 overflow-hidden space-y-1">
                {ACTION_FEATURES.map((feat, i) => (
                    <motion.div
                        key={feat.label}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-transparent"
                        initial={{ opacity: 0, x: 20 }}
                        animate={i < visibleCount
                            ? { opacity: 1, x: 0, backgroundColor: i === visibleCount - 1 ? "rgb(240 253 244)" : "transparent", borderColor: i === visibleCount - 1 ? "rgb(220 252 231)" : "transparent" }
                            : { opacity: 0, x: 20 }
                        }
                        transition={{ duration: 0.35, delay: i < visibleCount ? 0 : 0 }}
                    >
                        <div className={`${feat.bg} w-5 h-5 rounded-md flex items-center justify-center shrink-0`}>
                            <feat.icon className={feat.color} size={9} />
                        </div>
                        <span className="text-[9px] font-semibold text-gray-700 truncate">{feat.label}</span>
                        {i < visibleCount && (
                            <motion.div
                                className="ml-auto"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <FaCheckCircle className="text-green-400" size={8} />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

/* ─── Flow Connector (dots moving between panels) ─── */
const FlowConnector = ({ active }) => {
    return (
        <div className="hidden lg:flex items-center justify-center w-12 shrink-0">
            <div className="relative h-20 w-full flex items-center justify-center">
                {/* Line */}
                <div className="absolute h-px w-full bg-gray-200"></div>
                {/* Flowing dots */}
                {active && [0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary rounded-full shadow-sm"
                        animate={{ left: ["-10%", "110%"], opacity: [0, 1, 1, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

/* ─── Mobile Connector ─── */
const MobileConnector = ({ active }) => {
    return (
        <div className="flex lg:hidden items-center justify-center h-8">
            <div className="relative w-px h-full bg-gray-200">
                {active && (
                    <motion.div
                        className="absolute w-2 h-2 bg-primary rounded-full shadow-sm -left-[3px]"
                        animate={{ top: ["-20%", "120%"], opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}
            </div>
        </div>
    );
};

/* ─── Main Component ─── */
const HeroWorkflowAnimation = () => {
    const [phase, setPhase] = useState(0);
    const [visibleActions, setVisibleActions] = useState(0);
    const [leadCount, setLeadCount] = useState(0);

    // Phase cycle: 0-12, each phase lasts 1.5 seconds = ~18s total loop
    // Phases 0-2: scrape, 3-4: CRM fills, 5-13: actions appear one by one
    useEffect(() => {
        const interval = setInterval(() => {
            setPhase((p) => (p + 1) % 14);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Actions appear one by one starting at phase 4
    useEffect(() => {
        if (phase >= 4 && phase <= 12) {
            setVisibleActions(Math.min(phase - 3, ACTION_FEATURES.length));
        } else if (phase >= 13 || phase < 2) {
            // Keep all visible briefly, then reset
            if (phase === 0) {
                setVisibleActions(0);
            } else {
                setVisibleActions(ACTION_FEATURES.length);
            }
        }
    }, [phase]);

    // Lead counter
    useEffect(() => {
        if (phase >= 2 && phase <= 4) {
            setLeadCount(Math.min((phase - 1) * 5 + 9, 24));
        }
        if (phase === 0) {
            setLeadCount(12);
        }
    }, [phase]);

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white p-4 md:p-6">
            {/* Stage labels */}
            <div className="flex flex-col lg:flex-row items-center justify-around mb-4 gap-2 lg:gap-0">
                {["1. Scrape with Lead Buddy", "2. Manage in CRM", "3. Take Action"].map((label, i) => (
                    <motion.div
                        key={label}
                        className="flex items-center gap-2"
                        animate={{
                            opacity: phase >= i ? 1 : 0.4,
                        }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${phase >= i ? "bg-primary text-white" : "bg-gray-200 text-gray-400"} transition-colors duration-300`}>
                            {i + 1}
                        </div>
                        <span className={`text-xs font-semibold ${phase >= i ? "text-gray-800" : "text-gray-400"} transition-colors duration-300`}>
                            {label.substring(3)}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Panels */}
            <div className="flex flex-col lg:flex-row items-stretch gap-0">
                {/* Scrape */}
                <div className="flex-1 min-w-0">
                    <ScrapePanel phase={phase} />
                </div>

                <FlowConnector active={phase >= 2 && phase <= 5} />
                <MobileConnector active={phase >= 2 && phase <= 5} />

                {/* CRM */}
                <div className="flex-1 min-w-0">
                    <CRMPanel phase={Math.min(phase, 5)} leadCount={leadCount} />
                </div>

                <FlowConnector active={phase >= 4} />
                <MobileConnector active={phase >= 4} />

                {/* Action */}
                <div className="flex-1 min-w-0">
                    <ActionPanel visibleCount={visibleActions} />
                </div>
            </div>

            {/* Bottom decorative bar */}
            <div className="flex justify-between items-center px-4 mt-4">
                <p className="text-[11px] font-semibold text-primary/60 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                    Live workflow preview
                </p>
                <div className="flex gap-1.5">
                    {[
                        { active: phase >= 0 && phase <= 2, label: "Scrape" },
                        { active: phase >= 2 && phase <= 4, label: "CRM" },
                        { active: phase >= 4, label: "Actions" },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${s.active ? "w-8 bg-primary" : "w-4 bg-primary/20"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroWorkflowAnimation;
