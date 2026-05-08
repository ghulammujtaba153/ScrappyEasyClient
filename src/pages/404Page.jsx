import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaSignInAlt } from "react-icons/fa";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-5 bg-[#f8fafc] overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[8%] left-[5%] w-[40%] h-[40%] bg-[#0F792C]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="text-center relative z-10 max-w-2xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-6"
                >
                    <div className="relative inline-block">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <svg
                                className="mx-auto h-40 w-40 text-[#0F792C]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </motion.div>
                        {/* Glow effect behind the icon */}
                        <div className="absolute inset-0 bg-[#0F792C]/20 blur-3xl -z-10 rounded-full scale-150" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 
                        className="text-[12rem] font-black text-slate-900 leading-none tracking-tighter"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        404
                    </h1>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                        Lost in the Harvest?
                    </h2>
                    <p className="text-xl text-slate-500 mb-12 max-w-lg mx-auto leading-relaxed">
                        The page you are looking for has been moved, deleted, or never existed in the first place. 
                        Let's get you back to familiar ground.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                >
                    <Link
                        to="/dashboard"
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0F792C] hover:bg-[#0d6625] text-white px-10 py-5 rounded-full font-bold text-xl shadow-[0_20px_40px_-15px_rgba(15,121,44,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(15,121,44,0.5)] transition-all hover:-translate-y-1 active:translate-y-0"
                    >
                        <FaHome size={22} />
                        Return Home
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 px-10 py-5 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0"
                    >
                        <FaSignInAlt size={22} />
                        Sign In
                    </Link>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-20"
                >
                    <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-[10px]">
                        Error Reference: 404_PAGE_NOT_FOUND
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
