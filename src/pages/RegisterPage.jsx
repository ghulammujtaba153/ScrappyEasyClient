import React, { useState, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/URL";
import Notification from "../component/common/Notification";
import OtpVerification from "../component/common/OtpVerification";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";
import countryList from "country-list";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
    
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
        phone: "",
        phoneCountry: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        city: "",
        country: "",
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
        setForm({ ...form, phone: value, phoneCountry: country.name });
        if (errors.phone) {
            setErrors({ ...errors, phone: "" });
        }
    };

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

        if (!form.phone) {
            newErrors.phone = "Phone number is required";
        }

        if (!form.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!form.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!form.country.trim()) {
            newErrors.country = "Country is required";
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
                    phoneCountry: form.phoneCountry,
                    address: form.address,
                    city: form.city,
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


            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl animate-slideUp">
                <img src="/logo.png" alt="" className="mb-7 mx-auto w-[200px] object-contain" />

                {/* Step 1: Registration Form */}
                {step === 1 && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                            <p className="text-gray-600 text-sm">Sign up to get started</p>
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
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.name ? "border-red-500" : "border-gray-300"
                                            }`}
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
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.email ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* Phone */}
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

                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="Enter your city"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${errors.city ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
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
                                            control: (base) => ({
                                                ...base,
                                                minHeight: '48px',
                                                borderWidth: '2px',
                                                borderColor: errors.country ? '#ef4444' : '#d1d5db',
                                                borderRadius: '8px',
                                                '&:hover': {
                                                    borderColor: errors.country ? '#ef4444' : '#d1d5db'
                                                },
                                                boxShadow: 'none',
                                            }),
                                            valueContainer: (base) => ({
                                                ...base,
                                                padding: '8px 16px'
                                            })
                                        }}
                                    />
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
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
                            </div>

                            {/* Address - Full Width */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Enter your full address"
                                    rows="2"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${errors.address ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
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
