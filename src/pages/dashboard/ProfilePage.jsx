import React, { useState, useEffect } from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from 'react-select';
import { getData as getCountries } from 'country-list';
import { BASE_URL } from "../../config/URL";
import Notification from "../../components/common/Notification";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { useAuth } from '../../context/authContext';
import Loader from '../../components/common/Loader';

const ProfilePage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        phoneCountry: "",
        address: "",
        city: "",
        country: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {user} = useAuth()

    // Get countries list for dropdown
    const countryOptions = getCountries().map(country => ({
        value: country.name,
        label: country.name
    }));

    // Fetch user profile data
    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const fetchUserProfile = async () => {
        setFetchLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            if (!user || !user._id) {
                setNotification({ message: "User not found. Please login again.", type: "error" });
                return;
            }

            const response = await fetch(`${BASE_URL}/api/auth/profile/${user._id}`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();

            if (response.ok) {
                const userData = data.user || data;
                setForm({
                    name: userData.name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    phoneCountry: userData.phoneCountry || "",
                    address: userData.address || "",
                    city: userData.city || "",
                    country: userData.country || "",
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                });
            } else {
                setNotification({ message: data.message || "Failed to fetch profile", type: "error" });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setNotification({ message: "An error occurred while fetching profile", type: "error" });
        } finally {
            setFetchLoading(false);
        }
    };

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

        // Password validation (only if user wants to change password)
        if (form.currentPassword || form.newPassword || form.confirmNewPassword) {
            if (!form.currentPassword) {
                newErrors.currentPassword = "Current password is required to change password";
            }

            if (!form.newPassword) {
                newErrors.newPassword = "New password is required";
            } else if (form.newPassword.length < 6) {
                newErrors.newPassword = "Password must be at least 6 characters";
            }

            if (form.newPassword !== form.confirmNewPassword) {
                newErrors.confirmNewPassword = "Passwords do not match";
            }
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
            const token = localStorage.getItem('token');
            const updateData = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                phoneCountry: form.phoneCountry,
                address: form.address,
                city: form.city,
                country: form.country,
            };

            // Include password fields only if user wants to change password
            if (form.currentPassword && form.newPassword) {
                updateData.currentPassword = form.currentPassword;
                updateData.newPassword = form.newPassword;
            }

            const response = await fetch(`${BASE_URL}/api/auth/update/${user._id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ message: "Profile updated successfully!", type: "success" });
                
                // Update local storage if needed
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user.name = form.name;
                    user.email = form.email;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                // Clear password fields
                setForm({
                    ...form,
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                });
            } else {
                setNotification({ message: data.message || "Failed to update profile", type: "error" });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setNotification({ message: "An error occurred. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                        <div className="bg-primary/10 p-4 rounded-full mr-4">
                            <FaUser className="text-primary text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                            <p className="text-gray-600 text-sm mt-1">Update your personal information</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
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
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                                            errors.name ? "border-red-500" : "border-gray-300"
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
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                                            errors.email ? "border-red-500" : "border-gray-300"
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
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                                            errors.city ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>

                                {/* Country Dropdown */}
                                <div className="md:col-span-2">
                                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <Select
                                        options={countryOptions}
                                        value={countryOptions.find(option => option.value === form.country)}
                                        onChange={handleCountryChange}
                                        placeholder="Select your country"
                                        isClearable
                                        className={errors.country ? "border-2 border-red-500 rounded-lg" : ""}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                minHeight: '48px',
                                                borderRadius: '8px',
                                                border: errors.country ? '2px solid #ef4444' : '2px solid #d1d5db',
                                                '&:hover': {
                                                    border: errors.country ? '2px solid #ef4444' : '2px solid #d1d5db',
                                                },
                                                boxShadow: 'none',
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 100,
                                            }),
                                        }}
                                    />
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>
                            </div>

                            {/* Address - Full Width */}
                            <div className="mt-4">
                                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Enter your full address"
                                    rows="3"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${
                                        errors.address ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>
                        </div>

                        {/* Change Password Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                            <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Current Password */}
                                <div className="md:col-span-2">
                                    <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={form.currentPassword}
                                            onChange={handleChange}
                                            placeholder="Enter current password"
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                                                errors.currentPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showCurrentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                        </button>
                                    </div>
                                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            id="newPassword"
                                            name="newPassword"
                                            value={form.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                                                errors.newPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                        </button>
                                    </div>
                                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmNewPassword"
                                            name="confirmNewPassword"
                                            value={form.confirmNewPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                                                errors.confirmNewPassword ? "border-red-500" : "border-gray-300"
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
                                    {errors.confirmNewPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? "Updating Profile..." : "Update Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
