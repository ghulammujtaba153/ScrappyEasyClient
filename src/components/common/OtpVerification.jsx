import React, { useState, useRef, useEffect } from "react";

const OtpVerification = ({ email, onVerify, onResend, loading = false }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef([]);

    // Derive canResend from resendTimer
    const canResend = resendTimer === 0;

    // Timer for resend button
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }
        onVerify(otpString);
    };

    const handleResend = () => {
        if (!canResend) return;
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setResendTimer(60);
        onResend();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h3>
                <p className="text-gray-600 text-sm">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-semibold text-purple-600">{email}</span>
                </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${error ? "border-red-500" : "border-gray-300"
                            } ${digit ? "border-purple-500 bg-purple-50" : ""}`}
                        disabled={loading}
                    />
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Verify Button */}
            <button
                onClick={handleSubmit}
                disabled={loading || otp.join("").length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying...
                    </span>
                ) : (
                    "Verify OTP"
                )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Didn't receive the code?{" "}
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                        >
                            Resend OTP
                        </button>
                    ) : (
                        <span className="text-gray-400">
                            Resend in {resendTimer}s
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default OtpVerification;
