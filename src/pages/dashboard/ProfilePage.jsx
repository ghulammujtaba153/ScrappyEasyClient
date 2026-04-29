import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getData as getCountries } from 'country-list';
import { BASE_URL } from "../../config/URL";
import Notification from "../../components/common/Notification";
import { 
    FaEye, FaEyeSlash, FaUser, FaEnvelope, FaGlobe, FaLock, 
    FaSave, FaShieldAlt, FaHeart, FaVenusMars, FaBirthdayCake 
} from "react-icons/fa";
import { useAuth } from '../../context/authContext';
import Loader from '../../components/common/Loader';

const COUNTRY_LIST = getCountries().map(c => ({ value: c.name, label: c.name }));

const INTEREST_COUNTRIES = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "Italy", "Spain", "Japan", "China", "India", "Brazil", 
    "Mexico", "Russia", "South Africa", "United Arab Emirates", "Saudi Arabia",
    "Singapore", "South Korea", "Netherlands", "Sweden", "Switzerland", 
    "Norway", "Denmark", "Finland", "Belgium", "Austria", "Portugal", "Greece",
    "Turkey", "Israel", "Egypt", "Nigeria", "Kenya", "Pakistan", "Bangladesh",
    "Vietnam", "Thailand", "Malaysia", "Indonesia", "Philippines", "New Zealand"
].map(c => ({ value: c, label: c }));

const GENDER_OPTIONS = [
    { value: 'male', label: '♂ Male' },
    { value: 'female', label: '♀ Female' },
    { value: 'other', label: '⚧ Other' },
];

const selectStyles = (hasError) => ({
    control: (base, state) => ({
        ...base,
        minHeight: '42px',
        borderRadius: '12px',
        fontSize: '14px',
        border: hasError ? '1px solid #f87171' : state.isFocused ? '1px solid #0F792C' : '1px solid #e5e7eb',
        background: '#f9fafb',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(15,121,44,0.12)' : 'none',
        '&:hover': { borderColor: '#0F792C' },
    }),
    menu: base => ({ ...base, zIndex: 100, borderRadius: '12px', fontSize: '14px' }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#0F792C' : state.isFocused ? '#f0fdf4' : 'white',
        color: state.isSelected ? 'white' : '#111',
    }),
    multiValue: base => ({ ...base, backgroundColor: '#dcfce7', borderRadius: '6px' }),
    multiValueLabel: base => ({ ...base, color: '#166534', fontWeight: 600, fontSize: '12px' }),
    multiValueRemove: base => ({ ...base, color: '#166534', ':hover': { backgroundColor: '#bbf7d0', color: '#166534' } }),
});

