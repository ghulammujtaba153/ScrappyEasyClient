import React, { useState, useEffect } from "react";
import { Device } from "@twilio/voice-sdk";
import { MdCall, MdDialpad, MdMic, MdMicOff, MdCallEnd, MdClose, MdFiberManualRecord } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../config/URL";

const Dialer = ({ onClose, phoneNumber, onCallEnd, onPrevious, onNext, hasPrevious, hasNext, currentLeadName }) => {
    const [number, setNumber] = useState(phoneNumber || "");
    const [callStatus, setCallStatus] = useState("Idle"); // Idle, Connecting, In Progress
    const [device, setDevice] = useState(null);
    const [activeCall, setActiveCall] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    // Track the last prop value to detect actual changes from the parent
    const [prevPhoneNumber, setPrevPhoneNumber] = useState(phoneNumber);

    // Synchronize number when the phoneNumber prop changes from outside
    if (phoneNumber !== prevPhoneNumber) {
        setPrevPhoneNumber(phoneNumber);
        setNumber(phoneNumber || "");
    }

    const [error, setError] = useState("");

    useEffect(() => {
        const init = async () => {
            try {
                const saved = localStorage.getItem("twilio_config");
                const config = saved ? JSON.parse(saved) : {};

                if (!config.accountSid) {
                    setError("Twilio not configured locally. Please visit settings.");
                    return;
                }

                const response = await axios.get(`${BASE_URL}/api/call/token`, {
                    params: config
                });
                const { token, apiKeySid, apiKeySecret } = response.data;

                // Save generated keys to avoid creating new ones every time
                if (apiKeySid && apiKeySecret && (!config.apiKeySid || !config.apiKeySecret)) {
                    const newConfig = { ...config, apiKeySid, apiKeySecret };
                    localStorage.setItem("twilio_config", JSON.stringify(newConfig));
                }

                const newDevice = new Device(token, {
                    logLevel: 1,
                    edge: "ashburn",
                });

                newDevice.on("registered", () => console.log("Twilio Device Registered"));
                newDevice.on("error", (error) => {
                    console.error("Twilio Device Error:", error);
                    if (error.code === 20101) {
                        setError("Critical Error: Invalid Access Token. Please verify in Settings that your TwiML App SID belongs to your Account SID.");
                    } else {
                        setError("Twilio Error: " + error.message);
                    }
                });

                await newDevice.register();
                setDevice(newDevice);
            } catch (error) {
                console.error("Failed to initialize Twilio device:", error);
                setError(error.response?.data?.message || "Failed to connect to Twilio service");
            }
        };

        const timer = setTimeout(init, 1000); // Small delay to ensure clean state
        return () => {
            clearTimeout(timer);
            if (device) {
                device.destroy();
            }
        };
    }, []);

    const handleCall = async () => {
        if (!device || !number) return;

        const saved = localStorage.getItem("twilio_config");
        const config = saved ? JSON.parse(saved) : {};

        setCallStatus("Connecting");
        setIsRecording(false);
        try {
            const call = await device.connect({
                params: {
                    To: number,
                    accountSid: config.accountSid,
                    authToken: config.authToken,
                    phoneNumber: config.phoneNumber
                }
            });

            call.on("accept", () => setCallStatus("In Progress"));
            call.on("disconnect", () => {
                setCallStatus("Idle");
                setActiveCall(null);
                setIsRecording(false);
                if (onCallEnd) onCallEnd();
            });
            call.on("error", (error) => {
                console.error("Call Error:", error);
                setCallStatus("Idle");
                setActiveCall(null);
                setIsRecording(false);
                if (onCallEnd) onCallEnd();
            });

            setActiveCall(call);
        } catch (error) {
            console.error("Failed to connect call:", error);
            setCallStatus("Idle");
            if (onCallEnd) onCallEnd();
        }
    };

    const handleHangup = () => {
        if (activeCall) {
            activeCall.disconnect();
        }
    };

    const handleRecordingToggle = async () => {
        if (!activeCall) return;

        // Try to get CallSid from parameters. It might vary by SDK version/connection type.
        // For outgoing calls, activeCall.parameters.CallSid is standard.
        const callSid = activeCall.parameters.CallSid || activeCall.parameters.callSid;

        if (!callSid) {
            setError("Cannot record: Call ID missing.");
            return;
        }

        const saved = localStorage.getItem("twilio_config");
        const config = saved ? JSON.parse(saved) : {};

        try {
            const action = isRecording ? 'stop' : 'start';
            const res = await axios.post(`${BASE_URL}/api/call/recording/toggle`, {
                callSid,
                action,
                number: number ? number.trim() : "",
                accountSid: config.accountSid,
                authToken: config.authToken
            });

            if (res.data.success) {
                setIsRecording(!isRecording);
            } else {
                setError("Failed to toggle recording.");
            }
        } catch (err) {
            console.error("Recording error:", err);
            setError("Error toggling recording.");
        }
    };

    const addDigit = (digit) => {
        if (callStatus === "In Progress" && activeCall) {
            activeCall.sendDigits(digit);
        }
        setNumber(prev => prev + digit);
    };

    const backspace = () => {
        setNumber(prev => prev.slice(0, -1));
    };

    return (
        <div className="fixed top-5 right-4 w-[95vw] sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 sm:p-4 md:p-6 z-50 animate-in fade-in slide-in-from-right-4 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                    <MdDialpad className="text-blue-600 text-lg sm:text-xl md:text-2xl" />
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">Phone Dialer</h3>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                    <MdClose size={20} className="sm:hidden" />
                    <MdClose size={24} className="hidden sm:block" />
                </button>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
                {error ? (
                    <div className="bg-red-50 border border-red-100 p-2 sm:p-3 md:p-4 rounded-xl mb-2 sm:mb-3 md:mb-4">
                        <p className="text-red-600 text-xs font-bold leading-relaxed">
                            {error}
                        </p>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-xl p-2 sm:p-3 md:p-4 min-h-[50px] sm:min-h-[56px] md:min-h-[64px] flex flex-col justify-center items-center relative group">
                        <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 tracking-wider break-all">
                            {number || "Enter Number"}
                        </span>
                        {number && callStatus === "Idle" && (
                            <button
                                onClick={backspace}
                                className="absolute right-2 sm:right-3 text-gray-400 hover:text-red-500 transition-colors text-lg"
                            >
                                ⌫
                            </button>
                        )}
                        <span className="text-xs font-medium text-blue-500 mt-1 uppercase tracking-widest flex items-center gap-1 flex-wrap justify-center">
                            {callStatus}
                            {isRecording && (
                                <span className="flex items-center gap-1 text-red-500 animate-pulse font-black">
                                    <MdFiberManualRecord size={10} className="sm:w-3 sm:h-3" /> REC
                                </span>
                            )}
                        </span>
                    </div>
                )}
            </div>

            {callStatus === "In Progress" && (
                <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
                    <button
                        onClick={handleRecordingToggle}
                        className={`flex items-center gap-1 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all 
                            ${isRecording ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}`}
                    >
                        <MdFiberManualRecord size={14} className={`${isRecording ? "animate-pulse" : ""}`} />
                        <span className="hidden sm:inline">{isRecording ? "Stop Recording" : "Record Call"}</span>
                        <span className="sm:hidden">{isRecording ? "Stop" : "Record"}</span>
                    </button>
                </div>
            )}

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-3 gap-1.5 mb-3 sm:mb-4 md:mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((digit) => (
                    <button
                        key={digit}
                        onClick={() => addDigit(digit.toString())}
                        className="h-9 sm:h-10 md:h-11 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm md:text-base flex items-center justify-center transition-all active:scale-90"
                    >
                        {digit}
                    </button>
                ))}
            </div>

            {/* Prefix Helpers */}
            <div className="flex justify-center gap-2 mb-4 sm:mb-6 md:mb-8">
                <button
                    onClick={() => {
                        if (!number.startsWith('+')) {
                            setNumber(prev => '+' + prev);
                        }
                    }}
                    className="h-10 sm:h-11 md:h-12 w-10 sm:w-11 md:w-12 rounded-full bg-blue-50 text-blue-600 font-bold text-lg sm:text-xl md:text-2xl flex items-center justify-center hover:bg-blue-100 transition-all active:scale-95 flex-shrink-0"
                >
                    +
                </button>
                <button
                    onClick={() => setNumber("")}
                    className="flex-1 h-10 sm:h-11 md:h-12 rounded-full bg-gray-50 text-gray-500 font-bold text-xs sm:text-sm uppercase flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 border border-transparent hover:border-red-100"
                >
                    Clear
                </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-start gap-2 mb-3 sm:mb-4 md:mb-6">
                <button
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                    className="flex-1 h-10 sm:h-11 md:h-12 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm uppercase flex items-center justify-center hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200"
                >
                    <span className="hidden sm:inline">← Previous</span>
                    <span className="sm:hidden">← Prev</span>
                </button>
                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className="flex-1 h-10 sm:h-11 md:h-12 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm uppercase flex items-center justify-center hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200"
                >
                    <span className="hidden sm:inline">Next →</span>
                    <span className="sm:hidden">Next →</span>
                </button>
            </div>

            <div className="flex justify-center gap-3 sm:gap-4 md:gap-4">
                {callStatus === "Idle" ? (
                    <button
                        onClick={handleCall}
                        disabled={!number}
                        className="h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdCall size={24} className="sm:w-8 sm:h-8 md:w-8 md:h-8" />
                    </button>
                ) : (
                    <button
                        onClick={handleHangup}
                        className="h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-200 transition-all active:scale-95 animate-pulse"
                    >
                        <MdCallEnd size={24} className="sm:w-8 sm:h-8 md:w-8 md:h-8" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Dialer;
