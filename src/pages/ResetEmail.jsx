import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

function ResetEmail() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { axios, navigate, role } = useAppContext();

    const handleOnChange = (e) => {
        setEmail(e.target.value);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Sending OTP...");
        setLoading(true);

        try {
            const sendResetOtpRes = await axios.post("/api/reset-password/send-reset-otp", { email, role });

            if (sendResetOtpRes.data.success) {
                toast.success("Reset OTP sent to email", { id: toastId });

                // Store email temporarily
                localStorage.setItem("Reset-Email", JSON.stringify(email));

                navigate("/verify-reset-otp");
            }
        } catch (error) {
            const backendMessage = error.response?.data?.message || "OTP sending failed";
            toast.error(backendMessage, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 sm:p-6 md:p-8">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/20 transform hover:scale-[1.01] transition-transform duration-300 w-full max-w-md p-4 sm:p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
                    Reset Password
                </h2>

                <form onSubmit={handleOnSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleOnChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 text-white placeholder-gray-400"
                            placeholder="Enter your email"
                            pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 sm:py-3 text-sm sm:text-base rounded-xl font-medium shadow-lg transition-all duration-200
                            ${loading ? "opacity-50 cursor-not-allowed bg-gray-600" : "bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl text-white"}`}
                    >
                        {loading ? "Sending OTP..." : "Send Reset OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetEmail;
