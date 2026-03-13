import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { BASE_URL } from '../config/URL';
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle, FaUser, FaGlobe } from 'react-icons/fa';
import Notification from '../components/common/Notification';
import Loader from '../components/common/Loader';

const InviteConfirmPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        name: '',
        password: '',
        confirmPassword: '',
        country: '',
        aboutUser: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                setValid(false);
                return;
            }

            try {
                const res = await axios.get(`${BASE_URL}/api/auth/verify-invitation/${token}`);
                if (res.data.valid) {
                    setValid(true);
                    setEmail(res.data.email);
                }
            } catch (err) {
                console.error("Verification failed:", err);
                setValid(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (form.password !== form.confirmPassword) {
            message.error("Passwords do not match");
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/auth/confirm-invitation`, {
                token,
                ...form
            });

            if (res.status === 200) {
                setSuccess(true);
                setNotification({ message: res.data.message || "Account activated! Redirecting to login...", type: "success" });
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err) {
            console.error("Confirmation error:", err);
            setNotification({ message: err.response?.data?.message || "Failed to confirm invitation", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    if (!valid) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
                <div className="text-center max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border border-slate-100">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaTimes size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 mb-4">Invalid or Expired Link</h1>
                    <p className="text-slate-500 mb-8 font-medium">This invitation link may have expired or is incorrect. Please contact your team owner for a new invitation.</p>
                    <Link to="/login" className="inline-block bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">Go to Login</Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
                <div className="text-center max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border border-slate-100 animate-slideUp">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheckCircle size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4">Success!</h1>
                    <p className="text-slate-500 font-medium mb-8">Your account has been activated and your password is set. You will be redirected to the login page in a few seconds.</p>
                    <Link to="/login" className="text-primary font-black hover:underline">Click here if you aren't redirected</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-5">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-slideUp">
                <div className="text-center mb-8">
                    <img src="/map.png" alt="" className="mb-7 mx-auto w-[50px] object-contain" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Activate Account</h1>
                    <p className="text-gray-600 text-sm">Setting up account for: <span className="text-primary font-semibold">{email}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all border-gray-300"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Country */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Country
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            required
                            placeholder="e.g. United Kingdom"
                            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all border-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                    >
                        {submitting ? "Activating..." : "Activate Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const FaTimes = ({ size }) => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>;

export default InviteConfirmPage;
