import React from "react";
import { FaLock, FaCheckCircle, FaUsers, FaBuilding, FaWhatsapp } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const HeroSection = () => {
    const dummyData = [
        { name: "John Doe", rating: 4.5, reviews: 123, number: "1234567890", address: "123 Main St" },
        { name: "Jane Smith", rating: 4.8, reviews: 89, number: "9876543210", address: "456 Oak Ave" },
        { name: "Bob Johnson", rating: 4.2, reviews: 56, number: "1122334455", address: "789 Pine Rd" },
        { name: "Alice Brown", rating: 4.9, reviews: 210, number: "5566778899", address: "321 Elm St" },
        { name: "Charlie Davis", rating: 4.6, reviews: 145, number: "9988776655", address: "654 Maple Dr" },
    ];

    return (
        <div className="relative overflow-hidden bg-[#BBF7D0] min-h-screen w-full flex flex-col items-center py-20 px-4">
            
            {/* Background Accents for Premium Feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Floating Icons (Global) */}
            <div className="absolute top-20 left-10 md:left-20 animate-float z-10 hidden sm:block">
                <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer border border-white">
                    <FcGoogle size={40} />
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl text-center space-y-10 animate-slideUp z-20">
                <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-sm mb-4">
                    {/* <FaLock className="text-primary text-xs" />
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#0F792C]">Secure Data Extraction</span> */}
                </div>

                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                    Trusted by agencies, sales teams, and local lead gen operators. 
                    
                </h1>
                
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-semibold opacity-90">
                    Extract business data, verify WhatsApp numbers, qualify leads, send bulk messages, and cold call — all from one unified platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                    <button className="w-full sm:w-auto bg-primary hover:bg-[#0d6625] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-[0_20px_40px_-15px_rgba(15,121,44,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(15,121,44,0.5)] transition-all hover:-translate-y-1 active:translate-y-0">
                        Start Free
                    </button>
                    <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#0F792C] border-2 border-[#0F792C]/20 px-10 py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0">
                        Book a Demo
                    </button>
                </div>

                <div className="pt-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {[
                        { icon: FaBuilding, label: "Agencies" },
                        { icon: FaUsers, label: "One-time Payment" },
                        { icon: FaCheckCircle, label: "Unlimited Leads" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-gray-600 transition-all hover:scale-110">
                            <div className="bg-white/40 p-2 rounded-lg text-primary">
                                <item.icon size={22} />
                            </div>
                            <span className="font-bold text-base md:text-lg tracking-tight">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div className="mt-8 w-full max-w-6xl relative z-20 px-2">
                
                {/* Floating Icons near Table */}
                {/* 1. Google Icon near Table (Rounded, BG White) */}
                <div className="absolute -left-8 -bottom-10 md:-left-12 animate-float z-30 hidden sm:block">
                    <div className="bg-white p-4 rounded-full shadow-2xl flex items-center justify-center transform hover:rotate-12 transition-transform border border-white">
                        <FcGoogle size={36} />
                    </div>
                </div>

                {/* 2. WhatsApp Icon Right-Above Table */}
                <div className="absolute -right-6 -top-12 animate-float-delayed z-30 hidden sm:block">
                    <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-center transform hover:-rotate-12 transition-transform border border-white">
                        <FaWhatsapp className="text-[#25D366]" size={40} />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-white p-1.5">
                    <div className="bg-white rounded-[2.2rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#f0fdf4]/80 border-b border-green-50">
                                        <th className="px-8 py-4 font-black text-[#0F792C] uppercase text-xs tracking-widest text-nowrap">Name</th>
                                        <th className="px-8 py-4 font-black text-[#0F792C] uppercase text-xs tracking-widest text-center text-nowrap">Rating</th>
                                        <th className="px-8 py-4 font-black text-[#0F792C] uppercase text-xs tracking-widest text-center text-nowrap">Reviews</th>
                                        <th className="px-8 py-4 font-black text-[#0F792C] uppercase text-xs tracking-widest text-center text-nowrap">Number</th>
                                        <th className="px-8 py-4 font-black text-[#0F792C] uppercase text-xs tracking-widest text-right text-nowrap">Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {dummyData.map((row, index) => (
                                        <tr 
                                            key={index} 
                                            className="hover:bg-green-50/40 transition-all group cursor-default animate-row-slide opacity-0 fill-mode-forwards"
                                            style={{ animationDelay: `${index * 150}ms` }}
                                        >
                                            <td className="px-8 py-4 font-bold text-gray-900 text-lg text-nowrap">{row.name}</td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center justify-center gap-1.5 bg-yellow-50 text-yellow-700 py-1.5 px-3 rounded-full w-20 mx-auto border border-yellow-100 shadow-sm">
                                                    <span className="text-sm font-black">★</span>
                                                    <span className="font-black text-sm">{row.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-center">
                                                <span className="font-bold text-gray-600 bg-gray-50 px-4 py-1.5 rounded-full text-sm text-nowrap">
                                                    {row.reviews} Reviews
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-center">
                                                <span className="font-mono font-bold text-primary group-hover:underline decoration-2 underline-offset-4 cursor-pointer text-nowrap">
                                                    {row.number}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-gray-500 font-medium text-right text-sm">
                                                <div className="flex items-center justify-end gap-2 group-hover:text-gray-900 transition-colors">
                                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                                    {row.address}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements around Table */}
                <div className="flex justify-between items-center px-8 mt-6">
                    <p className="text-sm font-bold text-[#0F792C]/60 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        Showing sample lead data
                    </p>
                    <div className="flex gap-2">
                        <div className="w-8 h-1 bg-primary/20 rounded-full"></div>
                        <div className="w-12 h-1 bg-primary rounded-full"></div>
                        <div className="w-8 h-1 bg-primary/20 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;