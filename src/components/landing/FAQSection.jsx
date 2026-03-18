import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`border rounded-2xl mb-4 bg-white transition-all duration-500 ${isOpen ? 'border-[#0F792C]/30 shadow-lg scale-[1.01]' : 'border-gray-100 shadow-sm'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left group gap-4"
            >
                <span className={`text-xl md:text-2xl font-black transition-colors duration-300 ${isOpen ? 'text-[#0F792C]' : 'text-gray-900 group-hover:text-[#0F792C]'}`}>
                    {question}
                </span>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-[#0F792C] text-white rotate-180' : 'bg-gray-50 text-[#0F792C]'}`}>
                    <FaChevronDown size={18} />
                </div>
            </button>
            <div 
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-6 md:p-8 pt-0 text-gray-600 text-lg font-medium leading-relaxed border-t border-gray-50/50">
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
        <section className="py-32 px-4 bg-white relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center space-y-4 mb-20 animate-slideUp">
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Everything you need to know about Map Harvest and how it can help your business grow.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;