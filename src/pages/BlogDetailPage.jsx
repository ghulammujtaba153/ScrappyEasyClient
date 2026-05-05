import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import FooterSection from '../components/landing/FooterSection';
import { BASE_URL } from "../config/URL";
import axios from 'axios';
import { FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa';

const BlogDetailPage = () => {
    const { id: slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentBlogs, setRecentBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setLoading(true);
                // Fetch the specific blog by slug
                const res = await axios.get(`${BASE_URL}/api/blog/s/${slug}`);
                setBlog(res.data.data);
                
                // Update Page Title and Meta Description for SEO
                if (res.data.data) {
                    document.title = `${res.data.data.title} | MapHarvest Insights`;
                    
                    // Update meta description
                    let metaDescription = document.querySelector('meta[name="description"]');
                    if (!metaDescription) {
                        metaDescription = document.createElement('meta');
                        metaDescription.name = "description";
                        document.head.appendChild(metaDescription);
                    }
                    metaDescription.content = res.data.data.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + "...";
                }

                // Fetch recent blogs for the sidebar
                const recentRes = await axios.get(`${BASE_URL}/api/blog?page=1&limit=5`);
                setRecentBlogs(recentRes.data.data.filter(b => b.slug !== slug));
            } catch (error) {
                console.error("Error fetching blog detail:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
        
        // Cleanup title on unmount
        return () => {
            document.title = "MapHarvest - Scrape & Connect";
        };
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
                <FooterSection />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col text-center py-20">
                <Navbar />
                <h1 className="text-3xl font-bold text-gray-800">Blog not found</h1>
                <Link to="/blogs" className="mt-4 text-primary font-bold">Back to Blogs</Link>
                <FooterSection />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Content */}
                <article className="lg:col-span-2">
                    <Link to="/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 font-medium transition-colors">
                        <FaArrowLeft size={14} /> Back to Insights
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm font-medium">
                            <span className="flex items-center gap-2">
                                <FaCalendarAlt className="text-primary" /> 
                                {new Date(blog.createdAt || blog.date).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaUser className="text-primary" /> MapHarvest Team
                            </span>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                Business Strategy
                            </span>
                        </div>
                    </div>

                    {/* Blog Body */}
                    <div className="prose prose-lg md:prose-xl max-w-none prose-primary prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary prose-img:rounded-3xl shadow-sm rounded-3xl p-4 md:p-8 border border-gray-50 bg-white">
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>

                    {/* Social Share / Bottom Section */}
                    <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Ready to start calling?</h3>
                            <p className="text-gray-500 mt-1">Connect your Twilio account and start global outreach today.</p>
                        </div>
                        <Link 
                            to="/register" 
                            className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="space-y-10">
                    {/* Recent Posts */}
                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">Recent Insights</h3>
                        <div className="space-y-6">
                            {recentBlogs.map(rb => (
                                <Link key={rb._id} to={`/blog/${rb.slug}`} className="block group">
                                    <h4 className="font-bold text-gray-700 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                        {rb.title}
                                    </h4>
                                    <span className="text-xs text-gray-400 mt-2 block">
                                        {new Date(rb.createdAt || rb.date).toLocaleDateString()}
                                    </span>
                                </Link>
                            ))}
                        </div>
                        
                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                                    <p className="text-sm opacity-90 mb-4 text-white/90">Our team can help you set up your international calling office.</p>
                                    <Link to="/lead-buddy-support" className="text-sm font-bold underline">Contact Support</Link>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <FooterSection />
        </div>
    );
};

export default BlogDetailPage;
