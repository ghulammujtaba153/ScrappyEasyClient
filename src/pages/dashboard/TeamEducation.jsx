import React from 'react';
import { motion } from 'framer-motion';
import { MdSchool, MdArrowForward } from 'react-icons/md';

const TeamEducation = () => {
    const educationItems = [
        {
            id: 1,
            title: "Lorem Ipsum Dolor Sit Amet",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            image: "/education/card1.png",
            category: "Strategy",
            date: "May 13, 2026"
        },
        {
            id: 2,
            title: "Consectetur Adipiscing Elit Sed",
            description: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
            image: "/education/card2.png",
            category: "Marketing",
            date: "May 12, 2026"
        },
        {
            id: 3,
            title: "Eiusmod Tempor Incididunt Ut Labore",
            description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.",
            image: "/education/card3.png",
            category: "Operations",
            date: "May 11, 2026"
        }
    ];

    return (
        <div className="space-y-8 p-4 md:p-8 min-h-screen bg-gray-50/30">
            <div className="mb-12">
                <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#0F792C]/10 rounded-2xl flex items-center justify-center text-[#0F792C] shadow-sm shadow-green-100">
                        <MdSchool size={32} />
                    </div>
                    Education Center
                </h2>
                <p className="text-slate-500 mt-4 max-w-2xl text-lg leading-relaxed">
                    Master the tools and strategies that drive business growth. Explore our curated guides on lead generation, outreach automation, and team collaboration.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {educationItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group border border-gray-100 flex flex-col"
                    >
                        {/* Card Image Area */}
                        <div className="relative h-60 overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                <span className="text-white font-bold text-sm flex items-center gap-2">
                                    Start Learning <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                            <div className="absolute top-6 left-6">
                                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#0F792C] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        {/* Card Content Area */}
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0F792C]"></div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {item.date}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#0F792C] transition-colors leading-tight">
                                {item.title}
                            </h3>
                            
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                                {item.description}
                            </p>
                            
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between group/btn">
                                <span className="text-[#0F792C] font-bold text-sm tracking-tight">Access Course Materials</span>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0F792C] group-hover:text-white group-hover:shadow-lg group-hover:shadow-green-200 transition-all duration-300">
                                    <MdArrowForward size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TeamEducation;
