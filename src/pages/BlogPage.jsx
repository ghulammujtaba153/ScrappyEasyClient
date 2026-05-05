import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import FooterSection from '../components/landing/FooterSection';
import { BASE_URL } from "../config/URL";
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchBlogs = async (pageNum) => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/blog?page=${pageNum}&limit=12`);
            setBlogs(res.data.data);
            setTotalPages(res.data.pagination.totalPages);
            setPage(res.data.pagination.page);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(page);
    }, [page]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-primary text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">International Business Insights</h1>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">Master global outreach and lead generation with our comprehensive guides.</p>
            </div>

            {/* Blog List Section */}
            <div className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <Link 
                                    to={`/blog/${blog.slug}`} 
                                    key={blog._id} 
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col"
                                >
                                    <div className="p-8 flex-1">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">Business Guide</span>
                                            <span className="text-gray-400 text-xs font-medium">
                                                {new Date(blog.createdAt || blog.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-3 leading-tight mb-4">
                                            {blog.title}
                                        </h2>
                                        <p className="text-gray-500 line-clamp-3 text-sm leading-relaxed">
                                            {/* Strip HTML tags for preview */}
                                            {blog.content.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    </div>
                                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-primary/5">
                                        <span className="text-primary font-bold text-sm">Read Article</span>
                                        <span className="text-primary transform group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
                                >
                                    ← Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-12 h-12 rounded-xl font-bold transition-all ${
                                                    page === p 
                                                    ? 'bg-primary text-white shadow-lg' 
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    } else if (p === page - 2 || p === page + 2) {
                                        return <span key={p} className="text-gray-400">...</span>;
                                    }
                                    return null;
                                })}
                                <button
                                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <FooterSection />
        </div>
    );
};

export default BlogPage;
