import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

function VerifyResetOtp() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const { axios, navigate, role } = useAppContext();
    const inputRefs = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleResendOtp = async () => {
        const toastId = toast.loading("Resending OTP...");
        setResendLoading(true);
        try {
            const email = JSON.parse(localStorage.getItem("Reset-Email"));
            if (!email) throw new Error("Email not found in local storage");

            const sendOtpRes = await axios.post("/api/reset-password/send-reset-otp", { email, role });

            if (sendOtpRes.data.success) {
                toast.success("OTP sent to email", { id: toastId });
            } else {
                toast.error(sendOtpRes.data.message || "Failed to resend OTP", { id: toastId });
            }
        } catch (error) {
            const backendMessage = error.response?.data?.message || error.message || "OTP sending failed";
            toast.error(backendMessage, { id: toastId });
        } finally {
            setResendLoading(false);
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 6) {
            return toast.error("Please enter a valid 6-digit OTP");
        }

        const resetEmail = JSON.parse(localStorage.getItem("Reset-Email"));
        if (!resetEmail) {
            toast.error("Email missing");
            return navigate(`/${role}-login`);
        }

        const toastId = toast.loading("Verifying OTP...");
        setLoading(true);

        try {
            const res = await axios.post("/api/reset-password/verify-reset-otp", {
                email: resetEmail,
                otp: enteredOtp
            });

            if (res.data.success) {
                toast.success("Reset OTP Verified", { id: toastId });
                navigate("/reset-password");
            } else {
                toast.error(res.data.message || "Reset OTP verification failed", { id: toastId });
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Reset OTP verification failed";
            toast.error(msg, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 sm:p-6 md:p-8">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/20 transform hover:scale-[1.01] transition-transform duration-300 w-full max-w-md p-4 sm:p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
                    Verify Reset OTP
                </h2>
                <p className="text-gray-300 text-center mb-4 sm:mb-6">Enter the 6-digit code sent to your email</p>
                <div className="flex justify-center gap-2 mb-4 sm:mb-6">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={value}
                            onChange={e => handleChange(e.target, index)}
                            onKeyDown={(e) => {
                                if (e.key === "Backspace") {
                                    e.preventDefault(); // Prevent default behavior
                                    const newOtp = [...otp];

                                    if (otp[index]) {
                                        // Clear current input if it's not empty
                                        newOtp[index] = "";
                                        setOtp(newOtp);
                                    } else if (index > 0) {
                                        // Move focus to previous and clear it
                                        inputRefs.current[index - 1]?.focus();
                                        newOtp[index - 1] = "";
                                        setOtp(newOtp);
                                    }
                                }
                            }}
                            disabled={loading || resendLoading}
                            className="w-10 h-12 text-center border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white"
                        />
                    ))}
                </div>
                <button
                    onClick={handleVerify}
                    disabled={loading || resendLoading}
                    className={`w-full py-2 sm:py-3 text-sm sm:text-base rounded-xl font-medium shadow-lg transition-all duration-200
                        ${loading ? "opacity-50 cursor-not-allowed bg-gray-600" : "bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl text-white"}`}
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>
                <p className="text-center mt-4 text-gray-400">
                    Didn't receive the code?{" "}
                    <button
                        onClick={handleResendOtp}
                        disabled={loading || resendLoading}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                    >
                        {resendLoading ? "Sending..." : "Resend OTP"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default VerifyResetOtp;
