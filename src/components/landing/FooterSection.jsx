import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTelegramPlane, FaArrowRight } from "react-icons/fa";
import { products } from "./Navbar";

const FooterSection = () => {
    return (
        <footer className="bg-white pt-24 pb-12 px-4 border-t border-gray-100">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-20 animate-slideUp">
                    
                    {/* Brand Section */}
                    <div className="sm:col-span-2 lg:col-span-1 space-y-8">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="" className="h-10" />
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed max-w-xs text-sm">
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
                        <h4 className="font-black text-lg font-semibold text-gray-900">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Home", path: "/landing" },
                                { label: "Our Story", path: "/about" },
                                { label: "Who Wins With This", path: "/who-wins" },
                                { label: "Pricing", path: "/pricing" },
                                { label: "Privacy Policy", path: "/lead-buddy-privacy" },
                                { label: "Contact", path: "/lead-buddy-support" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link 
                                        to={link.path} 
                                        className="text-gray-500 hover:text-[#0F792C] font-bold text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Features — first column (1-5) */}
                    <div className="space-y-6">
                        <h4 className="font-black text-lg font-semibold text-gray-900">Features</h4>
                        <ul className="space-y-3">
                            {products.slice(0, 5).map((p, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-md ${p.bg} flex items-center justify-center shrink-0`}>
                                        <p.icon className={p.color} size={13} />
                                    </div>
                                    <span className="text-gray-500 font-bold text-sm hover:text-[#0F792C] transition-colors cursor-default">
                                        {p.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Features — second column (6-10) */}
                    <div className="space-y-6">
                        <h4 className="font-black text-lg font-semibold text-gray-900 lg:invisible">More</h4>
                        <ul className="space-y-3">
                            {products.slice(5).map((p, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-md ${p.bg} flex items-center justify-center shrink-0`}>
                                        <p.icon className={p.color} size={13} />
                                    </div>
                                    <span className="text-gray-500 font-bold text-sm hover:text-[#0F792C] transition-colors cursor-default">
                                        {p.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="sm:col-span-2 lg:col-span-1 space-y-6">
                        <h4 className="font-black text-lg font-semibold text-gray-900">Newsletter</h4>
                        <p className="text-gray-500 font-medium leading-relaxed text-sm">
                            Get tips, product updates, and insights on working smarter with AI.
                        </p>
                        <div className="relative group">
                            <input 
                                type="email" 
                                placeholder="Email address"
                                className="w-full bg-gray-50 border border-gray-100 rounded-full py-3.5 px-5 outline-none focus:ring-2 focus:ring-[#0F792C]/20 focus:border-[#0F792C] transition-all font-medium text-sm pr-28"
                            />
                            <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#0F792C] hover:bg-[#0A5D21] text-white px-5 rounded-full font-black font-semibold text-xs flex items-center gap-1.5 transition-all group-hover:shadow-lg">
                                Subscribe <FaArrowRight size={10} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 font-bold text-sm">
                        <span className="text-[#0F792C]">© 2025 Map Harvest.</span> All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/lead-buddy-privacy" className="text-gray-400 hover:text-[#0F792C] text-xs font-bold transition-colors">Privacy</Link>
                        <Link to="/lead-buddy-support" className="text-gray-400 hover:text-[#0F792C] text-xs font-bold transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;