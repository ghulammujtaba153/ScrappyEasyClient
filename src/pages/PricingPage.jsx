import React from "react";
import { Link } from "react-router-dom";
import {
    FaCheckCircle,
    FaCrown,
    FaRocket,
    FaFire,
    FaBolt,
    FaShieldAlt,
    FaWhatsapp,
    FaEnvelope,
    FaPhoneAlt,
    FaUsers,
    FaGlobe,
    FaSearch,
    FaLightbulb,
    FaDesktop,
    FaUniversity,
    FaMoneyBillWave,
    FaCloudUploadAlt,
    FaClock,
    FaArrowRight,
    FaLock,
} from "react-icons/fa";
import Navbar from "../components/landing/Navbar";
import FooterSection from "../components/landing/FooterSection";

const features = [
    {
        icon: FaSearch,
        title: "Lead Qualification",
        desc: "Automatically qualify leads based on smart criteria so you only chase the ones that matter.",
    },
    {
        icon: FaWhatsapp,
        title: "WhatsApp Number Verification",
        desc: "Instantly verify which phone numbers are active on WhatsApp before you reach out.",
    },
    {
        icon: FaWhatsapp,
        title: "WhatsApp Message Sending",
        desc: "Send bulk personalised messages directly to verified WhatsApp numbers at scale.",
    },
    {
        icon: FaEnvelope,
        title: "Email Extractor",
        desc: "Pull email addresses from business listings so you never run out of outreach channels.",
    },
    {
        icon: FaDesktop,
        title: "Swiper for Website Qualifying",
        desc: "Swipe through business websites like a deck — qualify or skip in seconds.",
    },
    {
        icon: FaLightbulb,
        title: "Smart Suburb Suggestions",
        desc: "AI-powered suggestions for nearby suburbs to expand your lead pool effortlessly.",
    },
    {
        icon: FaPhoneAlt,
        title: "Cold Calling",
        desc: "Built-in dialer to cold-call leads right from the platform — no extra tools needed.",
    },
    {
        icon: FaUsers,
        title: "Team Management for Sales",
        desc: "Manage your entire sales team, assign leads, and track performance in one place.",
    },
    {
        icon: FaGlobe,
        title: "Global Collaboration",
        desc: "Collaborate with team members across the globe over Google Meet — in real time.",
    },
];

