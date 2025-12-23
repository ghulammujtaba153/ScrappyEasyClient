import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/URL";
import { MdCall } from "react-icons/md";


const CallPage = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [companyName, setCompanyName] = useState("Mative Labs");
    const [objective, setObjective] = useState("schedule a website redesign meet");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleStartCall = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await axios.post(`${BASE_URL}/api/call/start`, {
                phoneNumber,
                companyName,
                objective
            });
            setMessage("Call started successfully!");
        } catch (error) {
            console.error(error);
            setMessage("Failed to start call. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 relative min-h-[80vh] bg-gray-50 uppercase tracking-tight">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">AI Call Management</h1>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-green-700 uppercase">System Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-100">
                            <MdCall size={24} />
                        </div>
                        <h2 className="text-xl font-black text-gray-800 uppercase italic">Power AI Scheduling</h2>
                    </div>

                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        Configure your AI caller's context below. The AI will introduce itself as your company and pursue the objective you define.
                    </p>

                    <form onSubmit={handleStartCall} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                                    Target Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+923..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-lg font-bold focus:ring-2 focus:ring-[#0F792C] focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                                    Your Company Name
                                </label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. Mative Labs"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-semibold focus:ring-2 focus:ring-[#0F792C] focus:border-transparent outline-none transition-all"
                                    required
                                />
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">The AI will use this in its introduction.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-700 uppercase mb-2">
                                    Call Objective
                                </label>
                                <textarea
                                    value={objective}
                                    onChange={(e) => setObjective(e.target.value)}
                                    placeholder="e.g. schedule a website redesign meet"
                                    rows={2}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-semibold focus:ring-2 focus:ring-[#0F792C] focus:border-transparent outline-none transition-all resize-none"
                                    required
                                />
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">The AI will use this to pitch the meeting.</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0F792C] hover:bg-[#0c6123] text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-green-100 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <span className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Initiating AI Link...
                                </>
                            ) : (
                                <>
                                    <MdCall size={20} />
                                    Launch AI Scheduling Call
                                </>
                            )}
                        </button>

                        {message && (
                            <div className={`mt-6 p-4 rounded-xl text-sm font-bold border ${message.includes("success") ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-2xl text-white shadow-xl">
                        <h3 className="text-xl font-black uppercase mb-4">How it works</h3>
                        <div className="space-y-4 text-sm opacity-90 font-bold">
                            <div className="flex gap-3">
                                <div className="h-6 w-6 rounded bg-white/20 flex items-center justify-center shrink-0">1</div>
                                <p>AI dials the target number and introduces itself with your Company Name.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-6 w-6 rounded bg-white/20 flex items-center justify-center shrink-0">2</div>
                                <p>It captures the user's name and proceeds to pitch your specific objective.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-6 w-6 rounded bg-white/20 flex items-center justify-center shrink-0">3</div>
                                <p>If the user is interested, the lead is automatically saved to your dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallPage;
