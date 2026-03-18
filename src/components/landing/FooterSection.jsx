import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTelegramPlane, FaArrowRight } from "react-icons/fa";

const FooterSection = () => {
    return (
        <footer className="bg-white pt-24 pb-12 px-4 border-t border-gray-100">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 animate-slideUp">
                    
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="" />
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed max-w-xs">
                            Map Harvest is a powerful data scraping and outreach tool designed for marketers, agencies, and business owners.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: FaFacebookF, link: "#" },
                                { icon: FaLinkedinIn, link: "#" },
                                { icon: FaInstagram, link: "#" },
                                { icon: FaTelegramPlane, link: "#" }
                            ].map((social, i) => (
                                <a 
                                    key={i} 
                                    href={social.link}
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#0F792C] hover:text-white transition-all transform hover:scale-110"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-6">
                        <h4 className="font-black text-xl text-gray-900">Company</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "Home", path: "/landing" },
                                { label: "About us", path: "#" },
                                { label: "Pricing", path: "#" },
                                { label: "Blog", path: "#" },
                                { label: "Blog Details", path: "#" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link 
                                        to={link.path} 
                                        className="text-gray-500 hover:text-[#0F792C] font-bold transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-6">
                        <h4 className="font-black text-xl text-gray-900">Product</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "Features", path: "#" },
                                { label: "Careers", path: "#" },
                                { label: "Contact", path: "/lead-buddy-support" },
                                { label: "404", path: "/404" },
                                { label: "Privacy Policy", path: "/lead-buddy-privacy" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link 
                                        to={link.path} 
                                        className="text-gray-500 hover:text-[#0F792C] font-bold transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h4 className="font-black text-xl text-gray-900">Newsletter</h4>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Get tips, product updates, and insights on working smarter with AI.
                        </p>
                        <div className="relative group">
                            <input 
                                type="email" 
                                placeholder="Email address"
                                className="w-full bg-gray-50 border border-gray-100 rounded-full py-4 px-6 outline-none focus:ring-2 focus:ring-[#0F792C]/20 focus:border-[#0F792C] transition-all font-medium pr-32"
                            />
                            <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#0F792C] hover:bg-[#0A5D21] text-white px-6 rounded-full font-black text-sm flex items-center gap-2 transition-all group-hover:shadow-lg">
                                Subscribe <FaArrowRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 font-bold">
                        <span className="text-[#0F792C]">© 2025 Map Harvest.</span> All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;