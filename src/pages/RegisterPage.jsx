import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/URL";
import Notification from "../component/common/Notification";
import OtpVerification from "../component/common/OtpVerification";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
    const [form, setForm] = useState({
        name: "",
        phone: "",
        country: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const handlePhoneChange = (value, country) => {
        setForm({ ...form, phone: value, country: country.name });
        if (errors.phone) {
            setErrors({ ...errors, phone: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!form.phone) {
            newErrors.phone = "Phone number is required";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 1: Request OTP
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Request OTP
            const response = await fetch(`${BASE_URL}/api/otp/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, registration: true }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ message: "OTP sent to your email!", type: "success" });
                setStep(2); // Move to OTP verification step
            } else {
                setNotification({ message: data.message || "Failed to send OTP", type: "error" });
            }
        } catch (error) {
            console.error("Error requesting OTP:", error);
            setNotification({ message: "An error occurred. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and Register
    const handleVerifyOtp = async (otp) => {
        setLoading(true);

        try {
            // Verify OTP
            const verifyResponse = await fetch(`${BASE_URL}/api/otp/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, otp }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
                setNotification({ message: verifyData.message || "Invalid OTP", type: "error" });
                setLoading(false);
                return;
            }

            // OTP verified, now register the user
            const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    country: form.country,
                    password: form.password,
                }),
            });

            const registerData = await registerResponse.json();

            if (registerResponse.ok) {
                setNotification({ message: "Registration successful!", type: "success" });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setNotification({ message: registerData.message || "Registration failed", type: "error" });
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setNotification({ message: "An error occurred during registration", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/otp/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, registration: true }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ message: "New OTP sent to your email!", type: "success" });
            } else {
                setNotification({ message: data.message || "Failed to resend OTP", type: "error" });
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            setNotification({ message: "An error occurred. Please try again.", type: "error" });
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
                <img src="/logo.png" alt="" className="mb-7 mx-auto w-[200px] object-contain" />

                {/* Step 1: Registration Form */}
                {step === 1 && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                            <p className="text-gray-600 text-sm">Sign up to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.name ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

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
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <PhoneInput
                                    country={"us"}
                                    value={form.phone}
                                    onChange={handlePhoneChange}
                                    inputClass={errors.phone ? "!border-red-500" : ""}
                                    containerClass="w-full"
                                    inputStyle={{
                                        width: "100%",
                                        height: "48px",
                                        fontSize: "14px",
                                        borderRadius: "8px",
                                        border: errors.phone ? "2px solid #ef4444" : "2px solid #d1d5db",
                                    }}
                                    buttonStyle={{
                                        borderRadius: "8px 0 0 8px",
                                        border: errors.phone ? "2px solid #ef4444" : "2px solid #d1d5db",
                                        borderRight: "none",
                                    }}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.password ? "border-red-500" : "border-gray-300"
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

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                            >
                                {loading ? "Sending OTP..." : "Continue"}
                            </button>
                        </form>

                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <>
                        <OtpVerification
                            email={form.email}
                            onVerify={handleVerifyOtp}
                            onResend={handleResendOtp}
                            loading={loading}
                        />

                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setStep(1)}
                                className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
                            >
                                ← Change Email
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
