import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import toast from "react-hot-toast";
import { useAppContext } from '../../context/AppContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import homeImage from "../../assets/astrology-zodiac-signs-circle.png"

function AstrologerSignup() {

    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", experience: "", phoneNumber: "" });
    const { firstName, lastName, email, password, confirmPassword, experience, phoneNumber } = formData;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { axios, navigate, setRole } = useAppContext();

    const handleOnChange = (e) => {
        setFormData((prevData) => {
            return {
                ...prevData,
                [e.target.name]: e.target.value,
            }
        })
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent double click

        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password is not same!");
        }
        else {
            setLoading(true);
            const loadingToastId = toast.loading("Sending OTP...");


            try {
                const sendOtpRes = await axios.post("/api/astrologer/send-otp", { email });
                toast.dismiss(loadingToastId);

                if (sendOtpRes.data.success) {
                    toast.success("OTP sent to email");
                    localStorage.setItem("signupData", JSON.stringify({ firstName, lastName, email, password, confirmPassword, role: "astrologer", experience, phoneNumber }));
                    navigate("/verify-otp");
                }
            } catch (error) {
                toast.dismiss(loadingToastId);
                const backendMessage = error.response?.data?.message || "OTP sending failed";
                console.log("OTP ERROR :", error);
                toast.error(backendMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-16 w-full max-w-7xl">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 lg:block hidden">
                    <img
                        src={homeImage}
                        alt="homeImage"
                        className="w-full h-auto object-contain"
                    />
                </div>

                <div className="w-full lg:w-1/2 px-2 sm:px-4">
                    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 transform hover:scale-[1.01] transition-transform duration-300 my-4 sm:my-6">
                        <div className="p-4 sm:p-6 md:p-8">
                            <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
                                Create Astrologer Account
                            </h2>
                            <form onSubmit={handleOnSubmit} className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">First Name</label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white"
                                            value={firstName}
                                            onChange={handleOnChange}
                                            disabled={loading}
                                            placeholder="Enter First Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">Last Name</label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white"
                                            value={lastName}
                                            onChange={handleOnChange}
                                            disabled={loading}
                                            placeholder="Enter Last Name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white"
                                        value={email}
                                        onChange={handleOnChange}
                                        disabled={loading}
                                        placeholder="Enter your email address"
                                        pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="experience" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">Experience (Years)</label>
                                        <input
                                            id="experience"
                                            type="number"
                                            name="experience"
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white"
                                            value={experience}
                                            onChange={handleOnChange}
                                            disabled={loading}
                                            placeholder="Enter years of experience"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phoneNumber" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">Phone Number</label>
                                        <input
                                            id="phoneNumber"
                                            type="tel"
                                            name="phoneNumber"
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white"
                                            value={phoneNumber}
                                            onChange={handleOnChange}
                                            disabled={loading}
                                            placeholder="Enter phone number"
                                            pattern="[0-9]{10}"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="password" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">Password</label>
                                        <div className="flex">
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-600 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white"
                                                value={password}
                                                onChange={handleOnChange}
                                                disabled={loading}
                                                placeholder="Enter Password"
                                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$"
                                                required
                                            />
                                            <button
                                                className="px-3 sm:px-4 border border-l-0 border-gray-600 rounded-r-xl hover:bg-gray-600 transition-colors duration-200 bg-gray-700"
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                disabled={loading}
                                            >
                                                {showPassword ? (
                                                    <AiOutlineEyeInvisible className="text-lg sm:text-xl text-gray-300" />
                                                ) : (
                                                    <AiOutlineEye className="text-lg sm:text-xl text-gray-300" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">Confirm Password</label>
                                        <div className="flex">
                                            <input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-600 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white"
                                                value={confirmPassword}
                                                onChange={handleOnChange}
                                                disabled={loading}
                                                placeholder="Confirm Password"
                                                required
                                            />
                                            <button
                                                className="px-3 sm:px-4 border border-l-0 border-gray-600 rounded-r-xl hover:bg-gray-600 transition-colors duration-200 bg-gray-700"
                                                type="button"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                disabled={loading}
                                            >
                                                {showConfirmPassword ? (
                                                    <AiOutlineEyeInvisible className="text-lg sm:text-xl text-gray-300" />
                                                ) : (
                                                    <AiOutlineEye className="text-lg sm:text-xl text-gray-300" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-purple-600 text-white py-2 sm:py-3 text-sm sm:text-base rounded-xl font-medium shadow-lg transition-all duration-200
                                          ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl"}`}
                                    >
                                        {loading ? "Sending OTP..." : "Sign Up"}
                                    </button>
                                </div>

                                <div className="text-center gap-x-2 flex flex-col sm:flex-row justify-center items-center text-sm sm:text-base">
                                    <p className="text-gray-400">Already have an account?</p>
                                    <NavLink to="/astrologer-login" className="inline-block text-purple-400 font-medium hover:text-purple-300 transition-colors duration-200">
                                        Sign In
                                    </NavLink>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                        <NavLink
                            to="/user-signup"
                            onClick={() => setRole("user")}
                            className="w-1/2 block text-center bg-purple-600 text-white py-2 sm:py-3 text-sm sm:text-base rounded-xl font-medium shadow-lg transition-all duration-200 hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl"
                        >
                            Continue as User
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AstrologerSignup