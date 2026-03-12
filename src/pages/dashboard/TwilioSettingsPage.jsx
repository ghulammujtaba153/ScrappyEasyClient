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
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                        <MdSettings size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Twilio Configuration</h1>
                        <p className="text-sm text-gray-500 mt-0.5">SET UP YOUR INDIVIDUAL SAAS CALLING IDENTITY</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                >
                    <MdLogout size={16} />
                    Sign Out / Clear
                </button>
            </div>

            <div className="max-w-4xl space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                            <MdSettings className="text-gray-500" /> TWILIO ACCOUNT CREDENTIALS
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Ensure these match your Twilio Console for calling features to work.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Account SID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                     Account SID
                                </label>
                                <input
                                    type="text"
                                    name="accountSid"
                                    value={config.accountSid}
                                    onChange={handleChange}
                                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* Auth Token */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                     Auth Token
                                </label>
                                <input
                                    type="password"
                                    name="authToken"
                                    value={config.authToken}
                                    onChange={handleChange}
                                    placeholder="••••••••••••••••••••••••"
                                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* TwiML App SID */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                     TwiML App SID (Voice SDK)
                                </label>
                                <input
                                    type="text"
                                    name="twimlAppSid"
                                    value={config.twimlAppSid}
                                    onChange={handleChange}
                                    placeholder="APxxxxxxxxxxxxxxxxxxxxxxxx"
                                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* API Key SID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                     API Key SID (SK...)
                                </label>
                                <input
                                    type="text"
                                    name="apiKeySid"
                                    value={config.apiKeySid}
                                    onChange={handleChange}
                                    placeholder="SKxxxxxxxxxxxxxxxxxxxxxxxx"
                                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* API Key Secret */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                     API Key Secret
                                </label>
                                <input
                                    type="password"
                                    name="apiKeySecret"
                                    value={config.apiKeySecret}
                                    onChange={handleChange}
                                    placeholder="••••••••••••••••••••••••"
                                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Verify Button */}
                            <div className="md:col-span-2">
                                <button
                                    type="button"
                                    onClick={handleVerify}
                                    disabled={loading || !config.accountSid || !config.authToken}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    Verify Twilio Account
                                </button>
                            </div>


                            {/* Phone Number Selection */}
                            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex flex-col md:flex-row md:items-end gap-4">
                                    <div className="flex-1">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <MdPhone className="text-gray-500" /> Select Active Phone Number
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="phoneNumber"
                                                value={config.phoneNumber}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                                                required
                                            >
                                                <option value="">{availableNumbers.length > 0 ? "-- Select a Number --" : "-- Fetch Numbers First --"}</option>
                                                {availableNumbers.map((num, idx) => (
                                                    <option key={idx} value={num.phoneNumber}>
                                                        {num.friendlyName} ({num.phoneNumber})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                ▼
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleFetchNumbers}
                                        disabled={isFetchingNumbers || !config.accountSid || !config.authToken}
                                        className="h-[38px] bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isFetchingNumbers ? (
                                            <>
                                                <span className="h-4 w-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                                                Fetching...
                                            </>
                                        ) : (
                                            <>
                                                <MdPhone size={16} />
                                                Fetch Numbers
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Click "Fetch Numbers" after entering SID & Token to populate this list.
                                </p>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-3 rounded-lg text-sm border flex items-center gap-2 ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                                {message.type === "success" ? "✅" : "❌"} {message.text}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <MdSave size={16} />
                                        Save Locally
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Webhook URLs Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                            <MdSettings className="text-gray-500" /> WEB DIALER WEBHOOK
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">USE THIS FOR YOUR TWIML APP VOICE URL</p>
                    </div>
                    <div className="p-6">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm text-gray-800 break-all select-all mb-3">
                            {`${BASE_URL}/api/call/outgoing`}
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${BASE_URL}/api/call/outgoing`);
                                setMessage({ type: "success", text: "Web Dialer URL copied!" });
                            }}
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                        >
                            Copy URL to Clipboard
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <h3 className="text-blue-800 font-bold flex items-center gap-2 mb-2 text-sm">
                        <MdHelpOutline /> Where do I find these?
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <span className="font-medium">Account SID & Auth Token:</span> Found on the main Twilio Console dashboard.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TwilioSettingsPage;