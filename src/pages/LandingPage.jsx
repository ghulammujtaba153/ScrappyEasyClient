import React from "react";
import HeroSection from "../components/landing/HeroSection";
import HowWorkSection from "../components/landing/HowWorkSection";
import KeyBenefitsSection from "../components/landing/KeyBenefitsSection";
import FeatureSection from "../components/landing/FeatureSection";
import FAQSection from "../components/landing/FAQSection";
import FooterBadge from "../components/landing/FooterBadge";
import FooterSection from "../components/landing/FooterSection";
import Navbar from "../components/landing/Navbar";
import PricingSection from "../components/landing/PricingSection";

const LandingPage = () => {
    return (
        <div className="bg-white">
            <Navbar />
            
            <div id="hero">
                <HeroSection />
            </div>

            <div id="how-it-works">
                <HowWorkSection />
            </div>

            <div id="benefits">
                <KeyBenefitsSection />
            </div>

            <div id="features">
                <FeatureSection />
            </div>

            <div id="pricing">
                <PricingSection />
            </div>

            <div id="faq">
                <FAQSection />
            </div>

            <div>
                <FooterBadge />
            </div>

            <div>
                <FooterSection />
            </div>
        </div>
    );
};

export default LandingPage;