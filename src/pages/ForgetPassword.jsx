import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/URL";
import Notification from "../component/common/Notification";
import OtpVerification from "../component/common/OtpVerification";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setErrors({ email: "Email is required" });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: "Email is invalid" });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(`${BASE_URL}/api/otp/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, registration: false }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ message: "OTP sent to your email!", type: "success" });
                setStep(2);
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

    // Step 2: Verify OTP
    const handleVerifyOtp = async (otp) => {
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/otp/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ message: "OTP verified successfully!", type: "success" });
                setStep(3);
            } else {
                setNotification({ message: data.message || "Invalid OTP", type: "error" });
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setNotification({ message: "An error occurred. Please try again.", type: "error" });
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
                body: JSON.stringify({ email, registration: false }),
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

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!newPassword) {
            newErrors.newPassword = "Password is required";
        } else if (newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters";
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ message: "Password reset successfully!", type: "success" });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setNotification({ message: data.message || "Failed to reset password", type: "error" });
            }
        } catch (error) {
            console.error("Error resetting password:", error);
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
                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`w-12 h-1 transition-all ${step > s ? "bg-purple-600" : "bg-gray-200"
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step 1: Enter Email */}
                {step === 1 && (
                    <div>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
                            <p className="text-gray-600 text-sm">
                                Enter your email to receive a verification code
                            </p>
                        </div>

                        <form onSubmit={handleRequestOtp} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors({});
                                    }}
                                    placeholder="Enter your email"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>

                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <Link to="/login" className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                                ← Back to Login
                            </Link>
                        </div>
                    </div>
                )}

                {/* Step 2: Verify OTP */}
                {step === 2 && (
                    <div>
                        <OtpVerification
                            email={email}
                            onVerify={handleVerifyOtp}
                            onResend={handleResendOtp}
                            loading={loading}
                        />

                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setStep(1)}
                                className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                            >
                                ← Change Email
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Set New Password */}
                {step === 3 && (
                    <div>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Set New Password</h1>
                            <p className="text-gray-600 text-sm">Create a strong password for your account</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setErrors({});
                                        }}
                                        placeholder="Enter new password"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.newPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setErrors({});
                                        }}
                                        placeholder="Confirm new password"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;