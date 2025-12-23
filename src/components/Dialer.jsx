import React, { useState, useEffect } from "react";
import { Device } from "@twilio/voice-sdk";
import { MdCall, MdCallEnd, MdDialpad, MdClose } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../config/URL";

const Dialer = ({ onClose, phoneNumber, onCallEnd }) => {
    const [number, setNumber] = useState(phoneNumber || "");
    const [callStatus, setCallStatus] = useState("Idle"); // Idle, Connecting, In Progress
    const [device, setDevice] = useState(null);
    const [activeCall, setActiveCall] = useState(null);

    // Track the last prop value to detect actual changes from the parent
    const [prevPhoneNumber, setPrevPhoneNumber] = useState(phoneNumber);

    // Synchronize number when the phoneNumber prop changes from outside
    if (phoneNumber !== prevPhoneNumber) {
        setPrevPhoneNumber(phoneNumber);
        setNumber(phoneNumber || "");
    }

    useEffect(() => {
        const init = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/call/token`);
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
                console.error("Failed to initialize Twilio Device:", error);
            }
        };
        init();
    }, []); // Only on mount

    useEffect(() => {
        return () => {
            if (device) {
                device.destroy();
            }
        };
    }, [device]);

    const handleCall = async () => {
        if (!device || !number) return;

        setCallStatus("Connecting");
        try {
            const call = await device.connect({
                params: { To: number }
            });

            call.on("accept", () => setCallStatus("In Progress"));
            call.on("disconnect", () => {
                setCallStatus("Idle");
                setActiveCall(null);
                if (onCallEnd) onCallEnd();
            });
            call.on("error", (error) => {
                console.error("Call Error:", error);
                setCallStatus("Idle");
                setActiveCall(null);
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
                    <span className="text-xs font-medium text-blue-500 mt-1 uppercase tracking-widest">
                        {callStatus}
                    </span>
                </div>
            </div>

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
