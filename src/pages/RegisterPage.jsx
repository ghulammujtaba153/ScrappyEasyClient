import React, { useState, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/URL";
import Notification from "../components/common/Notification";
import OtpVerification from "../components/common/OtpVerification";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";
import countryList from "country-list";
import PlanSelection from "../components/auth/PlanSelection";
import { useAuth } from "../context/authContext";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1); // 1: Form, 2: Plan Selection, 3: OTP Verification
    const [selectedPlan, setSelectedPlan] = useState(null);
    
    // Get country options
    const countryOptions = useMemo(() => {
        const countries = countryList.getData();
        return countries.map(country => ({
            value: country.name,
            label: country.name
        }));
    }, []);
    const [form, setForm] = useState({
        name: "",
        email: "",
        country: "",
        aboutUser: "",
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

    // Phone removed

    const handleCountryChange = (selectedOption) => {
        setForm({ ...form, country: selectedOption ? selectedOption.value : "" });
        if (errors.country) {
            setErrors({ ...errors, country: "" });
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

        if (!form.country.trim()) {
            newErrors.country = "Country is required";
        }

        if (!form.aboutUser.trim()) {
            newErrors.aboutUser = "About User is required";
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

    // Step 1: Submit Details -> Move to Plan Selection
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setStep(2);
        }
    };

    // Step 2: Request OTP and Move to Verification
    const handlePlanSubmit = async () => {
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
                setStep(3); // Move to OTP verification step
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
                    country: form.country,
                    aboutUser: form.aboutUser,
                    password: form.password,
                }),
            });

            const registerData = await registerResponse.json();

                if (registerData.ok || registerResponse.ok) {
                    setNotification({ message: "Registration successful!", type: "success" });
                    
                    // Automatically login the user
                    if (registerData.token && registerData.user) {
                        await login(registerData.user, registerData.token);
                    }

                    // If a paid plan was selected, redirect to payment
                    if (selectedPlan) {
                        try {
                            setNotification({ message: "Redirecting to secure payment...", type: "success" });
                            const checkoutResponse = await fetch(`${BASE_URL}/api/stripe/create-checkout-session`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    planName: selectedPlan.name,
                                    price: selectedPlan.price,
                                    interval: selectedPlan.interval,
                                    packageId: selectedPlan._id,
                                    userId: registerData.user?._id || registerData.user?.id,
                                }),
                            });
                            const checkoutData = await checkoutResponse.json();
                            if (checkoutData.url) {
                                // Small delay to ensure state/localStorage is committed
                                setTimeout(() => {
                                    window.location.href = checkoutData.url;
                                }, 800);
                                return; // Don't navigate if redirecting
                            }
                        } catch (err) {
                        console.error("Error creating checkout session:", err);
                        setNotification({ message: "Registration successful, but redirection failed. Please subscribe from dashboard.", type: "warning" });
                    }
                } else {
                    // Only navigate to dashboard if not redirecting to payment
                    setTimeout(() => navigate("/dashboard"), 2000);
                }
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


            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl animate-slideUp">
                {/* <img src="/logo.png" alt="" className="mb-7 mx-auto w-[200px] object-contain" /> */}
                <img src="/map.png" alt="" className="mb-7 mx-auto w-[50px] object-contain" />

                {/* Step 1: Registration Form */}
                {step === 1 && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                            <p className="text-gray-600 text-sm">Fill in your details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Two Column Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
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
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.name ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Email */}
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
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* Password */}
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
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.password ? "border-red-500" : "border-gray-300"}`}
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

                                {/* Confirm Password */}
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
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
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

                                {/* Country */}
                                <div>
                                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <Select
                                        id="country"
                                        options={countryOptions}
                                        value={countryOptions.find(option => option.value === form.country)}
                                        onChange={handleCountryChange}
                                        placeholder="Select your country"
                                        isClearable
                                        isSearchable
                                        className={errors.country ? "react-select-error" : ""}
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                minHeight: '48px',
                                                borderWidth: '2px',
                                                borderColor: errors.country ? '#ef4444' : state.isFocused ? '#6366f1' : '#d1d5db',
                                                boxShadow: state.isFocused ? '0 0 0 2px #6366f1' : 'none',
                                                borderRadius: '8px',
                                                '&:hover': {
                                                    borderColor: errors.country ? '#ef4444' : '#6366f1'
                                                },
                                            }),
                                            valueContainer: (base) => ({
                                                ...base,
                                                padding: '8px 16px'
                                            })
                                        }}
                                    />
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>
                            </div>

                            {/* About User - separate row at end */}
                            <div>
                                <label htmlFor="aboutUser" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tell us about your industry and how data helps you in your goals
                                </label>
                                <textarea
                                    id="aboutUser"
                                    name="aboutUser"
                                    value={form.aboutUser}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself"
                                    rows="4"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${errors.aboutUser ? "border-red-500" : "border-gray-300"}`}
                                />
                                {errors.aboutUser && <p className="text-red-500 text-xs mt-1">{errors.aboutUser}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-6"
                            >
                                Continue to Plan Selection
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

                {/* Step 2: Plan Selection */}
                {step === 2 && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Plan</h1>
                            <p className="text-gray-600 text-sm">Select the best option for your needs</p>
                        </div>

                        <PlanSelection 
                            selectedPlan={selectedPlan} 
                            onPlanSelect={setSelectedPlan} 
                        />

                        <div className="flex flex-col gap-4 mt-8">
                            <button
                                onClick={handlePlanSubmit}
                                disabled={loading}
                                className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Continue to Verify Email"}
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="text-sm text-gray-500 hover:text-gray-700 font-semibold transition-colors"
                            >
                                ← Back to Details
                            </button>
                        </div>
                    </>
                )}

                {/* Step 3: OTP Verification */}
                {step === 3 && (
                    <>
                        <OtpVerification
                            email={form.email}
                            onVerify={handleVerifyOtp}
                            onResend={handleResendOtp}
                            loading={loading}
                        />

                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setStep(2)}
                                className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
                            >
                                ← Change Plan
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
