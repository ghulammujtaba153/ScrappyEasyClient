import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../config/URL";
import Notification from "../components/common/Notification";
import OtpVerification from "../components/common/OtpVerification";
import { FaEye, FaEyeSlash, FaWallet, FaUniversity, FaCamera, FaRocket, FaCrown, FaHourglassHalf, FaCheckCircle } from "react-icons/fa";
import Select from "react-select";
import countryList from "country-list";
import { useAuth } from "../context/authContext";
import { PLANS } from "../config/plans";
import Navbar from "../components/landing/Navbar";
import FooterSection from "../components/landing/FooterSection";



const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [step, setStep] = useState(1); // 1: Form/Details, 2: OTP Verification, 3: Success/Under Review
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    
    // Get query param for plan
    const queryParams = new URLSearchParams(location.search);
    const initialPlanId = queryParams.get("plan");

    // Set initial plan from hardcoded PLANS
    useEffect(() => {
        if (initialPlanId) {
            const plan = PLANS.find(p => p.id === initialPlanId);
            if (plan) setSelectedPlan(plan);
        }
    }, [initialPlanId]);
    
    // Get country options
    const countryOptions = useMemo(() => {
        const countries = countryList.getData();
        return countries.map(country => ({
            value: country.name,
            label: country.name
        }));
    }, []);

    const planOptions = useMemo(() => {
        return PLANS.map(p => ({
            value: p.id,
            label: `${p.name} - ${p.price}`,
            plan: p
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            setScreenshotPreview(URL.createObjectURL(file));
        }
    };

    const handlePlanDropdownChange = (selectedOption) => {
        setSelectedPlan(selectedOption ? selectedOption.plan : null);
        if (errors.plan) {
            setErrors({ ...errors, plan: "" });
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
            newErrors.aboutUser = "Introduction is required";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (selectedPlan && !screenshot) {
            newErrors.screenshot = "Payment screenshot is required for paid plans";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 1: Submit Details & Request OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                // Check if email already exists (optional, but good for UX)
                // For now, just generate OTP
                const response = await fetch(`${BASE_URL}/api/otp/generate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: form.email, registration: true }),
                });

                const data = await response.json();

                if (response.ok) {
                    setNotification({ message: "OTP sent to your email!", type: "success" });
                    setStep(2); // Move to OTP verification
                } else {
                    setNotification({ message: data.message || "Failed to send OTP", type: "error" });
                }
            } catch (error) {
                console.error("Error requesting OTP:", error);
                setNotification({ message: "An error occurred. Please try again.", type: "error" });
            } finally {
                setLoading(false);
            }
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

    // Verify OTP and Register with Payment Proof
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

            // OTP verified, now register with multipart/form-data for the screenshot
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("country", form.country);
            formData.append("aboutUser", form.aboutUser);
            formData.append("password", form.password);
            
            if (selectedPlan) {
                formData.append("planId", selectedPlan.id);
                formData.append("planName", selectedPlan.name);
                formData.append("planAmount", selectedPlan.price);
                formData.append("screenshot", screenshot);
            }

            const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                body: formData, // No Content-Type header needed for FormData
            });

            const registerData = await registerResponse.json();

            if (registerData.ok || registerResponse.ok) {
                setNotification({ 
                    message: "Registration successful! Your account has been submitted for review.", 
                    type: "success" 
                });
                setStep(3); // Show under review message
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* <Navbar /> */}
            <div className="flex-grow flex items-center justify-center p-5 pt-28 pb-20">
                {notification && (

                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden w-full max-w-6xl flex flex-col md:flex-row animate-slideUp">
                
                {/* Left Panel: Payment Instructions */}
                <div className="w-full md:w-[35%] bg-gray-800 p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    
                    <div className="mb-10 relative z-10">
                        <img src="/map.png" alt="" className="w-12 h-12 mb-6" />
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Payment Details</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Complete your payment using any method below and upload the screenshot for instant activation.
                        </p>
                    </div>

                    {/* Amount to Pay Card */}
                    {selectedPlan && (
                        <div className="mb-12 p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm relative z-10 animate-slideIn">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Amount to Pay</p>
                            <div className="flex items-baseline gap-2 mb-1">
                                <h3 className="text-4xl font-black text-white">{selectedPlan.price}</h3>
                                <span className="text-gray-400 text-sm font-medium">{selectedPlan.period}</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Plan: {selectedPlan.name}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-8 relative z-10">
                        {/* JazzCash */}
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <FaWallet className="text-primary" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-200">JazzCash</h4>
                                <p className="text-lg font-mono text-primary">0335-1066628</p>

                                <p className="text-xs text-gray-500">Ac Title: Map Harvest</p>
                            </div>
                        </div>

                        {/* EasyPaisa */}
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                <FaWallet className="text-green-500" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-200">EasyPaisa</h4>
                                <p className="text-lg font-mono text-green-500">0335-1066628</p>

                                <p className="text-xs text-gray-500">Ac Title: Map Harvest</p>
                            </div>
                        </div>

                        {/* Bank Transfer */}
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <FaUniversity className="text-blue-400" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-200">Bank Transfer</h4>
                                <p className="text-sm font-mono text-blue-400">Acc: 1234567890</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">HBL Bank Limited</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 italic text-gray-500 text-xs">
                        * Upload your payment screenshot in the form to get your account approved within 2-4 hours.
                    </div>
                </div>

                {/* Right Panel: Form */}
                <div className="w-full md:w-[65%] p-8 md:p-12">
                    {step === 1 && (
                        <>
                            <div className="mb-10">
                                <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
                                <p className="text-gray-500 font-medium">Join Map Harvest and start growing your pipeline</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className={`w-full px-5 py-3.5 bg-gray-50 border-2 rounded-2xl transition-all focus:ring-4 focus:ring-primary/10 ${errors.name ? "border-red-500" : "border-transparent focus:border-primary"}`}
                                        />
                                        {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className={`w-full px-5 py-3.5 bg-gray-50 border-2 rounded-2xl transition-all focus:ring-4 focus:ring-primary/10 ${errors.email ? "border-red-500" : "border-transparent focus:border-primary"}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.email}</p>}
                                    </div>

                                    {/* Country */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Country</label>
                                        <Select
                                            options={countryOptions}
                                            value={countryOptions.find(o => o.value === form.country)}
                                            onChange={handleCountryChange}
                                            placeholder="Select Country"
                                            className="react-select-container"
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    borderRadius: '1rem',
                                                    padding: '4px 8px',
                                                    backgroundColor: '#f9fafb',
                                                    border: state.isFocused ? '2px solid #0F792C' : '2px solid transparent',
                                                    boxShadow: 'none',
                                                    '&:hover': { border: '2px solid #0F792C' }
                                                })
                                            }}
                                        />
                                        {errors.country && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.country}</p>}
                                    </div>

                                    {/* Package Selection */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Select Package</label>
                                        <Select
                                            options={planOptions}
                                            value={planOptions.find(o => o.plan?.id === selectedPlan?.id)}
                                            onChange={handlePlanDropdownChange}
                                            placeholder="Choose Plan"
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    borderRadius: '1rem',
                                                    padding: '4px 8px',
                                                    backgroundColor: '#f9fafb',
                                                    border: state.isFocused ? '2px solid #0F792C' : '2px solid transparent',
                                                    boxShadow: 'none',
                                                    '&:hover': { border: '2px solid #0F792C' }
                                                })
                                            }}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className={`w-full px-5 py-3.5 bg-gray-50 border-2 rounded-2xl transition-all focus:ring-4 focus:ring-primary/10 ${errors.password ? "border-red-500" : "border-transparent focus:border-primary"}`}
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className={`w-full px-5 py-3.5 bg-gray-50 border-2 rounded-2xl transition-all focus:ring-4 focus:ring-primary/10 ${errors.confirmPassword ? "border-red-500" : "border-transparent focus:border-primary"}`}
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* About User */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">Tell us about your industry</label>
                                    <textarea
                                        name="aboutUser"
                                        value={form.aboutUser}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="How will Map Harvest help your business goals?"
                                        className={`w-full px-5 py-3.5 bg-gray-50 border-2 rounded-2xl transition-all resize-none focus:ring-4 focus:ring-primary/10 ${errors.aboutUser ? "border-red-500" : "border-transparent focus:border-primary"}`}
                                    />
                                    {errors.aboutUser && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.aboutUser}</p>}
                                </div>

                                {/* Payment Screenshot Upload */}
                                {selectedPlan && (
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700">Upload Payment Screenshot</label>
                                        <div className="flex items-center gap-6">
                                            <label className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all">
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                <FaCamera className="text-gray-300 mb-2" size={24} />
                                                <span className="text-xs font-bold text-gray-400">Click to upload screenshot</span>
                                            </label>
                                            
                                            {screenshotPreview && (
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary shadow-lg flex-shrink-0">
                                                    <img src={screenshotPreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        {errors.screenshot && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.screenshot}</p>}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50"
                                >
                                    {loading ? "Sending OTP..." : "Register & Verify Email"}
                                </button>

                                <div className="text-center pt-4">
                                    <p className="text-sm text-gray-500 font-medium">
                                        Already have an account? <Link to="/login" className="text-primary font-bold">Sign In</Link>
                                    </p>
                                </div>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <div className="h-full flex flex-col justify-center max-w-md mx-auto">
                            <OtpVerification
                                email={form.email}
                                onVerify={handleVerifyOtp}
                                onResend={handleResendOtp}
                                loading={loading}
                            />
                            <div className="text-center mt-6">
                                <button onClick={() => setStep(1)} className="text-sm text-gray-400 font-bold hover:text-gray-600">
                                    ← Back to Details
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn py-10">
                            <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-8 relative">
                                <FaHourglassHalf className="text-yellow-600 animate-pulse" size={48} />
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                    Pending
                                </div>
                            </div>
                            
                            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Almost There!</h2>
                            <p className="text-gray-500 mb-10 max-w-sm text-lg leading-relaxed">
                                Your registration and payment proof have been received. We are now **manually verifying** your details to activate your pro features.
                            </p>
                            
                            <div className="w-full max-w-md space-y-4 mb-10">
                                <div className="bg-primary/5 p-5 rounded-3xl border-2 border-primary/10 flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FaCheckCircle className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 leading-tight">Verification in Progress</h4>
                                        <p className="text-xs text-gray-500 mt-1">Our team checks payments 24/7. Average wait: **2-4 hours**.</p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-5 rounded-3xl border-2 border-blue-100 flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <FaUniversity className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 leading-tight">Email Confirmation</h4>
                                        <p className="text-xs text-gray-500 mt-1">You will receive an email once your subscription is active.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full">
                                <Link to="/login" className="bg-primary text-white w-full py-5 rounded-3xl font-black text-xl shadow-[0_20px_50px_rgba(15,121,44,0.3)] hover:shadow-none hover:translate-y-1 transition-all">
                                    Back to Login
                                </Link>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    You can check your status by signing in later.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </div>
            {/* <FooterSection /> */}
        </div>
    );
};




export default RegisterPage;
