import React from "react";
import { FaArrowRight, FaMapMarkedAlt, FaCoffee, FaBuilding, FaGlobe, FaSearch, FaPhoneAlt, FaStar, FaWhatsapp, FaChrome } from "react-icons/fa";

const HowWorkSection = () => {
    const cards = [
        {
            id: "card-1",
            bg: "bg-[#DCFCE7]",
            icon: FaChrome,
            iconColor: "text-[#0F792C]",
            title: "Install Lead Buddy",
            description: "Install our powerful Lead Buddy Chrome extension in seconds. It’s the engine that turns Google Maps listings into a stream of high-quality business leads for your agency.",
            btnColor: "bg-[#BBF7D0]/50 hover:bg-[#BBF7D0] text-[#0F792C] border-[#BBF7D0]",
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
            btnColor: "bg-orange-50/50 hover:bg-orange-50 text-gray-900 border-orange-100",
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
            btnColor: "bg-yellow-50/50 hover:bg-yellow-50 text-gray-900 border-yellow-200",
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
            icon: FaWhatsapp,
            iconColor: "text-blue-600",
            title: "Verify & Message",
            description: "Instantly verify WhatsApp availability for every phone number harvested. Setup automated message sequences to launch outreach campaigns that reach your prospects where they are most active.",
            btnColor: "bg-blue-50/50 hover:bg-blue-50 text-gray-900 border-blue-100",
            layout: "lg:flex-row-reverse",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative min-h-[250px] flex flex-col items-center justify-center text-center">
                        <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100 w-full max-w-xs space-y-6">
                            <div className="bg-white inline-block p-4 rounded-full shadow-md text-green-500">
                                <FaWhatsapp size={32} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black font-bold text-gray-800 text-sm">WhatsApp Verification</h4>
                                <p className="text-[10px] text-green-500 font-black font-bold uppercase tracking-[0.2em] animate-pulse">Running Checks...</p>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[85%] animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "card-5",
            bg: "bg-[#EDE9FE]",
            icon: FaPhoneAlt,
            iconColor: "text-purple-600",
            title: "Cold Call Dialer",
            description: "Close deals faster without leaving the platform. Use our built-in dialer to cold call prospects directly from the Map Harvest dashboard and log your success in real-time.",
            btnColor: "bg-purple-50/50 hover:bg-purple-50 text-gray-900 border-purple-100",
            layout: "lg:flex-row",
            visual: (
                <div className="w-full lg:w-1/2 relative group">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-white/50 relative">
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-5 mb-5">
                            <div className="bg-red-50 p-3 rounded-2xl text-red-500 shadow-sm animate-pulse"><FaPhoneAlt size={24} /></div>
                            <div className="flex-1">
                                <h4 className="font-black font-bold text-gray-900 text-base">Calling Lead...</h4>
                                <p className="text-xs text-gray-400 mt-1 font-bold font-semibold">Connecting via Map Harvest</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-full py-2.5 px-5 shadow-2xl border border-gray-50 flex items-center gap-2 animate-bounce-subtle whitespace-nowrap z-10">
                            <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
                            <span className="font-bold font-semibold text-gray-800 text-xs tracking-tight">Direct Dialer Active</span>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section className="bg-white py-32 px-4 shadow-sm">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center space-y-4 mb-32">
                    <h2 className="text-3xl md:text-6xl font-black font-semibold text-gray-900 tracking-tight">
                        How It Works
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
                        Map Harvest streamlines your entire lead generation pipeline. From harvesting 
                        data with Lead Buddy to closing deals via our integrated outreach tools.
                    </p>
                </div>

                {/* Stacking Cards Container */}
                <div className="relative">
                    {cards.map((card, index) => (
                        <div 
                            key={card.id} 
                            className="sticky top-0 h-screen flex items-center justify-center pointer-events-none"
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
                                        <button className="bg-black hover:bg-gray-800 text-white px-7 py-3 rounded-full font-semibold flex items-center gap-3 shadow-lg transition-all hover:scale-105 group/btn">
                                            Explore Features 
                                            <FaArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                        <button className={`${card.btnColor} border-2 px-7 py-3 rounded-full font-semibold text-sm shadow-sm transition-all hover:scale-105 text-nowrap`}>
                                            Get Lead Buddy Free
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Added Bottom Spacing for last card to scroll properly */}
            <div className="h-[80vh]"></div>
        </section>
    );
};

export default HowWorkSection;