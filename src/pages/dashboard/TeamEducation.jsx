import React from 'react';
import { motion } from 'framer-motion';
import { MdSchool } from 'react-icons/md';

const TeamEducation = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-10">
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-[#0F792C]">
                        <MdSchool size={24} />
                    </div>
                    Mastering Map Harvest
                </h2>
                <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
                    Unlock the full potential of your workspace. These detailed guides walk you through data extraction, WhatsApp verification, and professional outreach strategies.
                </p>
            </div>

            <div className="video-grid">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col gap-6"
                >
                    <div className="video-glow-wrapper">
                        <div className="video-glow-inner">
                            <div style={{ position: "relative", paddingBottom: "65.01809408926417%", height: 0 }}>
                                <iframe
                                    src="https://www.loom.com/embed/d04652b8c80845e897a20fc390ac8fcd"
                                    frameBorder="0"
                                    webkitallowfullscreen="true"
                                    mozallowfullscreen="true"
                                    allowFullScreen
                                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                                    title="Education Video 1"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-[0.12em] leading-relaxed text-center px-2">
                        MAP HARVEST VID 1 - DATA EXTRACTION, WHATSAPP VERIFICATION, EMAIL, SOCIALS, GROWING LIST FOR OUTREACH AND MORE!
                    </h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col gap-6"
                >
                    <div className="video-glow-wrapper">
                        <div className="video-glow-inner">
                            <div style={{ position: "relative", paddingBottom: "65.01809408926417%", height: 0 }}>
                                <iframe
                                    src="https://www.loom.com/embed/aa527e4975c548d48c5ba2a8334f01da"
                                    frameBorder="0"
                                    webkitallowfullscreen="true"
                                    mozallowfullscreen="true"
                                    allowFullScreen
                                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                                    title="Education Video 2"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-[0.12em] leading-relaxed text-center px-2">
                        MAP HARVEST VID 2-HOW I QUALIFY LEADS, COLD CALL, EMAIL AND COLLABORATE
                    </h3>
                </motion.div>
            </div>
        </div>
    );
};

export default TeamEducation;
