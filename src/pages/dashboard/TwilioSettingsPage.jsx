import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../config/URL";
import { MdSettings, MdSave, MdHelpOutline, MdPhone, MdLogout } from "react-icons/md";

const TwilioSettingsPage = () => {
    const [config, setConfig] = useState({
        accountSid: "",
        authToken: "",
        twimlAppSid: "",
        apiKeySid: "",
        apiKeySecret: "",
        phoneNumber: ""
    });
    const [loading, setLoading] = useState(false);
    const [isFetchingNumbers, setIsFetchingNumbers] = useState(false);
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchConfig = () => {
            const saved = localStorage.getItem("twilio_config");
            if (saved) {
                const parsed = JSON.parse(saved);
                setConfig(parsed);
                // If we have saved numbers, we might want to pre-populate, 
                // but usually we fetch fresh ones or just show the saved number in the list
                if (parsed.phoneNumber) {
                    setAvailableNumbers([{ phoneNumber: parsed.phoneNumber, friendlyName: parsed.phoneNumber }]);
                }
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleFetchNumbers = async () => {
        if (!config.accountSid || !config.authToken) {
            setMessage({ type: "error", text: "Account SID and Auth Token are required to fetch numbers." });
            return;
        }

        setIsFetchingNumbers(true);
        setMessage({ type: "info", text: "Validating credentials and fetching numbers..." });

        try {
            const response = await fetch(`${BASE_URL}/api/call/fetch-data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accountSid: config.accountSid,
                    authToken: config.authToken
                })
            });

            const data = await response.json();
            if (data.success) {
                setAvailableNumbers(data.numbers);

                if (data.numbers.length > 0 && !config.phoneNumber) {
                    setConfig(prev => ({ ...prev, phoneNumber: data.numbers[0].phoneNumber }));
                }

                setMessage({ type: "success", text: `Success! Found ${data.numbers.length} active numbers.` });
            } else {
                setMessage({ type: "error", text: data.message || "Failed to fetch numbers." });
            }
        } catch (error) {
            console.error("Error fetching numbers:", error);
            setMessage({ type: "error", text: "Network error while fetching numbers." });
        } finally {
            setIsFetchingNumbers(false);
        }
    };

    const handleSignOut = () => {
        if (window.confirm("Are you sure you want to clear your Twilio credentials?")) {
            localStorage.removeItem("twilio_config");
            setConfig({
                accountSid: "",
                authToken: "",
                twimlAppSid: "",
                apiKeySid: "",
                apiKeySecret: "",
                phoneNumber: ""
            });
            setAvailableNumbers([]);
            setMessage({ type: "success", text: "Credentials cleared successfully!" });
        }
    };

    const handleVerify = async () => {
        if (!config.accountSid || !config.authToken) {
            setMessage({ type: "error", text: "Account SID and Auth Token are required." });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/call/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountSid: config.accountSid, authToken: config.authToken })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Twilio credentials verified!" });
            } else {
                setMessage({ type: "error", text: data.message });
            }
        } catch (err) {
            console.error("Verification error:", err);
            setMessage({ type: "error", text: "Verification failed." });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            localStorage.setItem("twilio_config", JSON.stringify(config));
            setMessage({ type: "success", text: "Twilio credentials saved locally!" });
        } catch (error) {
            console.error("Error saving Twilio config:", error);
            setMessage({ type: "error", text: "Failed to save credentials." });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen uppercase tracking-tight">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[#0F792C] flex items-center justify-center text-white shadow-lg">
                        <MdSettings size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Twilio Configuration</h1>
                        <p className="text-xs font-bold text-gray-500">SET UP YOUR INDIVIDUAL SAAS CALLING IDENTITY</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                    <MdLogout size={18} />
                    Sign Out / Clear
                </button>
            </div>

            <div className="max-w-4xl">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-[#0F792C] p-6 text-white">
                        <h2 className="text-xl font-black italic flex items-center gap-2">
                            <MdSettings /> TWILIO ACCOUNT CREDENTIALS
                        </h2>
                        <p className="text-xs opacity-80 mt-1 font-bold">Ensure these match your Twilio Console for calling features to work.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Account SID */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-700 mb-2 uppercase">
                                    <MdSettings className="text-[#0F792C]" /> Account SID
                                </label>
                                <input
                                    type="text"
                                    name="accountSid"
                                    value={config.accountSid}
                                    onChange={handleChange}
                                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-semibold focus:ring-2 focus:ring-[#0F792C] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* Auth Token */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-700 mb-2 uppercase">
                                    <MdSettings className="text-[#0F792C]" /> Auth Token
                                </label>
                                <input
                                    type="password"
                                    name="authToken"
                                    value={config.authToken}
                                    onChange={handleChange}
                                    placeholder="••••••••••••••••••••••••"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-semibold focus:ring-2 focus:ring-[#0F792C] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* TwiML App SID */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-700 mb-2 uppercase">
                                    <MdSettings className="text-[#0F792C]" /> TwiML App SID (Voice SDK)
                                </label>
                                <input
                                    type="text"
                                    name="twimlAppSid"
                                    value={config.twimlAppSid}
                                    onChange={handleChange}
                                    placeholder="APxxxxxxxxxxxxxxxxxxxxxxxx"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-semibold focus:ring-2 focus:ring-[#0F792C] focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* API Key SID */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-700 mb-2 uppercase">
                                    <MdSettings className="text-[#0F792C]" /> API Key SID (SK...)
                                </label>
                                <input
                                    type="text"
                                    name="apiKeySid"
                                    value={config.apiKeySid}
                                    onChange={handleChange}
                                    placeholder="SKxxxxxxxxxxxxxxxxxxxxxxxx"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-semibold focus:ring-2 focus:ring-[#0F792C] focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* API Key Secret */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-gray-700 mb-2 uppercase">
                                    <MdSettings className="text-[#0F792C]" /> API Key Secret
                                </label>
                                <input
                                    type="password"
                                    name="apiKeySecret"
                                    value={config.apiKeySecret}
                                    onChange={handleChange}
                                    placeholder="••••••••••••••••••••••••"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-semibold focus:ring-2 focus:ring-[#0F792C] focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Verify Button */}
                            <div className="md:col-span-2">
                                <button
                                    type="button"
                                    onClick={handleVerify}
                                    disabled={loading || !config.accountSid || !config.authToken}
                                    className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                >
                                    Verify Twilio Account
                                </button>
                            </div>


                            {/* Phone Number Selection */}
                            <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
                                <div className="flex flex-col md:flex-row md:items-end gap-6">
                                    <div className="flex-1">
                                        <label className="flex items-center gap-2 text-xs font-black text-gray-700 mb-2 uppercase">
                                            <MdPhone className="text-[#0F792C]" /> Select Active Phone Number
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="phoneNumber"
                                                value={config.phoneNumber}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:ring-2 focus:ring-[#0F792C] focus:border-transparent outline-none transition-all appearance-none"
                                                required
                                            >
                                                <option value="">{availableNumbers.length > 0 ? "-- Select a Number --" : "-- Fetch Numbers First --"}</option>
                                                {availableNumbers.map((num, idx) => (
                                                    <option key={idx} value={num.phoneNumber}>
                                                        {num.friendlyName} ({num.phoneNumber})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                ▼
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleFetchNumbers}
                                        disabled={isFetchingNumbers || !config.accountSid || !config.authToken}
                                        className="h-[50px] bg-white hover:bg-gray-100 text-[#0F792C] border-2 border-[#0F792C] px-6 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {isFetchingNumbers ? (
                                            <>
                                                <span className="h-4 w-4 border-2 border-[#0F792C]/20 border-t-[#0F792C] rounded-full animate-spin"></span>
                                                Fetching...
                                            </>
                                        ) : (
                                            <>
                                                <MdPhone size={18} />
                                                Fetch Active Numbers
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold italic">
                                    Click "Fetch Active Numbers" after entering SID & Token to populate this list.
                                </p>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl text-sm font-bold border flex items-center gap-2 ${message.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                {message.type === "success" ? "✅" : "❌"} {message.text}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#0F792C] hover:bg-[#0c6123] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-green-100 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                        SAVING...
                                    </>
                                ) : (
                                    <>
                                        <MdSave size={20} />
                                        Save Locally
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Webhook URLs Section */}
                <div className="mt-8">
                    {/* Web Dialer Webhook */}
                    <div className="bg-black rounded-2xl shadow-xl border border-gray-800 overflow-hidden flex flex-col">
                        <div className="bg-gray-900 p-6 text-white border-b border-gray-800">
                            <h2 className="text-xl font-black italic flex items-center gap-2">
                                <MdSettings /> WEB DIALER WEBHOOK
                            </h2>
                            <p className="text-xs opacity-60 mt-1 font-bold">USE THIS FOR YOUR TWIML APP VOICE URL</p>
                        </div>
                        <div className="p-8 space-y-4 flex-1">
                            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 font-mono text-sm text-green-400 break-all select-all">
                                {`${BASE_URL}/api/call/outgoing`}
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${BASE_URL}/api/call/outgoing`);
                                    setMessage({ type: "success", text: "Web Dialer URL copied!" });
                                }}
                                className="text-xs font-black text-white hover:text-[#0F792C] transition-all flex items-center gap-2 uppercase italic"
                            >
                                Copy URL to Clipboard
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                    <h3 className="text-blue-800 font-extrabold flex items-center gap-2 mb-2 uppercase tracking-wide">
                        <MdHelpOutline /> Where do I find these?
                    </h3>
                    <ul className="text-xs text-blue-700 space-y-2 font-bold opacity-90 uppercase">
                        <li>• <span className="text-blue-900 underline cursor-pointer">Account SID & Auth Token:</span> Found on the main Twilio Console dashboard.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TwilioSettingsPage;