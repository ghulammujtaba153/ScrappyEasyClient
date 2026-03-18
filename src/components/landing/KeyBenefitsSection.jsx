import React from "react";
import { FaCog } from "react-icons/fa";

const KeyBenefitsSection = () => {
    const benefits = [
        {
            title: "Harvest leads faster than manual copy-paste",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search, Yellow Pages and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#DCFCE7]"
        },
        {
            title: "Unlimited lead storage in CRM (Lifetime)",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search, Yellow Pages and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#DBEAFE]"
        },
        {
            title: "Team collaboration (invite coordinators and members)",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search, Yellow Pages and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#EDE9FE]"
        },
        {
            title: "WhatsApp availability verification",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search, Yellow Pages and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#FEF9C3]"
        },
        {
            title: "Built-in outreach tools: bulk messaging and cold calling",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search, Yellow Pages and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#E0F2FE]"
        },
        {
            title: "Nearby cities recommendations so you don't miss suburbs",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search, Yellow Pages and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#FFE4E6]"
        }
    ];

    return (
        <section className="py-24 px-4 mt-[-600px] bg-white">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">
                
                {/* Left Side: Sticky Header */}
                <div className="lg:w-1/3">
                    <div className="lg:sticky lg:top-24 mb-12 lg:mb-0">
                        <h2 className="text-3xl md:text-6xl font-black font-semibold text-gray-900 leading-tight">
                            Key Benefits
                        </h2>
                    </div>
                </div>

                {/* Right Side: Scrollable Cards */}
                <div className="lg:w-2/3 space-y-8">
                    {benefits.map((benefit, index) => (
                        <div 
                            key={index} 
                            className={`${benefit.bgColor} rounded-[2.5rem] p-10 md:p-14 space-y-6 transition-all duration-500 hover:scale-[1.02] cursor-default group shadow-sm hover:shadow-xl`}
                        >
                            {/* Icon Box */}
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center transition-transform group-hover:rotate-12">
                                <FaCog className="text-gray-900" size={20} />
                            </div>

                            {/* Text Content */}
                            <div className="space-y-4">
                                <h3 className="text-xl md:text-3xl font-black font-semibold text-gray-900 leading-tight">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 text-lg font-normal leading-relaxed opacity-80">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyBenefitsSection;