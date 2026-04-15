import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaVideo,
    FaLaptopCode,
    FaChartLine,
    FaSearchDollar,
    FaPaintBrush,
    FaPenFancy,
    FaBrain,
    FaPhoneVolume,
    FaGlobeAmericas,
    FaShoppingCart,
    FaArrowRight,
    FaStar,
    FaCheckCircle,
    FaPlay,
    FaEnvelope,
    FaWhatsapp,
    FaMapMarkerAlt,
    FaCalendarCheck,
} from "react-icons/fa";
import Navbar from "../components/landing/Navbar";
import FooterSection from "../components/landing/FooterSection";

/* ── Mini animated scenes for each niche ──────────────────────── */

const VideoScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        {/* Video frame */}
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-40 h-28 bg-white rounded-xl shadow-lg border border-gray-100 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100/50"></div>
            <div className="absolute top-2 left-2 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-300"></div>
            </div>
            <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <div className="w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center shadow-md">
                    <FaPlay size={12} className="text-white ml-0.5" />
                </div>
            </motion.div>
        </motion.div>
        {/* Floating notification */}
        <motion.div
            initial={{ opacity: 0, y: 10, x: 10 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.4 }}
            animate={{ y: [0, -4, 0] }}
            className="absolute -bottom-2 -right-2 bg-white rounded-lg shadow-md px-3 py-1.5 flex items-center gap-1.5 border border-gray-100"
        >
            <FaEnvelope size={10} className="text-primary" />
            <span className="text-[10px] font-bold text-gray-700">Email found!</span>
        </motion.div>
    </div>
);

const WebDesignScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-44 h-32 bg-white rounded-xl shadow-lg border border-gray-100 relative overflow-hidden"
        >
            <div className="h-5 bg-gray-50 border-b border-gray-100 flex items-center px-2 gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-300"></div>
                <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="p-2 space-y-1.5">
                <div className="w-full h-2.5 bg-gray-100 rounded"></div>
                <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                <div className="w-full h-8 bg-gray-50 rounded mt-1"></div>
                <div className="flex gap-1 mt-1">
                    <div className="w-1/2 h-4 bg-gray-50 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-50 rounded"></div>
                </div>
            </div>
            {/* Outdated badge */}
            <motion.div
                initial={{ scale: 0, rotate: -12 }}
                whileInView={{ scale: 1, rotate: -12 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
                className="absolute top-6 right-1 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm"
            >
                Outdated
            </motion.div>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute -bottom-1 -left-1 bg-primary text-white rounded-lg shadow-md px-2.5 py-1.5 text-[10px] font-bold"
        >
            ✓ Qualified
        </motion.div>
    </div>
);

const AdsScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-40 h-28 bg-white rounded-xl shadow-lg border border-gray-100 p-3 relative"
        >
            <div className="text-[9px] font-bold text-gray-400 mb-1">PIPELINE</div>
            <div className="flex items-end gap-1.5 h-16">
                {[40, 55, 35, 65, 80, 70, 95].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                        className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t"
                    />
                ))}
            </div>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.4 }}
            animate={{ y: [0, -3, 0] }}
            className="absolute -top-2 -right-2 bg-white rounded-lg shadow-md px-2.5 py-1.5 flex items-center gap-1 border border-gray-100"
        >
            <FaChartLine size={10} className="text-primary" />
            <span className="text-[10px] font-bold text-gray-700">+340%</span>
        </motion.div>
    </div>
);

const SeoScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-44 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center px-3 gap-2"
        >
            <FaSearchDollar size={14} className="text-primary" />
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "70%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="h-2.5 bg-gray-100 rounded-full overflow-hidden"
            >
                <div className="h-full bg-primary/20 rounded-full"></div>
            </motion.div>
        </motion.div>
        {/* Search results */}
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.35 }}
                className="absolute bg-white rounded-lg shadow-md px-3 py-2 border border-gray-100"
                style={{ top: `${55 + i * 28}%`, left: `${10 + i * 5}%`, right: `${10 + i * 5}%` }}
            >
                <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded ${i === 0 ? "bg-red-100" : i === 1 ? "bg-yellow-100" : "bg-red-100"} flex items-center justify-center`}>
                        <span className="text-[8px] font-bold">{i === 0 ? "D" : i === 1 ? "F" : "D"}</span>
                    </div>
                    <div className="flex-1">
                        <div className="w-full h-1.5 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </motion.div>
        ))}
    </div>
);

const DesignScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 bg-white rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden flex items-center justify-center"
        >
            {/* Paint strokes */}
            <motion.div
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-2"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <motion.circle
                        cx="50" cy="50" r="25"
                        fill="none" stroke="#0F792C" strokeWidth="3" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 1, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M30 30 L70 70 M70 30 L30 70"
                        fill="none" stroke="#0F792C" strokeWidth="2" strokeLinecap="round" opacity="0.3"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
                    />
                </svg>
            </motion.div>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, type: "spring", stiffness: 400 }}
            className="absolute -bottom-1 -right-1 bg-white rounded-lg shadow-md px-2.5 py-1.5 border border-gray-100"
        >
            <span className="text-[10px] font-bold text-primary">💰 $2,500</span>
        </motion.div>
    </div>
);

const CopyScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-40 h-32 bg-white rounded-xl shadow-lg border border-gray-100 p-3 relative"
        >
            <div className="space-y-2">
                {[100, 80, 90, 60, 85, 40].map((w, i) => (
                    <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${w}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                        className="h-1.5 bg-gray-100 rounded-full"
                    />
                ))}
            </div>
            {/* Cursor blinking */}
            <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute bottom-6 left-[42%] w-0.5 h-3 bg-primary"
            />
        </motion.div>
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.4 }}
            className="absolute -top-2 -right-2 bg-primary text-white rounded-lg shadow-md px-2.5 py-1.5 text-[10px] font-bold"
        >
            ✉️ Pitch sent
        </motion.div>
    </div>
);

const AgencyScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-44 h-32 bg-white rounded-xl shadow-lg border border-gray-100 p-2.5 relative"
        >
            {/* Mini dashboard */}
            <div className="grid grid-cols-2 gap-1.5 h-full">
                {["Leads", "Messages", "Calls", "Team"].map((label, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 300 }}
                        className="bg-[#DCFCE7]/60 rounded-lg flex flex-col items-center justify-center"
                    >
                        <div className="text-[8px] font-bold text-gray-400">{label}</div>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                            className="text-sm font-black text-primary"
                        >
                            {[247, 89, 34, 6][i]}
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    </div>
);

const ColdCallScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center relative"
        >
            {/* Ring animations */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
                    transition={{ duration: 1.8, delay: i * 0.6, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-20 h-20 border-2 border-primary/30 rounded-full"
                />
            ))}
            <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-primary z-10"
            >
                <FaPhoneVolume size={20} />
            </motion.div>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="absolute -bottom-1 right-2 bg-white rounded-lg shadow-md px-2.5 py-1.5 flex items-center gap-1 border border-gray-100"
        >
            <FaCalendarCheck size={10} className="text-primary" />
            <span className="text-[10px] font-bold text-gray-700">Booked!</span>
        </motion.div>
    </div>
);

const LeadGenScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center relative overflow-hidden"
        >
            <FaGlobeAmericas size={40} className="text-primary/20" />
            {/* Pins dropping */}
            {[
                { top: "20%", left: "25%" },
                { top: "40%", left: "65%" },
                { top: "60%", left: "35%" },
                { top: "30%", left: "50%" },
                { top: "55%", left: "55%" },
            ].map((pos, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -10, scale: 0 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 500 }}
                    className="absolute"
                    style={pos}
                >
                    <FaMapMarkerAlt size={10} className="text-primary" />
                </motion.div>
            ))}
        </motion.div>
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5, type: "spring" }}
            className="absolute -bottom-1 -left-1 bg-primary text-white rounded-lg shadow-md px-2.5 py-1.5 text-[10px] font-bold"
        >
            2,847 leads
        </motion.div>
    </div>
);

const EcomScene = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-36 h-28 bg-white rounded-xl shadow-lg border border-gray-100 p-3 relative"
        >
            <div className="text-[9px] font-bold text-gray-400 mb-2">STORE AUDIT</div>
            <div className="space-y-1.5">
                {["Speed", "SEO", "Mobile"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-gray-500 w-8">{item}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${[35, 25, 50][i]}%` }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
                                className={`h-full rounded-full ${[35, 25, 50][i] < 40 ? "bg-red-400" : "bg-yellow-400"}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.4 }}
            animate={{ y: [0, -3, 0] }}
            className="absolute -top-2 -right-1 bg-white rounded-lg shadow-md px-2.5 py-1.5 flex items-center gap-1 border border-gray-100"
        >
            <FaWhatsapp size={10} className="text-green-500" />
            <span className="text-[10px] font-bold text-gray-700">Sent audit</span>
        </motion.div>
    </div>
);

const sceneComponents = [
    VideoScene, WebDesignScene, AdsScene, SeoScene, DesignScene,
    CopyScene, AgencyScene, ColdCallScene, LeadGenScene, EcomScene,
];

/* ── Niche data ───────────────────────────────────────────────── */

const niches = [
    {
        icon: FaVideo,
        title: "Video Editors",
        pain: "Struggling to find consistent clients?",
        benefits: [
            "Discover YouTubers & brands through Google Maps scraping",
            "Pull their emails & WhatsApp numbers in one click",
            "Pitch directly and close faster with built-in outreach",
        ],
    },
    {
        icon: FaLaptopCode,
        title: "Website Designers / Developers",
        pain: "Tired of waiting for inbound leads?",
        benefits: [
            "Find businesses with outdated websites in seconds",
            "Preview & qualify prospects without leaving the app",
            "Message decision-makers directly on WhatsApp",
        ],
    },
    {
        icon: FaChartLine,
        title: "Ads Managers / Media Buyers",
        pain: "Need more clients to scale retainers?",
        benefits: [
            "Target businesses already spending money on ads",
            "Reach owners via WhatsApp & email — skip the gatekeepers",
            "Build a predictable pipeline you can actually count on",
        ],
    },
    {
        icon: FaSearchDollar,
        title: "SEO Experts",
        pain: "Clients don't come easy anymore",
        benefits: [
            "Find businesses with terrible SEO in any city or suburb",
            "Qualify them instantly with the built-in website previewer",
            "Offer free audits, close retainers — rinse and repeat",
        ],
    },
    {
        icon: FaPaintBrush,
        title: "Graphic Designers",
        pain: "Low-ticket gigs not cutting it?",
        benefits: [
            "Find real businesses that need branding — not Fiverr scraps",
            "Pitch logo & brand redesigns with personalized outreach",
            "Land higher-paying clients who actually value design",
        ],
    },
    {
        icon: FaPenFancy,
        title: "Copywriters",
        pain: "Hard to find clients who value good copy?",
        benefits: [
            "Spot businesses with weak messaging & outdated websites",
            "Reach out with pitches that show you've done your homework",
            "Turn cold leads into monthly retainer clients",
        ],
    },
    {
        icon: FaBrain,
        title: "SMMA / Agencies",
        pain: "Managing outreach across tools is chaos?",
        benefits: [
            "Leads, outreach, and team management — all in one place",
            "Collaborate with your team using built-in tools",
            "Actually build systems instead of juggling spreadsheets",
        ],
    },
    {
        icon: FaPhoneVolume,
        title: "Cold Callers / Appointment Setters",
        pain: "Wasting time on bad lead lists?",
        benefits: [
            "Get verified phone numbers — no more dead lines",
            "Filter prospects by location, niche, and quality",
            "Book more meetings every single day",
        ],
    },
    {
        icon: FaGlobeAmericas,
        title: "Lead Generation Agencies",
        pain: "Scaling outreach without breaking things?",
        benefits: [
            "Automate lead discovery across any location or niche",
            "Verify emails & WhatsApp numbers in bulk before outreach",
            "Manage multiple teams & campaigns from one dashboard",
        ],
    },
    {
        icon: FaShoppingCart,
        title: "Ecom / Shopify Freelancers",
        pain: "Want more store owners as clients?",
        benefits: [
            "Find ecommerce businesses by city, suburb, or country",
            "Reach store owners directly — skip the contact forms",
            "Offer audits & Shopify improvements they'll pay for",
        ],
    },
];

/* ── Card component ───────────────────────────────────────────── */

const NicheCard = ({ niche, index }) => {
    const isEven = index % 2 === 0;
    const Scene = sceneComponents[index];

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
        >
            <motion.div
                whileHover={{ scale: 1.015, y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full max-w-[960px]"
            >
                <div className="bg-[#DCFCE7]/50 rounded-[2.5rem] p-8 md:p-12 lg:p-14 border border-green-100/70 shadow-sm hover:shadow-[0_30px_80px_-20px_rgba(15,121,44,0.12)] transition-shadow duration-500 relative overflow-hidden group">
                    {/* Green glow on hover */}
                    <div className={`absolute ${isEven ? "-right-20 -top-20" : "-left-20 -top-20"} w-56 h-56 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-3xl transition-all duration-700 pointer-events-none`}></div>

                    <div className={`relative z-10 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-14 items-center`}>
                        {/* Animated scene */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: isEven ? -5 : 5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                            className="w-full md:w-[240px] h-[200px] flex-shrink-0 flex items-center justify-center"
                        >
                            <Scene />
                        </motion.div>

                        {/* Text content */}
                        <div className="flex-1 space-y-6">
                            {/* Icon + title */}
                            <div className="flex items-center gap-4">
                                <motion.div
                                    whileHover={{ rotate: 15, scale: 1.15 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                                    className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-primary"
                                >
                                    <niche.icon size={24} />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black font-semibold text-gray-900 leading-tight">
                                        {niche.title}
                                    </h3>
                                    <p className="text-gray-500 font-medium text-sm italic mt-0.5">
                                        {niche.pain}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                                className="h-px bg-primary/10 origin-left"
                            />

                            {/* Benefits */}
                            <ul className="space-y-3.5">
                                {niche.benefits.map((b, j) => (
                                    <motion.li
                                        key={j}
                                        initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.4 + j * 0.12, ease: "easeOut" }}
                                        className="flex items-start gap-3"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ type: "spring", stiffness: 500, delay: 0.45 + j * 0.12 }}
                                        >
                                            <FaCheckCircle className="text-primary flex-shrink-0 mt-0.5" size={15} />
                                        </motion.div>
                                        <span className="text-gray-600 font-medium text-[0.95rem] leading-relaxed">
                                            {b}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ── Page ──────────────────────────────────────────────────────── */

const WhoWinsPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden bg-[#BBF7D0] pt-28 pb-20 sm:pt-36 sm:pb-28 md:pt-44 md:pb-36 px-4">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6 sm:space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/50 shadow-sm"
                    >
                        <FaStar size={12} className="text-amber-500" />
                        <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide">Who Wins With This</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-2xl sm:text-3xl md:text-6xl font-black font-bold leading-[1.1] tracking-tight text-gray-900"
                    >
                        If You Sell a Service, <br className="hidden md:block" />
                        You Already Won.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal opacity-90"
                    >
                        Find leads, verify contacts, reach out, and close — all from one platform.
                        No juggling tools. No wasted hours. Just results.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
                    >
                        <Link
                            to="/pricing"
                            className="flex items-center justify-center bg-primary hover:bg-[#0d6625] text-white px-10 py-3 font-semibold rounded-full font-black text-lg shadow-[0_20px_40px_-15px_rgba(15,121,44,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(15,121,44,0.5)] transition-all hover:-translate-y-1"
                        >
                            See Pricing <FaArrowRight className="ml-2" size={14} />
                        </Link>
                        <Link
                            to="/landing"
                            className="flex items-center justify-center bg-white hover:bg-gray-50 text-primary border-2 font-semibold border-primary/20 px-10 py-3 rounded-full font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                        >
                            How It Works
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Section intro */}
            <section className="py-20 md:py-28 px-4 bg-white">
                <div className="max-w-3xl mx-auto text-center space-y-5">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl sm:text-3xl md:text-6xl font-black font-semibold text-gray-900 tracking-tight leading-tight"
                    >
                        Your Niche. <br className="hidden md:block" /> Your Unfair Advantage.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-lg text-gray-500 max-w-xl mx-auto font-normal leading-relaxed"
                    >
                        It doesn't matter what service you sell — if your clients are businesses, this platform was built for you.
                    </motion.p>
                </div>
            </section>

            {/* Niche cards — alternating left/right with scenes */}
            <section className="pb-24 md:pb-32 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col gap-10 md:gap-14">
                        {niches.map((niche, i) => (
                            <NicheCard key={i} niche={niche} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 md:py-32 px-4 bg-[#BBF7D0] relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-3xl mx-auto text-center relative z-10 space-y-8"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-6xl font-black font-bold text-gray-900 leading-[1.1] tracking-tight">
                        Stop scrolling job boards. <br className="hidden md:block" />
                        Start harvesting clients.
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto font-normal leading-relaxed opacity-90">
                        Thousands of businesses are out there waiting to be found.
                        You just need the right tool to reach them first.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <Link
                            to="/pricing"
                            className="flex items-center justify-center bg-primary hover:bg-[#0d6625] text-white px-10 py-3 font-semibold rounded-full font-black text-lg shadow-[0_20px_40px_-15px_rgba(15,121,44,0.4)] transition-all hover:-translate-y-1"
                        >
                            Get Started <FaArrowRight className="ml-2" size={14} />
                        </Link>
                        <Link
                            to="/landing"
                            className="flex items-center justify-center bg-white hover:bg-gray-50 text-primary border-2 font-semibold border-primary/20 px-10 py-3 rounded-full font-black text-lg shadow-xl transition-all hover:-translate-y-1"
                        >
                            Back to Home
                        </Link>
                    </div>
                </motion.div>
            </section>

            <FooterSection />
        </div>
    );
};

export default WhoWinsPage;
