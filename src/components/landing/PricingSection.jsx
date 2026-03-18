import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const PricingSection = () => {
    const plans = [
        {
            name: "Free",
            subtitle: "For individuals and side projects.",
            price: "$0",
            period: "/mo",
            yearlyInfo: "Billed $108 yearly",
            buttonText: "Get Started",
            buttonStyle: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            features: [
                { label: "1 Device at a time", included: true },
                { label: "Google Maps Scraping", included: true },
                { label: "Email Finder (1000/mo)", included: true },
                { label: "Social Media Links", included: true },
                { label: "Basic Support", included: true },
                { label: "LinkedIn Scraping", included: false },
                { label: "API Access", included: false },
                { label: "Priority Support", included: false }
            ],
            highlight: false
        },
        {
            name: "Professional",
            subtitle: "For growing teams and agencies.",
            price: "$29",
            period: "/mo",
            yearlyInfo: "Billed $348 yearly",
            buttonText: "Try Professional",
            buttonStyle: "bg-black text-white hover:bg-gray-800",
            features: [
                { label: "3 Devices at a time", included: true },
                { label: "Google Maps Scraping", included: true },
                { label: "Email Finder (Unlimited)", included: true },
                { label: "Social Media Links", included: true },
                { label: "LinkedIn Scraping", included: true },
                { label: "Decision Maker Finder", included: true },
                { label: "Facebook Page Scraper", included: true },
                { label: "Priority Email Support", included: true },
                { label: "API Access", included: false },
                { label: "Dedicated Account Manager", included: false }
            ],
            highlight: true
        }
    ];

    return (
        <section className="py-24 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center space-y-4 mb-20 animate-slideUp">
                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">
                        Pricing
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Our lead generation tools are both powerful and user-friendly. They are 
                        created to streamline common workflows through automation.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <div 
                            key={index}
                            className={`flex-1 rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 border-2 ${
                                plan.highlight 
                                ? 'border-[#0F792C] shadow-[0_20px_50px_rgba(15,121,44,0.1)]' 
                                : 'border-gray-100 shadow-sm'
                            } flex flex-col group hover:scale-[1.02]`}
                        >
                            {/* Card Header */}
                            <div className="text-center space-y-2 mb-8">
                                <h3 className="text-3xl font-black text-gray-900">{plan.name}</h3>
                                <p className="text-gray-400 text-sm font-bold">{plan.subtitle}</p>
                            </div>

                            {/* Pricing Area */}
                            <div className="text-center space-y-1 mb-10">
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-6xl font-black text-gray-900">{plan.price}</span>
                                    <span className="text-gray-400 font-bold">{plan.period}</span>
                                </div>
                                <p className="text-green-500 font-black text-xs uppercase tracking-wider">
                                    {plan.yearlyInfo}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 mb-12">
                                <Link 
                                    to="/register"
                                    className={`block w-full text-center py-4 rounded-full font-black text-lg transition-all ${plan.buttonStyle}`}
                                >
                                    {plan.buttonText}
                                </Link>
                                <div className="bg-[#EFFAF2] text-[#0F792C] border border-[#DCFCE7] py-4 rounded-full font-black text-sm text-center">
                                    Payment by JazzCash / EasyPaisa
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">
                                    Features
                                </h4>
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className={`flex items-center gap-3 ${feature.included ? 'text-gray-700' : 'text-gray-300'}`}>
                                            {feature.included ? (
                                                <FaCheck className="text-green-500 text-sm flex-shrink-0" />
                                            ) : (
                                                <FaTimes className="text-gray-200 text-sm flex-shrink-0" />
                                            )}
                                            <span className="font-bold text-sm tracking-tight">{feature.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
