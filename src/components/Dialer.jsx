import React, { useState, useEffect } from "react";
import { Device } from "@twilio/voice-sdk";
import { MdCall, MdDialpad, MdMic, MdMicOff, MdCallEnd, MdClose, MdFiberManualRecord } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../config/URL";

const Dialer = ({ onClose, phoneNumber, onCallEnd }) => {
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
                const { token } = response.data;

                const newDevice = new Device(token, {
                    logLevel: 1,
                    edge: "ashburn",
                });

                newDevice.on("registered", () => console.log("Twilio Device Registered"));
                newDevice.on("error", (error) => console.error("Twilio Device Error:", error));

                await newDevice.register();
                setDevice(newDevice);
            } catch (error) {
                console.error("Failed to initialize Twilio device:", error);
            }
        };

        init();

        return () => {
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
        <div className="fixed top-5 right-4 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <MdDialpad className="text-blue-600 text-xl" />
                    <h3 className="font-bold text-gray-800">Phone Dialer</h3>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MdClose size={24} />
                </button>
            </div>

            <div className="mb-6">
                {error ? (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-4">
                        <p className="text-red-600 text-xs font-bold leading-relaxed">
                            {error}
                        </p>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-xl p-4 min-h-[64px] flex flex-col justify-center items-center relative group">
                        <span className="text-2xl font-semibold text-gray-800 tracking-wider">
                            {number || "Enter Number"}
                        </span>
                        {number && callStatus === "Idle" && (
                            <button
                                onClick={backspace}
                                className="absolute right-3 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                ⌫
                            </button>
                        )}
                        <span className="text-xs font-medium text-blue-500 mt-1 uppercase tracking-widest flex items-center gap-2">
                            {callStatus}
                            {isRecording && (
                                <span className="flex items-center gap-1 text-red-500 animate-pulse font-black ml-2">
                                    <MdFiberManualRecord /> REC
                                </span>
                            )}
                        </span>
                    </div>
                )}
            </div>

            {callStatus === "In Progress" && (
                <div className="flex justify-center mb-6">
                    <button
                        onClick={handleRecordingToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all 
                            ${isRecording ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}`}
                    >
                        <MdFiberManualRecord className={isRecording ? "animate-pulse" : ""} />
                        {isRecording ? "Stop Recording" : "Record Call"}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((digit) => (
                    <button
                        key={digit}
                        onClick={() => addDigit(digit.toString())}
                        className="h-14 w-14 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xl flex items-center justify-center transition-all active:scale-90"
                    >
                        {digit}
                    </button>
                ))}
            </div>

            {/* Prefix Helpers */}
            <div className="flex justify-center gap-2 mb-8">
                <button
                    onClick={() => {
                        if (!number.startsWith('+')) {
                            setNumber(prev => '+' + prev);
                        }
                    }}
                    className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 font-bold text-xl flex items-center justify-center hover:bg-blue-100 transition-all active:scale-95"
                >
                    +
                </button>
                <button
                    onClick={() => setNumber("")}
                    className="flex-1 h-12 rounded-full bg-gray-50 text-gray-500 font-bold text-sm uppercase flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 border border-transparent hover:border-red-100"
                >
                    Clear Number
                </button>
            </div>

            <div className="flex justify-center gap-4">
                {callStatus === "Idle" ? (
                    <button
                        onClick={handleCall}
                        disabled={!number}
                        className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdCall size={32} />
                    </button>
                ) : (
                    <button
                        onClick={handleHangup}
                        className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-200 transition-all active:scale-95 animate-pulse"
                    >
                        <MdCallEnd size={32} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Dialer;
