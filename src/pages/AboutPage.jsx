import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaArrowRight,
    FaHeart,
    FaMapMarkerAlt,
    FaWhatsapp,
    FaEnvelope,
    FaPhoneAlt,
    FaUsers,
    FaGlobe,
    FaLightbulb,
    FaRocket,
    FaLinkedinIn,
} from "react-icons/fa";
import Navbar from "../components/landing/Navbar";
import FooterSection from "../components/landing/FooterSection";

const storySteps = [
    {
        icon: FaLightbulb,
        title: "It Started With Frustration",
        text: "For five years, I worked as a business developer — hustling across every niche you can imagine. Websites, SEO, ads, mobile apps, web apps, outsourcing, media buying, graphic design, animations. You name it, I sold it. I used platforms like Fiverr and Upwork, and while they were helpful, I always felt like I was playing someone else's game. I was dependent on algorithms, racing to the bottom on pricing, and had zero control over my pipeline.",
    },
    {
        icon: FaMapMarkerAlt,
        title: "The Idea That Wouldn't Go Away",
        text: "What I really wanted was simple: a place where I could pull leads straight from Google Maps, manage them in my own CRM, qualify them based on reviews and website quality, and reach out through WhatsApp, email, or a cold call — all from one screen. I didn't want five different subscriptions. I wanted one system that did everything. And it didn't exist. So I started building it.",
    },
    {
        icon: FaWhatsapp,
        title: "Building the Outreach Engine",
        text: "I built the messaging tools I wished I had. Send WhatsApp messages, extract emails, test different pitches side by side to see which ones actually get replies. I wanted to understand the psychology of outreach — what makes someone respond, what makes them ignore you, what makes them say yes. So I built a system where you can A/B test your messages, track what works, and double down on winners.",
    },
    {
        icon: FaPhoneAlt,
        title: "Cold Calling From Pakistan? Nobody Taught Me How.",
        text: "Here in Pakistan, there was no playbook for cold calling international clients. No courses, no mentors, no guides. So I figured it out myself and baked it into the platform. Now anyone in Pakistan or South Asia can pick up the phone and call a business anywhere in the world — directly from Map Harvest. No extra tools, no complicated setup.",
    },
    {
        icon: FaUsers,
        title: "Because Working Alone Gets Lonely",
        text: "Let's be honest — freelancing can be isolating. You're grinding alone, day after day. That's why I built collaboration right into the core. See who's online, send a friend request, hop on a Google Meet call, and talk shop. Learn what they're selling, share ideas, swap strategies. It's not just a tool — it's a community of people who are all trying to win.",
    },
    {
        icon: FaRocket,
        title: "And If You Have a Team? Even Better.",
        text: "Whether you're a solo freelancer with a virtual assistant or an agency with a full sales floor, you can add your people, assign leads, track activity, and collaborate on deals. I built the team management I needed when I started scaling — so you don't have to duct-tape together Slack, spreadsheets, and Trello like I did.",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const AboutPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden bg-[#BBF7D0] pt-36 pb-28 md:pt-44 md:pb-36 px-4">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/50 shadow-sm"
                    >
                        <FaHeart size={12} className="text-red-400" />
                        <span className="text-sm font-bold text-primary uppercase tracking-wide">Our Story</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-3xl md:text-6xl font-black font-bold leading-[1.1] tracking-tight text-gray-900"
                    >
                        I Built the Tool <br className="hidden md:block" />
                        I Wished I Had.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal opacity-90"
                    >
                        After 5 years of freelancing, selling every service under the sun, and duct-taping together 10 different tools — I decided to build the one platform that does it all.
                    </motion.p>
                </div>
            </section>

            {/* The Vision — story blocks */}
            <section className="py-20 md:py-28 px-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeUp}
                        className="text-center mb-20"
                    >
                        <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">The Journey</p>
                        <h2 className="text-3xl md:text-5xl font-black font-semibold text-gray-900 tracking-tight leading-tight">
                            From Freelancer Frustration <br className="hidden md:block" /> to a Full Platform
                        </h2>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-green-200"></div>

                        <div className="space-y-12 md:space-y-16">
                            {storySteps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative flex gap-6 md:gap-8"
                                >
                                    {/* Timeline dot */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                                        className="relative z-10 w-12 h-12 md:w-16 md:h-16 bg-[#DCFCE7] rounded-2xl flex items-center justify-center text-primary flex-shrink-0 shadow-sm"
                                    >
                                        <step.icon size={22} />
                                    </motion.div>

                                    {/* Content */}
                                    <div className="flex-1 pb-2">
                                        <h3 className="text-xl md:text-2xl font-black font-semibold text-gray-900 leading-tight mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-500 font-medium text-base leading-relaxed">
                                            {step.text}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* The Result — what it became */}
            <section className="py-20 md:py-28 px-4 bg-[#DCFCE7]/30">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeUp}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-black font-semibold text-gray-900 tracking-tight leading-tight">
                            What Map Harvest Became
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                            A one-stop platform for every freelancer, every agency, every business developer in Pakistan, South Asia, and beyond. Scrape leads from Google Maps. Manage them in your CRM. Qualify, reach out, cold call, message, collaborate, and close — all from a single dashboard. No more juggling tools. No more paying for five subscriptions. Just one platform that actually works the way you do.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Meet the Founder */}
            <section className="py-20 md:py-28 px-4 bg-white ">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeUp}
                        className="text-center mb-16"
                    >
                        <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">The Person Behind It</p>
                        <h2 className="text-3xl md:text-5xl font-black font-semibold text-gray-900 tracking-tight">
                            Meet the Founder
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="bg-[#DCFCE7]/40 rounded-[2.5rem] p-10 md:p-16 border border-green-100/60"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
                            {/* Photo placeholder */}
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0 shadow-lg overflow-hidden"
                            >
                                <img
                                    src="/ibraheem.png"
                                    alt="Ibraheem — Founder of Map Harvest"
                                    className="w-full h-full object-cover object-top"
                                />
                            </motion.div>

                            {/* Bio */}
                            <div className="flex-1 space-y-5 text-center md:text-left">
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-black font-semibold text-gray-900">
                                        Ibraheem
                                    </h3>
                                    <p className="text-primary font-bold text-base mt-1">
                                        Founder & Builder
                                    </p>
                                </div>

                                <p className="text-gray-500 font-medium text-base leading-relaxed text-justify">
                                    Business development guy with a Software Engineering degree who's spent the last 5 years in the trenches — selling websites, running ads, building apps, designing brands, and closing deals with international clients across dozens of projects. I didn't build Map Harvest from a boardroom. I built it from the same desk where I was cold calling, scraping leads, and trying to figure out how to make freelancing actually sustainable. This tool is everything I needed and couldn't find anywhere else.
                                </p>

                                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                    >
                                        <FaLinkedinIn size={16} />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                    >
                                        <FaGlobe size={16} />
                                    </a>
                                </div>
                            </div>

                            

                        </div>

                        
                    </motion.div>
                </div>
            </section>

            <section className="pb-20 md:pb-28 px-4 bg-white ">
                <div className="max-w-4xl mx-auto">
                    

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="bg-[#DCFCE7]/40 rounded-[2.5rem] p-10 md:p-16 border border-green-100/60"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0 shadow-lg overflow-hidden"
                            >
                                <img
                                    src="/moazam.jpeg"
                                    alt="Moazzam — Partner of Map Harvest"
                                    className="w-full h-full object-cover object-top"
                                />
                            </motion.div>

                            <div className="flex-1 space-y-5 text-center md:text-left">
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-black font-semibold text-gray-900">
                                        Moazzam
                                    </h3>
                                    <p className="text-primary font-bold text-base mt-1">
                                        Partner
                                    </p>
                                </div>

                                <p className="text-gray-500 font-medium text-base leading-relaxed text-justify">
                                    Over the years, I worked with clients from around the world through different freelance platforms, delivering projects and building long term relationships. But after facing multiple account suspensions, I realized how difficult it was to rely entirely on third party platforms. That's when I teamed up with Ibraheem. Having experienced the same challenges firsthand, we decided to build something of our own. Together, we created Map Harvest — a software designed to give freelancers, agencies, and business owners a more sustainable way to find opportunities and grow without depending on platforms they don't control.
                                </p>

                                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                                    <a
                                        href="https://www.linkedin.com/in/moazzam-ali-b34053242/"
                                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                    >
                                        <FaLinkedinIn size={16} />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                                    >
                                        <FaGlobe size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 md:py-32 px-4 bg-[#BBF7D0] relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-3xl mx-auto text-center relative z-10 space-y-8"
                >
                    <h2 className="text-3xl md:text-6xl font-black font-bold text-gray-900 leading-[1.1] tracking-tight">
                        Ready to stop hustling <br className="hidden md:block" />
                        and start building?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto font-normal leading-relaxed opacity-90">
                        Join thousands of freelancers and agencies who are already using Map Harvest to find, reach, and close clients every day.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <Link
                            to="/pricing"
                            className="flex items-center justify-center bg-primary hover:bg-[#0d6625] text-white px-10 py-3 font-semibold rounded-full font-black text-lg shadow-[0_20px_40px_-15px_rgba(15,121,44,0.4)] transition-all hover:-translate-y-1"
                        >
                            See Pricing <FaArrowRight className="ml-2" size={14} />
                        </Link>
                        <Link
                            to="/who-wins"
                            className="flex items-center justify-center bg-white hover:bg-gray-50 text-primary border-2 font-semibold border-primary/20 px-10 py-3 rounded-full font-black text-lg shadow-xl transition-all hover:-translate-y-1"
                        >
                            Who Wins With This
                        </Link>
                    </div>
                </motion.div>
            </section>

            <FooterSection />
        </div>
    );
};

export default AboutPage;
