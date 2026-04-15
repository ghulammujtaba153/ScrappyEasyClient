import React from "react";
import { FaCheckCircle, FaCrown, FaRocket, FaFire } from "react-icons/fa";
import { Link } from "react-router-dom";

const PricingSection = () => {
    const plans = [
        {
            name: "2-Year Plan",
            price: "$30",
            period: "/ 2 years",
            description: "Everything you need to start generating leads and closing deals for 2 full years.",
            icon: FaRocket,
            features: [
                "Unlimited lead harvesting",
                "Full CRM access",
                "WhatsApp verification",
                "Cold call dialer",
                "Email extraction",
                "Lead qualification tools",
                "Team collaboration",
                "Email & chat support",
            ],
            btnText: "Get Started",
            highlight: false,
        },
        {
            name: "Lifetime Deal",
            price: "$69",
            period: "one-time",
            description: "Pay once, use forever. Full access to every feature with no expiry — ever.",
            icon: FaCrown,
            badge: "First 1,000 users only",
            features: [
                "Everything in 2-Year Plan",
                "Lifetime access — no renewals",
                "All future updates included",
                "Priority support",
                "Bulk messaging tools",
                "Advanced campaign builder",
                "Custom outreach sequences",
                "Early access to new features",
            ],
            btnText: "Claim Lifetime Access",
            highlight: true,
        },
    ];

    return (
        <section className="py-32 px-4 bg-white" id="pricing">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-3xl md:text-6xl font-black font-semibold text-gray-900 tracking-tight">
                        Pricing
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-normal">
                        No monthly subscriptions. Just one payment for access to your entire lead generation toolkit.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-[2.5rem] p-10 md:p-12 flex flex-col space-y-8 transition-all duration-500 hover:scale-[1.02] ${plan.highlight ? "bg-white shadow-[0_40px_100px_-20px_rgba(15,121,44,0.15)] ring-4 ring-primary/10" : "bg-gray-50/50 border border-gray-100 hover:shadow-xl"}`}
                        >
                            {plan.badge && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                                    <FaFire size={12} />
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="space-y-5">
                                <div className={`inline-flex items-center justify-center p-4 rounded-2xl ${plan.highlight ? "bg-primary/10 text-primary" : "bg-white shadow-sm text-gray-900"}`}>
                                    <plan.icon size={28} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl md:text-3xl font-black font-semibold text-gray-900">{plan.name}</h3>
                                    <p className="text-gray-500 font-normal text-sm md:text-base">{plan.description}</p>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl md:text-6xl font-black font-semibold text-gray-900 tracking-tight">{plan.price}</span>
                                    <span className="text-base text-gray-400 font-semibold">{plan.period}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 w-full"></div>

                            {/* Features */}
                            <div className="flex-1">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <FaCheckCircle className="text-green-500 flex-shrink-0" size={16} />
                                            <span className="text-gray-700 font-semibold text-sm md:text-base">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <Link
                                to="/pricing"
                                className={`w-full py-4 rounded-full font-bold text-lg text-center transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 block ${plan.highlight ? "bg-primary text-white hover:bg-primary/90" : "bg-white border-2 border-primary/20 text-[#0F792C] hover:bg-gray-50"}`}
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
