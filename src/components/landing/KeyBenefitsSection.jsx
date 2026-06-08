import React, { useEffect, useRef, useState } from "react";
import { FaCog } from "react-icons/fa";

const KeyBenefitsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef(null);
    const cardRefs = useRef([]);
    const headingRef = useRef(null);

    const benefits = [
        {
            title: "Harvest leads faster than manual copy-paste",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#DCFCE7]",
            headingColor: "#16a34a",
        },
        {
            title: "Unlimited lead storage in CRM (Lifetime)",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#DBEAFE]",
            headingColor: "#2563eb",
        },
        {
            title: "Team collaboration (invite coordinators and members)",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#EDE9FE]",
            headingColor: "#7c3aed",
        },
        {
            title: "WhatsApp availability verification",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#FEF9C3]",
            headingColor: "#ca8a04",
        },
        {
            title: "Built-in outreach tools: bulk messaging and cold calling",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#E0F2FE]",
            headingColor: "#0284c7",
        },
        {
            title: "Nearby cities recommendations so you don't miss suburbs",
            description: "Map Harvest automates the process of data scraping from Google Maps, Google Search and more making it faster and efficient to generate leads.",
            bgColor: "bg-[#FFF1F2]",
            headingColor: "#f9a8b4",
        }
    ];

    // Track which card is most visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = cardRefs.current.indexOf(entry.target);
                        if (index !== -1) {
                            setActiveIndex(index);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="py-24 px-4 bg-white" ref={sectionRef}>
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">

                {/* Left Side: Sticky Header that vertically centers with cards */}
                <div className="lg:w-1/3">
                    <div
                        ref={headingRef}
                        className="lg:sticky mb-12 lg:mb-0 flex items-center"
                        style={{
                            top: "50vh",
                            transform: "translateY(-50%)",
                            height: "auto",
                        }}
                    >
                        <h2
                            className="text-3xl md:text-6xl font-black font-semibold leading-tight text-gray-900"
                        >
                            Why You'll Win
                        </h2>
                    </div>
                </div>

                {/* Right Side: Stacking Cards */}
                <div className="lg:w-2/3 relative">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            ref={(el) => (cardRefs.current[index] = el)}
                            className="sticky mb-8 last:mb-0"
                            style={{
                                top: `${6 + index * 2}rem`,
                                zIndex: index + 1
                            }}
                        >
                            <div
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyBenefitsSection;