const plans = [
    {
        name: "2-Year Plan",
        price: "$30",
        period: "/ 2 years",
        description:
            "Everything you need to start generating leads and closing deals for 2 full years.",
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
        btnText: "Get 2-Year Access",
        highlight: false,
    },
    {
        name: "Lifetime Deal",
        price: "$69",
        period: "one-time",
        description:
            "Pay once, use forever. Full access to every feature with no expiry — ever.",
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

const paymentSteps = [
    {
        step: "01",
        icon: FaMoneyBillWave,
        title: "Choose Your Plan",
        desc: "Pick the plan that works for you — 2-Year Access or Lifetime Deal.",
    },
    {
        step: "02",
        icon: FaUniversity,
        title: "Make a Payment",
        desc: "Transfer the amount via Bank Transfer or Easypaisa to our account details listed below.",
    },
    {
        step: "03",
        icon: FaCloudUploadAlt,
        title: "Upload Screenshot",
        desc: "Send us a screenshot of your payment confirmation via our support channel.",
    },
    {
        step: "04",
        icon: FaClock,
        title: "Get Access in 12 Hours",
        desc: "Our team verifies your payment and grants you full access within 12 hours.",
    },
];

const PricingPage = () => {
    return (
        <div className="bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-white to-emerald-50/50"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-bold mb-8">
                        <FaBolt size={12} />
                        Simple, Transparent Pricing
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                        One Platform.{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                            Zero Limits.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        No monthly subscriptions. No hidden fees. Just one
                        payment for access to the most complete lead generation
                        and outreach toolkit on the market.
                    </p>
                </div>
            </section>

            {/* Power Statement */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2.5rem] p-10 md:p-16 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                                <FaShieldAlt size={12} />
                                Why We Do Things Differently
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                                We built something{" "}
                                <span className="text-emerald-400">
                                    so powerful
                                </span>
                                , traditional payment processors won't work
                                with us.
                            </h2>
                            <div className="space-y-4 text-gray-300 text-base md:text-lg font-medium leading-relaxed">
                                <p>
                                    Map Harvest combines lead scraping, WhatsApp
                                    automation, cold calling, email extraction,
                                    team management, and real-time global
                                    collaboration into a single platform. This
                                    level of power is exactly why major payment
                                    gateways like Stripe and PayPal flag us as
                                    "high risk" — not because we do anything
                                    wrong, but because data scraping and
                                    automation tools simply don't fit neatly into
                                    their compliance boxes.
                                </p>
                                <p>
                                    Rather than water down our product to
                                    satisfy payment processors, we chose to
                                    keep every feature intact and handle
                                    payments directly. This means you get the{" "}
                                    <span className="text-white font-bold">
                                        full, uncompromised platform
                                    </span>{" "}
                                    — and we keep the lights on with a simple,
                                    human-verified payment process.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 bg-gray-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                            Everything Under One Roof
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                            9 powerful tools that would cost you hundreds per
                            month elsewhere — included in every plan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <f.icon size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-24 px-4 bg-white" id="plans">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                            Choose Your Plan
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                            Two plans. No gimmicks. Pick one and start closing
                            deals.
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

                                <a
                                    href="#how-to-pay"
                                    className={`w-full py-4 rounded-full font-bold text-lg text-center transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 block ${
                                        plan.highlight
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "bg-white border-2 border-primary/20 text-[#0F792C] hover:bg-gray-50"
                                    }`}
                                >
                                    {plan.btnText}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Pay Section */}
            <section
                className="py-24 px-4 bg-gray-50/50"
                id="how-to-pay"
            >
                <div className="max-w-5xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-bold">
                            <FaLock size={12} />
                            Secure & Simple
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                            How to Pay
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                            4 simple steps. No credit card forms. No
                            auto-charges. Just a straightforward, human-verified
                            process.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {paymentSteps.map((s, i) => (
                            <div
                                key={i}
                                className="relative bg-white rounded-2xl p-8 border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
                            >
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                                    {s.step}
                                </div>
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                                    <s.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {s.title}
                                </h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                    {s.desc}
                                </p>
                                {i < paymentSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 text-gray-300">
                                        <FaArrowRight size={14} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Payment Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Bank Transfer */}
                        <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <FaUniversity size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">
                                        Bank Transfer
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium">
                                        Direct bank-to-bank transfer
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4 bg-gray-50 rounded-2xl p-6">
                                <p className="text-gray-500 text-sm font-medium">
                                    Transfer to the following account and send us
                                    a screenshot of the receipt:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm font-medium">
                                            Account details
                                        </span>
                                        <span className="text-gray-900 font-bold text-sm">
                                            Provided after plan selection
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-6 text-gray-400 text-xs font-medium text-center">
                                Available for international &amp; local transfers
                            </p>
                        </div>

                        {/* Easypaisa */}
                        <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                    <FaMoneyBillWave size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">
                                        Easypaisa
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium">
                                        Quick mobile wallet payment
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4 bg-gray-50 rounded-2xl p-6">
                                <p className="text-gray-500 text-sm font-medium">
                                    Send payment to our Easypaisa account and
                                    share the confirmation screenshot:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm font-medium">
                                            Account details
                                        </span>
                                        <span className="text-gray-900 font-bold text-sm">
                                            Provided after plan selection
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-6 text-gray-400 text-xs font-medium text-center">
                                Instant transfers within Pakistan
                            </p>
                        </div>
                    </div>

                    {/* Screenshot Upload CTA */}
                    <div className="mt-12 bg-gradient-to-r from-primary to-emerald-600 rounded-[2rem] p-10 md:p-14 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

                        <div className="relative z-10 space-y-6">
                            <FaCloudUploadAlt
                                size={48}
                                className="mx-auto opacity-90"
                            />
                            <h3 className="text-2xl md:text-3xl font-black">
                                Made Your Payment?
                            </h3>
                            <p className="text-white/80 text-lg font-medium max-w-lg mx-auto">
                                Upload a screenshot of your payment receipt
                                through our support channel. Our team will
                                verify it and grant you full access within{" "}
                                <span className="text-white font-bold underline decoration-white/40 underline-offset-4">
                                    12 hours
                                </span>
                                .
                            </p>
                            <Link
                                to="/lead-buddy-support"
                                className="inline-flex items-center gap-3 bg-white text-primary px-10 py-4 rounded-full font-black text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                Upload Screenshot
                                <FaArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust / FAQ-like section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-3xl mx-auto text-center space-y-12">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        Frequently Asked
                    </h2>
                    <div className="space-y-6 text-left">
                        {[
                            {
                                q: "Why can't I pay with a credit card?",
                                a: "Our platform combines data scraping, WhatsApp automation, and outreach tools — capabilities that payment processors like Stripe and PayPal classify as high-risk. Instead of limiting our features to satisfy their policies, we handle payments directly so you get the full experience.",
                            },
                            {
                                q: "How long until I get access?",
                                a: "Once you upload your payment screenshot via our support channel, our team verifies it manually. You'll receive full access to the platform within 12 hours.",
                            },
                            {
                                q: "Is my payment secure?",
                                a: "Absolutely. You're transferring directly to a verified bank account or mobile wallet. There are no middlemen, no stored card details, and no recurring charges — ever.",
                            },
                            {
                                q: "What if I need a refund?",
                                a: "We offer a no-questions-asked refund within 7 days of activation. Just reach out via our support channel and we'll process it immediately.",
                            },
                        ].map((faq, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    {faq.q}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {faq.a}
                                </p>
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
