import React from "react";

const FooterBadge = () => {
    return (
        <section className="py-24 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="bg-[#BBF7D0] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
                    {/* Decorative Rings Background */}
                    <div className="absolute inset-0 z-0">
                        {[1, 2, 3, 4, 5, 6].map((ring) => (
                            <div
                                key={ring}
                                className="absolute border border-[#0F792C]/10 rounded-full"
                                style={{
                                    width: `${ring * 250}px`,
                                    height: `${ring * 250}px`,
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 space-y-8 animate-slideUp">
                        <h2 className="text-3xl md:text-6xl font-semibold lg:text-7xl font-black text-gray-900 leading-tight">
                            Start building your <br className="hidden md:block" /> lead list today.
                        </h2>
                        
                        <p className="text-md font-semibold text-black font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
                            Scrape leads, verify numbers, and send messages automatically <br className="hidden md:block" /> all in one smooth workflow.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                            <button className="bg-white hover:bg-gray-50 text-gray-900 px-10 py-4 rounded-full font-black font-semibold text-lg shadow-xl hover:scale-105 transition-all w-full sm:w-auto">
                                Install Extension
                            </button>
                            <button className="bg-white hover:bg-gray-50 text-gray-900 px-10 py-4 rounded-full font-black font-semibold text-lg shadow-xl hover:scale-105 transition-all w-full sm:w-auto">
                                Get Lifetime Access
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FooterBadge;