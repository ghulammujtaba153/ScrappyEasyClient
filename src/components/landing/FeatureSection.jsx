import React from "react";
import { FaCheckCircle, FaCoffee, FaBuilding, FaSearch } from "react-icons/fa";

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
            visual: (
                <div className="w-full lg:w-[55%] relative group">
                    <div className="absolute inset-0 bg-[#DCFCE7] rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10 opacity-50"></div>
                    <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                        <div className="w-full max-w-md space-y-4 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4">
                                <div className="bg-red-50 p-2.5 rounded-xl text-red-500"><FaCoffee size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Downtown Coffee</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">4.8 (120)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">123 Main St, New York</p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4 opacity-90 scale-[0.98]">
                                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500"><FaBuilding size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Tech Solutions Inc</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">5.0 (85)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">45 Tech Park, SF</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Built-in CRM",
            description: "Manage your entire sales pipeline within Map Harvest. No more external tools or messy spreadsheets.",
            points: [
                "Automatic lead categorization and tagging.",
                "Track interaction history and outreach status.",
                "One-click export to Excel or Google Sheets."
            ],
            bgColor: "bg-[#FFEDD5]/60",
            layout: "flex-col lg:flex-row-reverse",
            visual: (
                <div className="w-full lg:w-[55%] relative group">
                    <div className="absolute inset-0 bg-[#FFEDD5] rounded-[2.5rem] transform -translate-x-4 translate-y-4 -z-10 opacity-50"></div>
                    <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                        <div className="w-full max-w-sm space-y-4 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                             <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 w-full space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                                        <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
                                        <div className="h-4 w-12 bg-green-50 rounded-lg"></div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "WhatsApp Verification",
            description: "Ensure your outreach reaches target prospects by verifying their WhatsApp status instantly.",
            points: [
                "Check if phone numbers have active WhatsApp accounts.",
                "Filter and export only verified WhatsApp contacts.",
                "Reduce bounce rates and improve outreach success."
            ],
            bgColor: "bg-[#FEF9C3]/60",
            layout: "flex-col lg:flex-row",
            visual: (
                <div className="w-full lg:w-[55%] relative group">
                    <div className="absolute inset-0 bg-[#FEF9C3] rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10 opacity-50"></div>
                    <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                        <div className="w-full max-w-md space-y-4 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                            {/* Lead Card 1 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4">
                                <div className="bg-red-50 p-2.5 rounded-xl text-red-500"><FaCoffee size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Downtown Coffee</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">4.8 (120)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">123 Main St, New York</p>
                                </div>
                            </div>
                            {/* Lead Card 2 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4 opacity-90 scale-[0.98]">
                                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500"><FaBuilding size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Tech Solutions Inc</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">5.0 (85)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">45 Tech Park, SF</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Outreach Automation",
            description: "Scale your engagement by sending automatic personalized messages to harvested leads.",
            points: [
                "Send bulk automated messages via WhatsApp.",
                "Personalize outreach with custom tags and values.",
                "Schedule campaigns for maximum engagement."
            ],
            bgColor: "bg-[#DBEAFE]/60",
            layout: "flex-col lg:flex-row-reverse",
            visual: (
                <div className="w-full lg:w-[55%] relative group">
                    <div className="absolute inset-0 bg-[#DBEAFE] rounded-[2.5rem] transform -translate-x-4 translate-y-4 -z-10 opacity-50"></div>
                    <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                        <div className="w-full max-w-md space-y-4 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                            {/* Lead Card 1 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4">
                                <div className="bg-red-50 p-2.5 rounded-xl text-red-500"><FaCoffee size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Downtown Coffee</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">4.8 (120)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">123 Main St, New York</p>
                                </div>
                            </div>
                            {/* Lead Card 2 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4 opacity-90 scale-[0.98]">
                                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500"><FaBuilding size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Tech Solutions Inc</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">5.0 (85)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">45 Tech Park, SF</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Cold Calling Dashboard",
            description: "Directly dial your leads from the Map Harvest dashboard and close deals instantly.",
            points: [
                "Built-in one-click dialer for fast cold calling.",
                "Record and log call results within the CRM.",
                "Manage your follow-ups and pipeline efficiency."
            ],
            bgColor: "bg-[#EDE9FE]/60",
            layout: "flex-col lg:flex-row",
            visual: (
                <div className="w-full lg:w-[55%] relative group">
                    <div className="absolute inset-0 bg-[#EDE9FE] rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10 opacity-50"></div>
                    <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                        <div className="w-full max-w-md space-y-4 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                            {/* Lead Card 1 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4">
                                <div className="bg-red-50 p-2.5 rounded-xl text-red-500"><FaCoffee size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Downtown Coffee</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">4.8 (120)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">123 Main St, New York</p>
                                </div>
                            </div>
                            {/* Lead Card 2 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4 opacity-90 scale-[0.98]">
                                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500"><FaBuilding size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Tech Solutions Inc</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">5.0 (85)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">45 Tech Park, SF</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Nearby Recommendations",
            description: "Don't miss out on untapped suburbs. Map Harvest suggests nearby cities to broaden your search.",
            points: [
                "Automated suburb and adjacent city discovery.",
                "Expand your lead pool effortlessly by location.",
                "Stay ahead of competitors in local markets."
            ],
            bgColor: "bg-[#FFE4E6]/60",
            layout: "flex-col lg:flex-row-reverse",
            visual: (
                <div className="w-full lg:w-[55%] relative group">
                    <div className="absolute inset-0 bg-[#FFE4E6] rounded-[2.5rem] transform -translate-x-4 translate-y-4 -z-10 opacity-50"></div>
                    <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center">
                        <div className="w-full max-w-md space-y-4 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                            {/* Lead Card 1 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4">
                                <div className="bg-red-50 p-2.5 rounded-xl text-red-500"><FaCoffee size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Downtown Coffee</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">4.8 (120)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">123 Main St, New York</p>
                                </div>
                            </div>
                            {/* Lead Card 2 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start gap-4 opacity-90 scale-[0.98]">
                                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500"><FaBuilding size={18} /></div>
                                <div className="flex-1">
                                    <h4 className="font-black font-bold text-gray-900 text-sm">Tech Solutions Inc</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-[10px] font-bold font-semibold text-gray-400">5.0 (85)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-normal">45 Tech Park, SF</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section className="py-32 bg-white overflow-hidden shadow-sm" id="features">
            <div className="max-w-6xl mx-auto px-4">
                
                {/* Header Section */}
                <div className="text-center space-y-4 mb-32 animate-slideUp">
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
                            className={`flex ${feature.layout} items-center gap-16 md:gap-24 animate-slideUp`}
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

export default FeatureSection;