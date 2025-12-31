import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/URL";
import { useAuth } from "../context/authContext";
import Notification from "../components/common/Notification";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                // Use auth context to login
                login(data.user, data.token);
                setNotification({ message: data.message || "Login successful!", type: "success" });

                // Check if login came from Chrome extension
                const urlParams = new URLSearchParams(window.location.search);
                const fromExtension = urlParams.get('extension') === 'true';

                if (fromExtension) {
                    // Send auth data directly to Chrome extension via postMessage
                    window.postMessage(
                        {
                            type: "EXTENSION_AUTH",
                            token: data.token,
                            user: data.user
                        },
                        "*"
                    );

                    // Show message and close tab after delay
                    setNotification({ message: "✅ Authentication successful! You can close this tab.", type: "success" });

                    // Try to close the tab (will only work if opened by extension)
                    setTimeout(() => {
                        window.close();
                        // If window.close() didn't work, navigate to dashboard
                        setTimeout(() => navigate("/dashboard"), 500);
                    }, 2000);
                } else {
                    setTimeout(() => navigate("/dashboard"), 1000);
                }
            } else {
                setNotification({ message: data.message || "Login failed", type: "error" });
            }
        } catch (error) {
            console.error("Login error:", error);
            setNotification({ message: "An error occurred during login", type: "error" });
        } finally {
            setLoading(false);
        }
    };

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
                    <img src="/logo.png" alt="" className="mb-7 mx-auto w-[200px] object-contain" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600 text-sm">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.password ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">Remember me</span>
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
