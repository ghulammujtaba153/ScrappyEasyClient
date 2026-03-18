import React from "react";
import { FaCheckCircle, FaTimesCircle, FaRocket, FaCrown, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const PricingSection = () => {
    const plans = [
        {
            name: "Basic",
            price: "Free",
            description: "Perfect for testing our capabilities and small scale scraping.",
            icon: FaRocket,
            features: [
                "100 Leads per harvest",
                "Basic CRM access",
                "WhatsApp verification (demo)",
                "Email support"
            ],
            notIncluded: [
                "Unlimited lead storage",
                "Bulk messaging tools",
                "Custom outreach sequences",
                "Team collaboration"
            ],
            btnText: "Get Started Free",
            highlight: false,
            color: "bg-[#DCFCE7]/60"
        },
        {
            name: "Professional",
            price: "$99",
            period: "Lifetime",
            description: "Best for growing agencies and individual lead gen operators.",
            icon: FaCrown,
            features: [
                "Unlimited lead harvesting",
                "Unlimited CRM storage",
                "Full WhatsApp verification",
                "Integrated cold call dialer",
                "Priority support"
            ],
            notIncluded: [
                "Multi-user collaboration",
                "Custom API integrations"
            ],
            btnText: "Get Lifetime Access",
            highlight: true,
            color: "bg-primary"
        },
        {
            name: "Team",
            price: "$299",
            period: "Lifetime",
            description: "Designed for large sales teams and white-label agencies.",
            icon: FaUsers,
            features: [
                "Everything in Professional",
                "Up to 10 Team members",
                "Shared lead databases",
                "Advanced performance analytics",
                "Whitelabel export reports"
            ],
            notIncluded: [],
            btnText: "Contact for Demo",
            highlight: false,
            color: "bg-[#DBEAFE]/60"
        }
    ];

    return (
        <section className="py-32 px-4 bg-white" id="pricing">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center space-y-4 mb-24 animate-slideUp">
                    <h2 className="text-3xl md:text-6xl font-black font-semibold text-gray-900 tracking-tight">
                        Pricing
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-normal">
                        No monthly subscriptions. Just one payment for lifetime access to 
                        your favorite lead generation tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div 
                            key={index} 
                            className={`relative rounded-[2.5rem] p-10 flex flex-col items-stretch space-y-10 transition-all duration-500 hover:scale-[1.02] ${plan.highlight ? 'bg-white shadow-[0_40px_100px_-20px_rgba(15,121,44,0.15)] ring-4 ring-primary/10 -translate-y-4' : 'bg-gray-50/50 border border-gray-100 hover:shadow-xl'}`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full font-black font-bold text-sm uppercase tracking-widest shadow-xl">
                                    Most Popular
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="space-y-6">
                                <div className={`inline-flex items-center justify-center p-5 rounded-2xl ${plan.highlight ? 'bg-primary/10 text-primary' : 'bg-white shadow-sm text-gray-900'}`}>
                                    <plan.icon size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black font-semibold text-gray-900">{plan.name}</h3>
                                    <p className="text-gray-500 font-normal">{plan.description}</p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl md:text-6xl font-black font-semibold text-gray-900 tracking-tight">{plan.price}</span>
                                    {plan.period && <span className="text-xl text-gray-400 font-bold font-semibold uppercase tracking-widest">{plan.period}</span>}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 w-full"></div>

                            {/* Features List */}
                            <div className="flex-1 space-y-6">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                                            <span className="text-gray-700 font-bold font-semibold">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.notIncluded.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 opacity-40">
                                            <FaTimesCircle className="text-gray-400 flex-shrink-0" size={18} />
                                            <span className="text-gray-500 font-bold font-semibold">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA Button */}
                            <Link 
                                to={plan.highlight ? "/pricing" : "/contact"} 
                                className={`w-full py-5 rounded-full font-black font-bold text-lg text-center transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 ${plan.highlight ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white border-2 border-primary/20 text-[#0F792C] hover:bg-gray-50'}`}
                            >
                                {plan.btnText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
