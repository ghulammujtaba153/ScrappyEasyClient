import React from "react";
import {
    FaCheckCircle,
    FaCrown,
    FaRocket,
    FaFire,
    FaBolt,
    FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import FooterSection from "../components/landing/FooterSection";

const plans = [
    {
        id: "2-year",
        name: "2-Year Plan",
        price: "$30",
        pkr: "PKR 8,400",
        period: "/ 2 years",
        description: "Full access to every tool for 2 years. One payment, no surprises.",
        icon: FaRocket,
        features: [
            "Unlimited lead harvesting",
            "Full CRM access",
            "WhatsApp verification & messaging",
            "Cold call dialer",
            "Email extraction",
            "Lead qualification tools",
            "Team collaboration",
            "Email & chat support",
        ],
        btnText: "Get 2-Year Access",
        highlight: false,
    },
    {
        id: "lifetime",
        name: "Lifetime Deal",
        price: "$69",
        pkr: "PKR 19,300",
        period: "one-time",
        description: "Pay once. Use forever. Every feature, every update — no expiry.",
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

const PricingPage = () => {
    return (
        <div className="bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-10 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-white to-emerald-50/50"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-bold mb-8">
                        <FaBolt size={12} />
                        Simple Pricing. No Subscriptions.
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                        Pay Once.{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                            Harvest Forever.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        One payment gets you leads, outreach, WhatsApp tools, cold calling, and team management — all in one place.
                    </p>
                </div>
            </section>

            {/* Why Manual Payments */}
            <section className="py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                                <FaShieldAlt size={12} />
                                Why Manual Payments?
                            </div>
                            <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
                                Payment processors like Stripe and PayPal flag scraping and automation tools as "high-risk." 
                                Instead of limiting our features to fit their rules, we handle payments manually — so you get the{" "}
                                <span className="text-white font-bold">full, uncompromised platform</span>. 
                                Pick a plan below, pay via JazzCash or Easypaisa, and you're in.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16 px-4 bg-white" id="plans">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                            Pick Your Plan
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                            Two options. No hidden fees. No monthly charges.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative rounded-[2.5rem] p-10 md:p-12 flex flex-col space-y-8 transition-all duration-500 hover:scale-[1.02] ${
                                    plan.highlight
                                        ? "bg-white shadow-[0_40px_100px_-20px_rgba(15,121,44,0.15)] ring-4 ring-primary/10"
                                        : "bg-gray-50/50 border border-gray-100 hover:shadow-xl"
                                }`}
                            >
                                {plan.badge && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                                        <FaFire size={12} />
                                        {plan.badge}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <div
                                        className={`inline-flex items-center justify-center p-4 rounded-2xl ${
                                            plan.highlight
                                                ? "bg-primary/10 text-primary"
                                                : "bg-white shadow-sm text-gray-900"
                                        }`}
                                    >
                                        <plan.icon size={28} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                                            {plan.name}
                                        </h3>
                                        <p className="text-gray-500 font-medium text-sm md:text-base">
                                            {plan.description}
                                        </p>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
                                            {plan.price}
                                        </span>
                                        <span className="text-base text-gray-400 font-semibold">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className="text-primary font-bold text-sm">{plan.pkr}</p>
                                </div>

                                <div className="h-px bg-gray-100 w-full"></div>

                                <div className="flex-1">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-3"
                                            >
                                                <FaCheckCircle
                                                    className="text-green-500 flex-shrink-0"
                                                    size={16}
                                                />
                                                <span className="text-gray-700 font-semibold text-sm md:text-base">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    to={`/register?plan=${plan.id}`}
                                    className={`w-full py-4 rounded-full font-bold text-lg text-center transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
                                        plan.highlight
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "bg-white border-2 border-primary/20 text-[#0F792C] hover:bg-gray-50"
                                    }`}
                                >
                                    {plan.btnText}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FooterSection />
        </div>
    );
};

export default PricingPage;
