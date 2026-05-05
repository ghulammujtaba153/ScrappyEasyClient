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
                <div className="flex-1 min-h-screen flex items-center justify-center">
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

            <div className="flex-1 max-w-7xl mx-auto mt-20 px-4 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Content */}
                <article className="lg:col-span-2">
                    {/* <Link to="/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 font-medium transition-colors">
                        <FaArrowLeft size={14} /> Back to Insights
                    </Link> */}

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
                
            </div>

            <FooterSection />
        </div>
    );
};

export default BlogDetailPage;
