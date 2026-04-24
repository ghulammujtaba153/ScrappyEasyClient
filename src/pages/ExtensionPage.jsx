import React from 'react';
import Navbar from '../components/landing/Navbar';
import FooterSection from '../components/landing/FooterSection';
import { FaChrome, FaCheckCircle, FaExclamationTriangle, FaDownload, FaStar } from 'react-icons/fa';

const ExtensionPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            {/* Main Content Area */}
            <div className="flex-grow pt-32 pb-20 px-6 sm:px-12">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="text-center mb-16 animate-fadeIn">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-[#0F792C] rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-sm border border-green-200">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0F792C]"></span>
                            </span>
                            Extension Status: Live
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                            Map Harvest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F792C] to-green-500">Extension</span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Supercharge your lead generation directly from your browser. 
                            <span className="block mt-2 font-semibold text-gray-800">And yes, you can scrape data for free!</span>
                        </p>
                    </div>

                    {/* Important Notice Banner */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl mb-12 shadow-sm flex items-start gap-4">
                        <FaExclamationTriangle className="text-amber-500 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="font-bold text-amber-900 text-lg mb-1">Important Notice</h3>
                            <p className="text-amber-800 leading-relaxed">
                                Our extension is currently <strong className="font-black">LIVE</strong> on the Chrome Web Store! However, due to strict store policies, we don't know exactly how long it will remain available. 
                                <br/><br/>
                                <strong className="text-amber-900">Bookmark this page.</strong> If the extension ever gets removed or goes down, this page will be updated immediately with manual installation instructions and the latest download files.
                            </p>
                        </div>
                    </div>

                    {/* Download Card */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100 text-center relative overflow-hidden group">
                        {/* Decorative Background Element */}
                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#0F792C]/5 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
                        
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <FaChrome size={48} className="text-[#0F792C]" />
                            </div>
                            
                            <h2 className="text-3xl font-black text-gray-900 mb-4">Available on Chrome Web Store</h2>
                            
                            <div className="flex items-center justify-center gap-1 mb-8 text-amber-400">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                <span className="text-gray-500 text-sm font-medium ml-2">(Trusted by professionals)</span>
                            </div>

                            <a
                                href="https://chromewebstore.google.com/detail/lead-buddy-business-conta/lkacglodcmpgjejflajjdcglneamnnim?hl=en-US&utm_source=ext_sidebar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-[#0F792C] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_15px_30px_rgba(15,121,44,0.3)] hover:shadow-[0_20px_40px_rgba(15,121,44,0.4)] hover:-translate-y-1 transition-all"
                            >
                                <FaDownload /> Install Extension Now
                            </a>
                            
                            <p className="mt-6 text-sm text-gray-500 font-medium">
                                Direct Link: <a href="https://chromewebstore.google.com/detail/lead-buddy-business-conta/lkacglodcmpgjejflajjdcglneamnnim" target="_blank" rel="noopener noreferrer" className="text-[#0F792C] hover:underline">chromewebstore.google.com</a>
                            </p>
                        </div>
                    </div>

                    {/* Features/Free Tier Section */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                                <FaCheckCircle className="text-[#0F792C]" size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">100% Free Scrapes</h4>
                            <p className="text-gray-500 text-sm">You can start scraping high-quality data immediately without spending a dime.</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                <FaCheckCircle className="text-blue-500" size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Easy 1-Click Install</h4>
                            <p className="text-gray-500 text-sm">Add it to your browser in seconds. No complicated setup or technical knowledge required.</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                                <FaCheckCircle className="text-purple-500" size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Safe & Secure</h4>
                            <p className="text-gray-500 text-sm">Approved by Google Chrome. Your data stays on your machine, ensuring total privacy.</p>
                        </div>
                    </div>

                </div>
            </div>

            <FooterSection />
        </div>
    );
};

export default ExtensionPage;
