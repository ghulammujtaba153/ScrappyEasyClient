import React from "react";
import { FaCheckCircle, FaUsers, FaBuilding, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import HeroWorkflowAnimation from "./HeroWorkflowAnimation";

const HeroSection = () => {
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

                <h1 className="text-3xl md:text-6xl font-black font-bold leading-[1.1] tracking-tight">
                    Trusted by agencies, sales teams, and local lead gen operators. 
                    
                </h1>
                
                <p className="text-lg px-8 text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal opacity-90">
                    Extract business data, verify WhatsApp numbers, qualify leads, send bulk messages, and cold call — all from one unified platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                    <button className="w-full flex items-center justify-center sm:w-auto bg-primary hover:bg-[#0d6625] text-white px-10 py-3 font-semibold rounded-full font-black text-xl shadow-[0_20px_40px_-15px_rgba(15,121,44,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(15,121,44,0.5)] transition-all hover:-translate-y-1 active:translate-y-0">
                        Start Free <FaArrowRight className="ml-2" />
                    </button>
                    <a href="https://calendly.com/ibraheemsheikh2/project-discussion" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#0F792C] border-2 font-semibold border-[#0F792C]/20 px-10 py-3 rounded-full font-black text-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0 text-center">
                        Book a Demo
                    </a>
                </div>

                <div className="pt-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {[
                        { icon: FaBuilding, label: "Agencies" },
                        { icon: FaUsers, label: "One-time Payment" },
                        { icon: FaCheckCircle, label: "Unlimited Leads" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-gray-600 transition-all hover:scale-110">
                            <div className="p-2  rounded-lg text-base">
                                <item.icon size={15} />
                            </div>
                            <span className="font-bold font-semibold text-sm tracking-tight">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animated Workflow Visual */}
            <div className="mt-8 w-full max-w-6xl relative z-20 px-2">

                {/* Floating Icons */}
                <div className="absolute -left-8 -bottom-10 md:-left-12 animate-float z-30 hidden sm:block">
                    <div className="bg-white p-4 rounded-full shadow-2xl flex items-center justify-center transform hover:rotate-12 transition-transform border border-white">
                        <FcGoogle size={36} />
                    </div>
                </div>
                <div className="absolute -right-6 -top-12 animate-float-delayed z-30 hidden sm:block">
                    <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-center transform hover:-rotate-12 transition-transform border border-white">
                        <FaWhatsapp className="text-[#25D366]" size={40} />
                    </div>
                </div>

                <HeroWorkflowAnimation />
            </div>
        </div>
    );
};

export default HeroSection;