const ProfilePage = () => {
    const { user, token, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: "", email: "", country: "", aboutUser: "",
        newPassword: "", confirmNewPassword: "",
        gender: "", dob: "", areaOfInterest: [],
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                country: user.country || "",
                aboutUser: user.aboutUser || "",
                gender: user.gender || "",
                dob: user.dob ? user.dob.split('T')[0] : "",
                areaOfInterest: Array.isArray(user.areaOfInterest) ? user.areaOfInterest : [],
            }));
            setFetchLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const callUpdateAPI = async (payload) => {
        const res = await fetch(`${BASE_URL}/api/auth/update/${user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(payload),
        });
        return { res, data: await res.json() };
    };

    // ── Profile Tab ──
    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
        if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

        setLoading(true);
        try {
            const { res, data } = await callUpdateAPI({
                name: form.name, email: form.email,
                country: form.country, aboutUser: form.aboutUser,
            });
            if (res.ok) {
                updateUser({ ...user, ...data.user });
                setNotification({ message: "Profile updated successfully!", type: "success" });
            } else {
                setNotification({ message: data.message || "Failed to update profile", type: "error" });
            }
        } catch { setNotification({ message: "An error occurred.", type: "error" }); }
        finally { setLoading(false); }
    };

    // ── Interests Tab ──
    const handleSubmitInterests = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.gender) newErrors.gender = "Please select your gender";
        if (!form.dob) newErrors.dob = "Please enter your date of birth";
        if (!form.areaOfInterest.length) newErrors.areaOfInterest = "Select at least one country";
        if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

        setLoading(true);
        try {
            const { res, data } = await callUpdateAPI({
                gender: form.gender,
                dob: form.dob,
                areaOfInterest: form.areaOfInterest,
            });
            if (res.ok) {
                updateUser({ ...user, ...data.user, isProfileComplete: true });
                setNotification({ message: "Interests updated successfully!", type: "success" });
            } else {
                setNotification({ message: data.message || "Failed to update interests", type: "error" });
            }
        } catch { setNotification({ message: "An error occurred.", type: "error" }); }
        finally { setLoading(false); }
    };

    // ── Security Tab ──
    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.newPassword) newErrors.newPassword = "New password is required";
        else if (form.newPassword.length < 6) newErrors.newPassword = "At least 6 characters";
        if (form.newPassword !== form.confirmNewPassword) newErrors.confirmNewPassword = "Passwords do not match";
        if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

        setLoading(true);
        try {
            const { res, data } = await callUpdateAPI({ password: form.newPassword });
            if (res.ok) {
                setNotification({ message: "Password changed successfully!", type: "success" });
                setForm(prev => ({ ...prev, newPassword: "", confirmNewPassword: "" }));
            } else {
                setNotification({ message: data.message || "Failed to update password", type: "error" });
            }
        } catch { setNotification({ message: "An error occurred.", type: "error" }); }
        finally { setLoading(false); }
    };

    if (fetchLoading) return <Loader />;

    const tabs = [
        { id: 'profile', label: 'Profile Info', icon: FaUser },
        { id: 'interests', label: 'Interests', icon: FaHeart },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
    ];

    const InputField = ({ icon: Icon, name, type = "text", placeholder, error, children, ...props }) => (
        <div>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />}
                {children || (
                    <input
                        type={type}
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F792C]/20 focus:border-[#0F792C] transition-all ${
                            error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                        }`}
                        {...props}
                    />
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );

    const Label = ({ children }) => (
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{children}</label>
    );

    const SaveButton = ({ label = "Save Changes", loadingLabel = "Saving..." }) => (
        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F792C] text-white rounded-xl font-semibold text-sm hover:bg-[#0a6024] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#0F792C]/20"
        >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaSave className="text-xs" />}
            {loading ? loadingLabel : label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            {notification && (
                <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
            )}

            <div className="max-w-3xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="h-24 bg-gradient-to-r from-[#0F792C] to-[#064E3B]" />
                    <div className="px-6 pb-6 -mt-10 flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-md border-2 border-white flex items-center justify-center flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0F792C] to-[#064E3B] flex items-center justify-center">
                                <FaUser className="text-white text-2xl" />
                            </div>
                        </div>
                        <div className="flex-1 pt-2 sm:pt-10">
                            <h1 className="text-xl font-bold text-gray-900">{user?.name || "Your Name"}</h1>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                <FaEnvelope className="text-xs" /> {user?.email}
                            </p>
                        </div>
                        <div className="hidden sm:flex flex-col items-end gap-1 pb-1">
                            {user?.country && (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <FaGlobe className="text-[#0F792C]" /> {user.country}
                                </span>
                            )}
                            {user?.gender && (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <FaVenusMars className="text-[#0F792C]" /> {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setErrors({}); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-[#0F792C] text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon className="text-xs" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── PROFILE TAB ── */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-6">
                            <h2 className="text-base font-bold text-gray-800">Personal Information</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Update your name, email and location details</p>
                        </div>
                        <form onSubmit={handleSubmitProfile} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <Label>Full Name</Label>
                                    <InputField icon={FaUser} name="name" placeholder="Enter your full name" error={errors.name} />
                                </div>
                                <div>
                                    <Label>Email Address</Label>
                                    <InputField icon={FaEnvelope} name="email" type="email" placeholder="Enter your email" error={errors.email} />
                                </div>
                            </div>
                            <div>
                                <Label>Country</Label>
                                <Select
                                    options={COUNTRY_LIST}
                                    value={COUNTRY_LIST.find(o => o.value === form.country) || null}
                                    onChange={sel => setForm(p => ({ ...p, country: sel ? sel.value : "" }))}
                                    placeholder="Select your country..."
                                    isClearable
                                    styles={selectStyles(!!errors.country)}
                                />
                                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                            </div>
                            <div>
                                <Label>About</Label>
                                <textarea
                                    name="aboutUser"
                                    value={form.aboutUser}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself and your goals..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F792C]/20 focus:border-[#0F792C] transition-all resize-none"
                                />
                            </div>
                            <div className="pt-2"><SaveButton label="Save Profile" /></div>
                        </form>
                    </div>
                )}

                {/* ── INTERESTS TAB ── */}
                {activeTab === 'interests' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-6">
                            <h2 className="text-base font-bold text-gray-800">Interests & Identity</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Used for collaboration matching and profile visibility</p>
                        </div>
                        <form onSubmit={handleSubmitInterests} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Gender */}
                                <div>
                                    <Label>Gender</Label>
                                    <Select
                                        options={GENDER_OPTIONS}
                                        value={GENDER_OPTIONS.find(o => o.value === form.gender) || null}
                                        onChange={sel => { setForm(p => ({ ...p, gender: sel ? sel.value : "" })); setErrors(p => ({ ...p, gender: "" })); }}
                                        placeholder="Select gender..."
                                        isClearable
                                        styles={selectStyles(!!errors.gender)}
                                    />
                                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                </div>
                                {/* Date of Birth */}
                                <div>
                                    <Label>Date of Birth</Label>
                                    <div className="relative">
                                        <FaBirthdayCake className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                        <input
                                            type="date"
                                            name="dob"
                                            value={form.dob}
                                            onChange={handleChange}
                                            max={new Date().toISOString().split('T')[0]}
                                            className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F792C]/20 focus:border-[#0F792C] transition-all ${
                                                errors.dob ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                                            }`}
                                        />
                                    </div>
                                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                                </div>
                            </div>

                            {/* Target Countries / Area of Interest */}
                            <div>
                                <Label>Target Countries (Areas of Interest)</Label>
                                <Select
                                    isMulti
                                    options={INTEREST_COUNTRIES}
                                    value={INTEREST_COUNTRIES.filter(o => form.areaOfInterest.includes(o.value))}
                                    onChange={selected => {
                                        setForm(p => ({ ...p, areaOfInterest: selected ? selected.map(s => s.value) : [] }));
                                        setErrors(p => ({ ...p, areaOfInterest: "" }));
                                    }}
                                    placeholder="Select countries you're interested in..."
                                    styles={selectStyles(!!errors.areaOfInterest)}
                                    closeMenuOnSelect={false}
                                />
                                {errors.areaOfInterest && <p className="text-red-500 text-xs mt-1">{errors.areaOfInterest}</p>}
                                {form.areaOfInterest.length > 0 && (
                                    <p className="text-xs text-gray-400 mt-1.5">{form.areaOfInterest.length} countr{form.areaOfInterest.length === 1 ? 'y' : 'ies'} selected</p>
                                )}
                            </div>

                            <div className="pt-2"><SaveButton label="Save Interests" loadingLabel="Saving..." /></div>
                        </form>
                    </div>
                )}

                {/* ── SECURITY TAB ── */}
                {activeTab === 'security' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-6">
                            <h2 className="text-base font-bold text-gray-800">Change Password</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Choose a strong password to keep your account secure</p>
                        </div>
                        <form onSubmit={handleSubmitPassword} className="space-y-5">
                            <div>
                                <Label>New Password</Label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        className={`w-full pl-9 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F792C]/20 focus:border-[#0F792C] transition-all ${
                                            errors.newPassword ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                                        }`}
                                    />
                                    <button type="button" onClick={() => setShowNewPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showNewPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                            </div>
                            <div>
                                <Label>Confirm New Password</Label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmNewPassword"
                                        value={form.confirmNewPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        className={`w-full pl-9 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F792C]/20 focus:border-[#0F792C] transition-all ${
                                            errors.confirmNewPassword ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                                        }`}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                    </button>
                                </div>
                                {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword}</p>}
                            </div>
                            {form.newPassword && (
                                <div className="flex gap-1.5">
                                    {[...Array(4)].map((_, i) => {
                                        const strength = Math.min(Math.floor(form.newPassword.length / 3), 4);
                                        return (
                                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                                                i < strength
                                                    ? strength <= 1 ? 'bg-red-400' : strength <= 2 ? 'bg-yellow-400' : strength <= 3 ? 'bg-blue-400' : 'bg-[#0F792C]'
                                                    : 'bg-gray-200'
                                            }`} />
                                        );
                                    })}
                                </div>
                            )}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F792C] text-white rounded-xl font-semibold text-sm hover:bg-[#0a6024] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#0F792C]/20"
                                >
                                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaShieldAlt className="text-xs" />}
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
