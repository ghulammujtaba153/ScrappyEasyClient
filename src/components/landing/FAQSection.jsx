import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`border border-gray-100 rounded-2xl mb-4 bg-white shadow-sm overflow-hidden transition-all duration-500 ${isOpen ? 'ring-2 ring-primary/10 scale-[1.01] shadow-xl' : 'hover:border-primary/20'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 md:p-4 flex items-center justify-between text-left group"
            >
                <span className={`text-lg font-black font-semibold text-gray-900 group-hover:text-primary transition-colors pr-8 ${isOpen ? 'text-primary' : ''}`}>
                    {question}
                </span>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-50 text-primary'}`}>
                    <FaChevronDown size={14} />
                </div>
            </button>
            <div 
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-2 md:p-4 pt-0 text-gray-600 text-base font-normal leading-relaxed border-t border-gray-50 animate-slideUpSmall">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const faqs = [
        {
            question: "Is Map Harvest affiliated with Google or WhatsApp?",
            answer: "Map Harvest is an independent software tool designed to help businesses collect publicly available information. It is not affiliated with, endorsed by, or connected to Google, Google Maps, or WhatsApp. We collect names, phone numbers, websites, ratings, and other available information to help you grow your business."
        },
        {
            question: "Do you read my WhatsApp messages?",
            answer: "No, we never read or store your personal WhatsApp messages. Map Harvest only verifies if a phone number is associated with a WhatsApp account and provides tools for outreach. Your privacy and security are our top priorities."
        },
        {
            question: "How does the lead extraction process work?",
            answer: "Our tool automates the manual effort of searching and copying data. It visits public search results on Google Maps or Yellow Pages and structures the information into an easy-to-use table format, which you can then export to your CRM or excel files."
        },
        {
            question: "Can I use Map Harvest for team collaboration?",
            answer: "Yes! Map Harvest allows you to invite coordinators and team members. You can share access to your CRM, track outreach progress, and manage leads collectively as a team."
        },
        {
            question: "What outreach tools are included?",
            answer: "Map Harvest comes with built-in tools for bulk messaging via WhatsApp and cold calling directly from your dashboard. It streamlines the entire pipeline from finding a lead to closing the deal."
        },
        {
            question: "Is there a limit to how many leads I can store?",
            answer: "Our lifetime plans include unlimited lead storage in the built-in CRM. You don't have to worry about monthly subscription fees for storing your contact lists."
        }
    ];

    return (
        <section className="py-32 px-4 bg-gray-50/30" id="faq">
            <div className="max-w-4xl mx-auto">
                <div className="text-center space-y-4 mb-20 animate-slideUp">
                    <h2 className="text-3xl md:text-6xl font-black font-semibold text-gray-900 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-normal">
                        Our lead generation tools are both powerful and user-friendly. They are created to streamline common workflows through automation.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="animate-slideUp" style={{ animationDelay: `${index * 100}ms` }}>
                            <FAQItem {...faq} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;